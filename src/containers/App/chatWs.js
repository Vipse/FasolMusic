import kurentoUtils from 'kurento-utils'
import {Modal} from "antd";
import { detect } from 'detect-browser';
const browser = detect();
let ws,
    callbacks,
    props;

var webRtcPeer;
var videoInput;
var videoOutput;

const NOT_REGISTERED = 0;
const REGISTERING = 1;
const REGISTERED = 2;
var registerState = null

const NO_CALL = 0;
const PROCESSING_CALL = 1;
const IN_CALL = 2;
var callState = null;

let timerInterval;

export const sendMessage = (message) => {
    ws.send(JSON.stringify(message));
}

export const setVideoIn = (video) => {
    videoInput = video;
}
export const setVideoOut = (video) => {
    videoOutput = video;
}

export function createSocket(wsUrl,_props,_callbacks) {
    ws = new WebSocket(wsUrl);
    props = _props;
    callbacks = _callbacks;
    ws.onmessage = (message) => {
        let parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.id){
            case 'registerResponse':
                resgisterResponse(parsedMessage);
                break;
            case 'startReception':
            console.log(callbacks.get_history());
            callbacks.get_history().location.pathname !== '/app/chat'
                && callbacks.get_history().push('/app/chat');
                callbacks.setReceptionStatus(true);

                const visitInfo = callbacks.get_visitInfo();
                const {visitId} = visitInfo;
                !visitId && (
                    callbacks.onSelectReception(parsedMessage.receptionId),
                    callbacks.setChatToId(parsedMessage.by)
                )
				break;
			case 'closeReception':
                callbacks.setReceptionStatus(false);
                callbacks.show_review_modal(parsedMessage.receptionId, parsedMessage.by);
                break;
            case 'callResponse':
				callResponse(parsedMessage);
                break;
            case 'incomingCall':
				incomingCall(parsedMessage);
                break;
            case 'startCommunication':
                startCommunication(parsedMessage);
                break;
            case 'stopCommunication':
				stop(true);
                break;
            case 'chat':
                callbacks.setChatStory([...callbacks.get_chatStory(), {...parsedMessage}]);
                break;
            case 'chatHistory':
				(parsedMessage.chat.length > 0) && (
                    callbacks.setReceptionStatus(true),
                    callbacks.setChatStory(parsedMessage.chat)
                );
                break;
            case 'iceCandidate':
				webRtcPeer.addIceCandidate(parsedMessage.candidate)
                break;
            default:
				console.error('Unrecognized message', parsedMessage);
        }
    }

    return ws;
}
export function closeSocket() {
    clearInterval(timerInterval);
    ws && ws.close();
}

const resgisterResponse = (message) => {
    if (message.response == 'accepted') {
        setRegisterState(REGISTERED);
    } else {
        setRegisterState(NOT_REGISTERED);
        var errorMessage = message.message ? message.message
                : 'Unknown reason for register rejection.';
        console.log(errorMessage);
        //window.alert('Error registering user. See console for further information.');
    }
}

const setRegisterState = (nextState) => {
    switch (nextState) {
    case REGISTERED:
        setCallState(NO_CALL);
        break;
    default:
        return;
    }
    registerState = nextState;
}

const setCallState = (nextState) => {
    nextState === IN_CALL ? timerInterval = setInterval(timer, 1000) : null;
    callState = nextState;
}

const timer = () => {
    let timer = callbacks.get_timer();
    timer.s >= 59
        ? (
            timer.m >= 59
                ?   callbacks.setNewTimer({
                        h: timer.h +1,
                        s: 0,
                        m: 0,
                    })
                : callbacks.setNewTimer({
                    ...timer,
                    m: timer.m +1,
                    s: 0,
                })
        )
        :
        callbacks.setNewTimer({
            ...timer,
            s: timer.s +1,
        })
}

export const register = (id1, id2, user_mode) => {
    callbacks.setChatFromId(id1);
    setRegisterState(REGISTERING);

    ws.onopen = () => sendMessage({
        id : 'register',
        name : id1,
        other_name: id2,
        mode: user_mode,
    });
}

export const stop = (flag) => {
    callbacks.setIsCallingStatus(false);
    clearInterval(timerInterval);
    callbacks.setNewTimer({
        h: 0,
        s: 0,
        m: 0,
    })
    setCallState(NO_CALL);
    if (webRtcPeer) {
        webRtcPeer.dispose();
        webRtcPeer = null;

        (!flag) && sendMessage({id : 'stop'});
    }
}

const callResponse = (message) => {
    const visitInfo = callbacks.get_visitInfo();
    const {name, name_doc} = visitInfo;

    let msg = {
        id : 'chat',
        type: message.response != 'accepted' ? "notBegin" : "begin",
        name: callbacks.get_user_mode() === "user" ? name_doc : name,
        from: callbacks.get_from(),
        to: callbacks.get_to(),
        date: Math.ceil(Date.now()/1000),
    }
    if (message.response != 'accepted') {
        console.info('Call not accepted by peer. Closing call');
        var errorMessage = message.message ? message.message
                : 'Unknown reason for call rejection.';
        console.log(errorMessage);
        stop(true);
    } else {
        setCallState(IN_CALL);
        webRtcPeer.processAnswer(message.sdpAnswer);
    }
    sendMessage(msg);
}

const onIceCandidate = (candidate) => {
    sendMessage({
        id : 'onIceCandidate',
        candidate : candidate
    });
}

const incomingCall = (message) => {
    // If bussy just reject without disturbing user
    if (callState != NO_CALL) {
        return sendMessage({
            id : 'incomingCallResponse',
            from : message.from,
            callResponse : 'reject',
            message : 'bussy'
        });
    }
    setCallState(PROCESSING_CALL);

    if(browser && browser.name==="safari") {
        console.log("this is safari")
        Modal.confirm({
            title: `Доктор ${message.userData.name} звонит вам, хотите ли вы принять вызов?`,
            width: '300px',
            okText: 'Да',
            cancelText: 'Нет',
            centered: true,
            onOk() {
                acceptCall();
            },
            onCancel() {
                declineCall();
            }})

    } else {
        let call = new Audio("/project/templates/_ares/static/media/incoming_call.mp3");
        call.play().then(
            Modal.confirm({
                title: `Доктор ${message.userData.name} звонит вам, хотите ли вы принять вызов?`, //4124
                width: '300px',
                okText: 'Да',
                cancelText: 'Нет',
                centered: true,
                onOk() {
                    call.pause();
                    acceptCall();
                },
                onCancel() {
                    call.pause();
                    declineCall();
                }})
        );
    }





    function acceptCall() {


        callbacks.get_history().location.pathname !== '/app/chat'
        && callbacks.get_history().push('/app/chat');
        callbacks.setReceptionStatus(true);
        callbacks.setIsCallingStatus(true);
        callbacks.setChatToId(message.from);

        const visitInfo = callbacks.get_visitInfo();
        const {visitId} = visitInfo;


        !visitId ? callbacks.onSelectReception(message.receptionId, function(){
            continueCall();
            return;
        }) : continueCall();

        function continueCall(){
            let _visitInfo = callbacks.get_visitInfo();
            let {contactLevel} = _visitInfo;
            let options = contactLevel === 'video' ?
                {
                    localVideo : videoInput,
                    remoteVideo : videoOutput,
                    onicecandidate : onIceCandidate
                } : {
                    mediaConstraints: {
                        audio:true,
                        video:false
                    },
                    remoteVideo : videoOutput,
                    onicecandidate : onIceCandidate
                };

            webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
                    function(error) {
                        if (error) {
                            console.error(error);
                            setCallState(NO_CALL);
                        }

                        this.generateOffer(function(error, offerSdp) {
                            if (error) {
                                console.error(error);
                                setCallState(NO_CALL);
                            }
                            sendMessage({
                                id : 'incomingCallResponse',
                                from : message.from,
                                callResponse : 'accept',
                                sdpOffer : offerSdp,
                                mode: contactLevel,
                            });
                        });
                    });
        }
    }

    function declineCall() {
        sendMessage({
            id : 'incomingCallResponse',
            from : message.from,
            callResponse : 'reject',
            message : 'user declined'
        });
        stop(true);
    }
};

const startCommunication = (message) => {
    setCallState(IN_CALL);
    webRtcPeer.processAnswer(message.sdpAnswer);
};

export const startReception = () => {
    const visitInfo = callbacks.get_visitInfo();
    const {id: receptionId} = visitInfo;
    sendMessage({
        id : 'startReception',
        name: callbacks.get_from(),
        other_name: callbacks.get_to(),
        receptionId,
    });
    sendMessage({
        id : 'chat',
        from: callbacks.get_from(),
        to: callbacks.get_to(),
        date: Math.ceil(Date.now()/1000),
        isDate: true,
    });
    callbacks.setReceptionStatus(true);
}

export const call = () => {
    !callbacks.get_receptionStarts() && callbacks.setReceptionStatus(true);
    callbacks.setIsCallingStatus(true);
    setCallState(PROCESSING_CALL);

    const visitInfo = callbacks.get_visitInfo();
    const {contactLevel} = visitInfo;

    
    let options = contactLevel === 'video' ?
            {
                localVideo : videoInput,
                remoteVideo : videoOutput,
                onicecandidate : onIceCandidate
            } : {
                mediaConstraints: {
                    audio:true,
                    video:false
                },
                remoteVideo : videoOutput,
                onicecandidate : onIceCandidate
            };

    webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(
            error) {
        if (error) {
            console.error(error);
            setCallState(NO_CALL);
        }

        const visitInfo = callbacks.get_visitInfo();
        const {id: receptionId} = visitInfo;

        this.generateOffer(function(error, offerSdp) {
            if (error) {
                console.error(error);
                setCallState(NO_CALL);
            }
            sendMessage({
                id : 'call',
                from: callbacks.get_from(),
                to: callbacks.get_to(),
                receptionId,
                userData: callbacks.get_shortDocInfo(),
                sdpOffer : offerSdp
            });
        });
    });
}

const checkTimeFormat = (number) => {
    return (''+number).length < 2 ? '0'+number : number;
}

export const messAboutStop = () => {
    const {s,m,h} = callbacks.get_timer();
    if(s || m || h){
        const callTime = h
            ? checkTimeFormat(h) +':'+ checkTimeFormat(m) +':'+ checkTimeFormat(s)
            : checkTimeFormat(m) +':'+ checkTimeFormat(s);
        sendMessage({
            id: 'chat',
            from: callbacks.get_from(),
            to: callbacks.get_to(),
            date: Math.ceil(Date.now()/1000),
            type: "stop",
            callTime,
        });
    }
}

export const messForCloseReception = (receptionId) => {
    sendMessage({
        id : 'closeReception',
        name: callbacks.get_from(),
        other_name: callbacks.get_to(),
        receptionId,
    });
    sendMessage({
        id : 'chat',
        from: callbacks.get_from(),
        to: callbacks.get_to(),
        date: Math.ceil(Date.now()/1000),
        isVisEnd: true,
    });
}

export const fileUploadCallback = (serverResponse) => {
    sendMessage({
        id: 'chat',
        from: callbacks.get_from(),
        to: callbacks.get_to(),
        date: Math.ceil(Date.now()/1000),
        ...serverResponse,
    });
}
