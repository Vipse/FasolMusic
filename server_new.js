var path = require('path');
var express = require('express');
var ws = require('ws');
var minimist = require('minimist');
var url = require('url');
var kurento = require('kurento-client');
var fs    = require('fs');
var https = require('https');

var argv = minimist(process.argv.slice(2), {
  default: {
      as_uri: "https://localhost:8443/",
      ws_uri: "ws://localhost:8888/kurento",
      video_uri: 'file:///tmp/recorder_demo.mp4',
      audio_uri: 'file:///tmp/recorder_demo.mp3',
  }
});

var options =
{
  key:  fs.readFileSync('/etc/ssl/appdoc/private.key'),
  cert: fs.readFileSync('/etc/ssl/appdoc/server.pem')
};
/*var options =
{
  key:  fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt')
};*/

var app = express();


var kurentoClient = null;
var userRegistry = new UserRegistry();
var chatStories = new ChatStories();
var pipelines = {};
var candidatesQueue = {};
var idCounter = 0;
var candidates_ready = {};

var recorder;
var recordsCounter = 0;

function nextUniqueId() {
    idCounter++;
    return idCounter.toString();
}


// Represents caller and callee sessions
function UserSession(id, name, ws) {
    this.id = id;
    this.name = name;
    this.ws = ws;
    this.peer = null;
    this.sdpOffer = null;
}

UserSession.prototype.sendMessage = function(message) {
    this.ws.send(JSON.stringify(message));
}

// Represents registrar of users
function UserRegistry() {
    this.usersById = {};
    this.usersByName = {};
}

UserRegistry.prototype.register = function(user) {
    this.usersById[user.id] = user;
    this.usersByName[user.name] = user;
}

UserRegistry.prototype.unregister = function(id) {
    var user = this.getById(id);
    if (user) delete this.usersById[id]
    if (user && this.getByName(user.name)) delete this.usersByName[user.name];
}

UserRegistry.prototype.getById = function(id) {
    return this.usersById[id];
}

UserRegistry.prototype.getByName = function(name) {
    return this.usersByName[name];
}

UserRegistry.prototype.removeById = function(id) {
    var userSession = this.usersById[id];
    if (!userSession) return;
    delete this.usersById[id];
    delete this.usersByName[userSession.name];
}

// {'id_doc1':{'id_user1': [], 'id_user2': [] ...}}
function ChatStories(){
    this.doctorsChat = {};
}

ChatStories.prototype.addDoctor = function(id){
    this.doctorsChat[id]
        ? null : this.doctorsChat[id] = {};
}

ChatStories.prototype.addPatient = function(doc_id, user_id){
    this.doctorsChat[doc_id][user_id] = [];
}

ChatStories.prototype.isChatOpen = function(doc_id, user_id){
    return this.doctorsChat[doc_id]
        ? (this.doctorsChat[doc_id].hasOwnProperty(user_id))
        : false;
}

ChatStories.prototype.addMessage = function(doc_id, user_id, message){
    this.doctorsChat[doc_id][user_id].push(message);
}

ChatStories.prototype.getMessages = function(doc_id, user_id){
    return this.doctorsChat[doc_id][user_id];
}

ChatStories.prototype.clearChat = function(doc_id){
    delete this.doctorsChat[doc_id];
}

// Represents a B2B active call
function CallMediaPipeline() {
    this.pipeline = null;
    this.webRtcEndpoint = {};
}

CallMediaPipeline.prototype.createPipeline = function(callerId, calleeId, ws, mode, receptionId, callback) {
    var self = this;
    getKurentoClient(function(error, kurentoClient) {
        if (error) {
            return callback(error);
        }

        kurentoClient.create('MediaPipeline', function(error, pipeline) {
            if (error) {
                return callback(error);
            }

            pipeline.create('WebRtcEndpoint', function(error, callerWebRtcEndpoint){
                if (error) {
                    pipeline.release();
                    return callback(error);
                }

                if (candidatesQueue[callerId]) {
                    while(candidatesQueue[callerId].length) {
                        var candidate = candidatesQueue[callerId].shift();
                        callerWebRtcEndpoint.addIceCandidate(candidate);
                    }
                }

                callerWebRtcEndpoint.on('OnIceCandidate', function(event) {
                    var candidate = kurento.getComplexType('IceCandidate')(event.candidate);
                    userRegistry.getById(callerId).ws.send(JSON.stringify({
                        id : 'iceCandidate',
                        candidate : candidate
                    }));
                });

                pipeline.create('WebRtcEndpoint', function(error, calleeWebRtcEndpoint) {
                    if (error) {
                        pipeline.release();
                        return callback(error);
                    }

                    if (candidatesQueue[calleeId]) {
                        while(candidatesQueue[calleeId].length) {
                            var candidate = candidatesQueue[calleeId].shift();
                            calleeWebRtcEndpoint.addIceCandidate(candidate);
                        }
                    }

                    calleeWebRtcEndpoint.on('OnIceCandidate', function(event) {
                        var candidate = kurento.getComplexType('IceCandidate')(event.candidate);
                        userRegistry.getById(calleeId).ws.send(JSON.stringify({
                            id : 'iceCandidate',
                            candidate : candidate
                        }));
                    });


                    pipeline.create('Composite', function(error, _composite) {
                        if (error) {
                            pipeline.release();
                            return callback(error);
                        }

                        _composite.createHubPort(function(error, _callerHubport) {
                            if (error) {
                                pipeline.release();
                                return callback(error);
                            }
                            _composite.createHubPort(function(error, _calleeHubport) {
                                if (error) {
                                    pipeline.release();
                                    return callback(error);
                                }
                                _composite.createHubPort(function(error, _recorderHubport) {
                                    if (error) {
                                        pipeline.release();
                                        return callback(error);
                                    }

                                    recordsCounter++;
                                    var recorderParams = {
                                        uri : mode === 'video'
                                            ? 'file:///media/audiovideo/'+receptionId+'.mp4'
                                            : 'file:///media/audiovideo/'+receptionId+'.mp3',
                                    }

                                    pipeline.create('RecorderEndpoint', recorderParams, function(error, recorderEndpoint) {
                                        if (error) {
                                            pipeline.release();
                                            return callback(error);
                                        }

                                        self.recorderEndpoint = recorderEndpoint;

                                        _recorderHubport.connect(recorderEndpoint, function(error) {
                                            if (error) {
                                                pipeline.release();
                                                return callback(error);
                                            }

                                            callerWebRtcEndpoint.connect(_callerHubport, function(error) {
                                                if (error) {
                                                    pipeline.release();
                                                    return callback(error);
                                                }

                                                calleeWebRtcEndpoint.connect(_calleeHubport, function(error) {
                                                    if (error) {
                                                        pipeline.release();
                                                        return callback(error);
                                                    }
                                                            callerWebRtcEndpoint.connect(calleeWebRtcEndpoint, function(error) {
                                                                if (error) {
                                                                    pipeline.release();
                                                                    return callback(error);
                                                                }

                                                                calleeWebRtcEndpoint.connect(callerWebRtcEndpoint, function(error) {
                                                                    if (error) {
                                                                        pipeline.release();
                                                                        return callback(error);
                                                                    }
                                                                });
                                                            });

                                                            recorderEndpoint.record();
                                                            self.pipeline = pipeline;
                                                            self.webRtcEndpoint[callerId] = callerWebRtcEndpoint;
                                                            self.webRtcEndpoint[calleeId] = calleeWebRtcEndpoint;
                                                            callback(null);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
            });
        });
    })
}

CallMediaPipeline.prototype.generateSdpAnswer = function(id, sdpOffer, callback) {
    this.webRtcEndpoint[id].processOffer(sdpOffer, callback);
    this.webRtcEndpoint[id].gatherCandidates(function(error) {
        if (error) {
            return callback(error);
        }
    });
}

CallMediaPipeline.prototype.release = function() {
    if (this.pipeline) this.pipeline.release();
    this.pipeline = null;
}

/*
 * Server startup
 */

var asUrl = url.parse(argv.as_uri);
var port = asUrl.port;
var server = https.createServer(options, app).listen(port, function() {});

var wss = new ws.Server({
    server : server,
    path : '/one2one'
});

wss.on('connection', function(ws) {
    var sessionId = nextUniqueId();


    ws.on('error', function(error) {
        stop(sessionId);
    });

    ws.on('close', function() {
        stop(sessionId);
        userRegistry.unregister(sessionId);
    });

    ws.on('message', function(_message) {
        var message = JSON.parse(_message);
        //console.log(message);
        switch (message.id) {
        case 'register':
            register(sessionId, message.name, message.other_name, ws, message.mode);
            break;

        case 'call':
            call(sessionId, message.to, message.from, message.sdpOffer, message.receptionId, message.userData);
            break;

        case 'incomingCallResponse':
            incomingCallResponse(sessionId, message.from, message.callResponse, message.sdpOffer, ws, message.mode, message.receptionId);
            break;

        case 'stop':
            stop(sessionId);
            break;

        case 'chat':
            chatting(sessionId, message.to, message.from, message.text, message.date, message);
            break;

        case 'startReception':
            startReception(message.name, message.other_name, message.receptionId);
            break;

        case 'closeReception':
            closeReception(message.name, message.other_name, message.receptionId);
            break;

        case 'onIceCandidate':
            onIceCandidate(sessionId, message.candidate);
            break;

        default:
            ws.send(JSON.stringify({
                id : 'error',
                message : 'Invalid message ' + message
            }));
            break;
        }

    });
});

// Recover kurentoClient for the first time.
function getKurentoClient(callback) {
    if (kurentoClient !== null) {
        return callback(null, kurentoClient);
    }

    kurento(argv.ws_uri, function(error, _kurentoClient) {
        if (error) {
            var message = 'Coult not find media server at address ' + argv.ws_uri;
            return callback(message + ". Exiting with error " + error);
        }

        kurentoClient = _kurentoClient;
        callback(null, kurentoClient);
    });
}

function sendCurrentChat(whom, doc_id, user_id){
    var message = {
        id: 'chatHistory',
        chat: chatStories.getMessages(doc_id, user_id),
    };
    userRegistry.getByName(whom).sendMessage(message);
}

function chatting(callerId, to, from, text, date, _message){

    var caller = userRegistry.getById(callerId);
    var callee = userRegistry.getByName(to);
        callee && (callee.peer = from);
        caller && (caller.peer = to);

var message = text ? {
	id: 'chat',from,to,text,date
} : Object.assign({
    id:'chat',from,to,date},_message);

        if(chatStories.doctorsChat[from]){
            if (!_message.isVisEnd) chatStories.addMessage(from, to, message);
            else chatStories.clearChat(from);
            try{
                callee && callee.sendMessage(message);
                caller && caller.sendMessage(message);
                return;
            } catch(exception) {
                console.log("Error " + exception);
            }
        }
        else{
            if(chatStories.doctorsChat[to] && chatStories.isChatOpen(to, from)){
                chatStories.addMessage(to, from, message);
                try{
                    callee && callee.sendMessage(message);
                    caller && caller.sendMessage(message);
                    return;
                } catch(exception) {
                    console.log("Error " + exception);
                }
            }
            else
                console.log('doctor is not ready')
        }
}

function stop(sessionId) {
    if (!pipelines[sessionId]) {
        return;
    }
    var pipeline = pipelines[sessionId];
    delete pipelines[sessionId];

    if (pipeline.recorderEndpoint)
        pipeline.recorderEndpoint.stop();

    pipeline.release();
    var stopperUser = userRegistry.getById(sessionId);
    var stoppedUser = userRegistry.getByName(stopperUser.peer);
    stopperUser.peer = null;

    if (stoppedUser) {
        stoppedUser.peer = null;
        delete pipelines[stoppedUser.id];
        var message = {
            id: 'stopCommunication',
            message: 'remote user hanged out'
        }
        stoppedUser.sendMessage(message)
    }

    clearCandidatesQueue(sessionId);

}

function incomingCallResponse(calleeId, from, callResponse, calleeSdp, ws, mode, receptionId) {

    clearCandidatesQueue(calleeId);

    function onError(callerReason, calleeReason) {
        if (pipeline) pipeline.release();
        if (caller) {
            var callerMessage = {
                id: 'callResponse',
                response: 'rejected'
            }
            if (callerReason) callerMessage.message = callerReason;
            caller.sendMessage(callerMessage);
        }

        var calleeMessage = {
            id: 'stopCommunication'
        };
        if (calleeReason) calleeMessage.message = calleeReason;
        callee.sendMessage(calleeMessage);
    }

    var callee = userRegistry.getById(calleeId);
    if (!from || !userRegistry.getByName(from)) {
        return onError(null, 'unknown from = ' + from);
    }
    var caller = userRegistry.getByName(from);

    if (callResponse === 'accept') {
        var pipeline = new CallMediaPipeline();
        pipelines[caller.id] = pipeline;
        pipelines[callee.id] = pipeline;

        pipeline.createPipeline(caller.id, callee.id, ws, mode, receptionId, function(error) {
            if (error) {
                return onError(error, error);
            }

            pipeline.generateSdpAnswer(caller.id, caller.sdpOffer, function(error, callerSdpAnswer) {
                if (error) {
                    return onError(error, error);
                }

                pipeline.generateSdpAnswer(callee.id, calleeSdp, function(error, calleeSdpAnswer) {
                    if (error) {
                        return onError(error, error);
                    }

                    var message = {
                        id: 'startCommunication',
                        sdpAnswer: calleeSdpAnswer
                    };
                    callee.sendMessage(message);

                    message = {
                        id: 'callResponse',
                        response : 'accepted',
                        sdpAnswer: callerSdpAnswer
                    };
                    caller.sendMessage(message);
                });
            });
        });
    } else {
        var decline = {
            id: 'callResponse',
            response: 'rejected',
            message: 'user declined'
        };
        caller.sendMessage(decline);
    }
}

function call(callerId, to, from, sdpOffer, receptionId, userData) {
    clearCandidatesQueue(callerId);


    var caller = userRegistry.getById(callerId);
    var rejectCause = 'User ' + to + ' is not registered';
    if (userRegistry.getByName(to)) {
        var callee = userRegistry.getByName(to);
        caller.sdpOffer = sdpOffer
        callee.peer = from;
        caller.peer = to;
        var message = {
            id: 'incomingCall',
            from: from,
            receptionId: receptionId,
            userData: userData
        };
        try{
            return callee.sendMessage(message);
        } catch(exception) {
            rejectCause = "Error " + exception;
        }
    }
    var message  = {
        id: 'callResponse',
        response: 'rejected: ',
        message: rejectCause
    };
    caller.sendMessage(message);
}

function startReception(name, other_name, receptionId){
        !chatStories.isChatOpen(name, other_name) && (
            chatStories.addDoctor(name),
            chatStories.addPatient(name, other_name)
        )
        var callee = userRegistry.getByName(other_name);
        try{
            callee && callee.sendMessage({
                id: 'startReception',
                receptionId,
                by: name,
            });
            return;
        } catch(exception) {
            console.log("Error " + exception);
        }
}

function closeReception(name, other_name, receptionId){
        var callee = userRegistry.getByName(other_name);
        try{
            callee && callee.sendMessage({
                id: 'closeReception',
                by: name,
                receptionId
            });
            return;
        } catch(exception) {
            console.log("Error " + exception);
        }
}

function register(id, name, other_name, ws, mode, callback) {
    function onError(error) {
        ws.send(JSON.stringify({id:'registerResponse', response : 'rejected ', message: error}));
    }

    if (!name) {
        return onError("empty user name");
    }

    if (userRegistry.getByName(name)) {
        return onError("User " + name + " is already registered");
    }

    console.log("register", name);
    userRegistry.register(new UserSession(id, name, ws));

    mode === 'doc'
        ? (chatStories.isChatOpen(name, other_name)
            && sendCurrentChat(name, name, other_name)
            )
        : (chatStories.isChatOpen(other_name, name)
            && sendCurrentChat(name, other_name, name)
        )

    try {
        ws.send(JSON.stringify({id: 'registerResponse', response: 'accepted'}));
    } catch(exception) {
        onError(exception);
    }
}

function clearCandidatesQueue(sessionId) {
    if (candidatesQueue[sessionId]) {
        delete candidatesQueue[sessionId];
    }
}

function onIceCandidate(sessionId, _candidate) {
    var candidate = kurento.getComplexType('IceCandidate')(_candidate);
    var user = userRegistry.getById(sessionId);

    if (pipelines[user.id] && pipelines[user.id].webRtcEndpoint && pipelines[user.id].webRtcEndpoint[user.id]) {
        var webRtcEndpoint = pipelines[user.id].webRtcEndpoint[user.id];
        webRtcEndpoint.addIceCandidate(candidate);
    }
    else {
        if (!candidatesQueue[user.id]) {
            candidatesQueue[user.id] = [];
        }
        candidatesQueue[sessionId].push(candidate);
    }
}

app.use(express.static(path.join(__dirname)));
