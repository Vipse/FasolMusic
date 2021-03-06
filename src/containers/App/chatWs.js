import kurentoUtils from 'kurento-utils'
import {Modal} from "antd";
import { detect } from 'detect-browser';
import incomingCallSound from '../../sounds/incoming_call_sound.mp3'
import React from "react";
import ProfileAvatar from "../../components/ProfileAvatar";
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
var registerState = null;

const NO_CALL = 0;
const PROCESSING_CALL = 1;
const IN_CALL = 2;
var callState = null;

let timerInterval;
let timerPing;
let dateNow;
let incomingCallModal = null;
let callSound = null;

export const sendMessage = (message) => {

    ws.send(JSON.stringify(message));

    if (message && message.id === 'chat') {
        const visitInfo = callbacks.get_visitInfo();
        const {idTraining} = visitInfo;
        callbacks.onSaveMessage(+idTraining, message);
    }
}

export const setVideoIn = (video) => {

    videoInput = video;
}
export const setVideoOut = (video) => {

    videoOutput = video;
}
export const getReadyState = () => { 
    if(ws && ws.readyState == 1){
        return 'CONNECTING'
    }
    return 'NO_CONNECTING'
}

export function createSocket(wsUrl,_props,_callbacks) {
    console.log("createSocket", wsUrl, _props, _callbacks);

    ws = new WebSocket(wsUrl);
    props = _props;
    callbacks = _callbacks;
    openSocketConnection(ws);

    ws.onmessage = (message) => {
        console.log("Onmessage", message);

        let parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.id){
            case 'ping':    
                heartbeat();   
                break;
            case 'registerResponse':
                resgisterResponse(parsedMessage);
                break;
            case 'startReception':
				break;
			case 'closeReception':
                callbacks.setReceptionStatus(false);
                //callbacks.show_review_modal(parsedMessage.receptionId, parsedMessage.by);
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
                closeCall(parsedMessage)
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
    };

    ws.onopen = () => {
        console.log("Open socket")
    };
    return ws;
}
export function closeSocket() {
    clearInterval(timerInterval);
    clearInterval(timerPing);
    ws && ws.close();
}

const resgisterResponse = (message) => {
    if (message.response === 'accepted') {
        setRegisterState(REGISTERED);
        callbacks.setWebSocketStatus('registered');
    } else {
        setRegisterState(NOT_REGISTERED);
        let errorMessage = message.message ? message.message
                : 'Unknown reason for register rejection.';
        console.log(errorMessage);
        callbacks.setWebSocketStatus(errorMessage);

        if (errorMessage.indexOf('is already registered') !== -1)
            Modal.error({
                title: 'Чат недоступен',
                width: '500px',
                className: 'quick-modal',
                content: 'Вход в данный аккаунт осуществлен с другого устройства ' +
                    '(или вкладки браузера) в данный момент!',
                maskClosable: true,
                okText: 'Продолжить',
                onOk: () => {}
            });
        else
            Modal.error({
                title: 'Чат недоступен',
                width: '500px',
                className: 'quick-modal',
                content: 'Не удалось подключиться к чату :(',
                maskClosable: true,
                okText: 'Продолжить',
                onOk: () => {}
            });
    }
};

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

function openSocketConnection(ws){

    function startCycle(){
        
        timerPing = setInterval(() => {
            
            dateNow = Date.now()
            console.log("startCycle", dateNow)
            sendMessage({id: 'ping'})
        }, 5000)
    }
    setTimeout(
        function () {
            if (ws.readyState !== 1) {
                openSocketConnection(ws);
            }
            else {
                startCycle();
            }
        }, 5);
}
function heartbeat() {  
    console.log('heartbeat :');
    if(Date.now() - dateNow > 5000){
        //server wrong
        clearInterval(timerPing);
        callbacks.show_error_from_server()
    }
    //"server good"); 
}


export const register = (id1, id2, user_mode) => {
    callbacks.setChatFromId(id1);
    setRegisterState(REGISTERING);

    
    ws.onopen = () => {
        console.log("true register")
        sendMessage({
        id : 'register',
        name : id1,
        other_name: id2,
        mode: user_mode,
    })
};
}

export const stop = (flag) => {
    if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }

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

    if (incomingCallModal) incomingCallModal.destroy();
    if (callSound) callSound.pause();
};


const closeCall = (message) => {
    if(message.id == 'chat' && message.type == 'stop'){
        if (incomingCallModal) incomingCallModal.destroy();
        stop(true);
    }
    
}

const callResponse = (message) => {
    let msg = {
        id : 'chat',
        type: message.response != 'accepted' ? "notBegin" : "begin",
        name: callbacks.get_interlocutorName(),
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
    }
    if (message.code == 409){
        callbacks.show_error()
    } 
    else {
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

    const {fromName, fromAvatar, beginTime, isTrial} = message.userData;
    callbacks.setChatTrainingId(message.receptionId);
    callbacks.setChatToId(message.from);
    callbacks.setChatInterlocutorInfo(fromName, fromAvatar);
    callbacks.setBeginTime(beginTime);
    callbacks.setIsTrialStatus(isTrial);
    callbacks.setIsCompleteStatus(false);
    callbacks.setReceptionStatus(true);

    callbacks.get_history().location.pathname !== '/app/chat'
    && callbacks.get_history().push('/app/chat');

    callbacks.setConversationMode('video');

    setCallState(PROCESSING_CALL);

    if(browser && browser.name === "safari") {
        console.log("this is safari");
        incomingCallModal = Modal.confirm({
            title: [`Звонок от ${fromName}`, <ProfileAvatar img={callbacks.get_interlocutorAvatar()} size='small'/>],
            width: '500px',
            className: 'quick-modal',
            content: 'Хотите ли вы принять вызов?',
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
        callSound = new Audio(incomingCallSound);
        callSound.loop = true;
        callSound.play().then(
            incomingCallModal = Modal.confirm({
                title: [`Звонок от ${fromName}`, <ProfileAvatar img={callbacks.get_interlocutorAvatar()} size='small'/>],
                width: '500px',
                className: 'quick-modal',
                content: 'Хотите ли вы принять вызов?',
                okText: 'Да',
                cancelText: 'Нет',
                centered: true,
                onOk() {
                    callSound.pause();
                    acceptCall();
                },
                onCancel() {
                    callSound.pause();
                    declineCall();
                }})
        );
    }





    function acceptCall() {

        callbacks.setReceptionStatus(true);
        callbacks.setIsCallingStatus(true);
        callbacks.setChatToId(message.from);

        const visitInfo = callbacks.get_visitInfo();
        const {idTraining} = visitInfo;

        if(!idTraining) continueCall();
        !idTraining ? callbacks.setChatTrainingId(message.receptionId) : continueCall();

        function continueCall(){
            let _visitInfo = callbacks.get_visitInfo();
            let {conversationMode} = _visitInfo;
            let options = conversationMode === 'video' ?
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
                                mode: conversationMode,
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
   const {idTraining} = visitInfo;
    sendMessage({
        id : 'startReception',
        name: callbacks.get_from(),
        other_name: callbacks.get_to(),
        receptionId: idTraining,
    });

    /*sendMessage({
        id: 'chat',
        from: callbacks.get_from(),
        to: callbacks.get_to(),
        date: Math.ceil(Date.now() / 1000),
        isDate: true,
    });*/
    callbacks.setReceptionStatus(true);
}

export const call = () => {
    !callbacks.get_receptionStarts() && callbacks.setReceptionStatus(true);
    callbacks.setIsCallingStatus(true);
    setCallState(PROCESSING_CALL);
    const visitInfo = callbacks.get_visitInfo();
    const {conversationMode} = visitInfo;


    let options = conversationMode === 'video' ?
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
        const {idTraining} = visitInfo;

        this.generateOffer(function(error, offerSdp) {
            if (error) {
                console.error(error);
                setCallState(NO_CALL);
            }
            sendMessage({
                id : 'call',
                from: callbacks.get_from(),
                to: callbacks.get_to(),
                receptionId: idTraining,
                userData: callbacks.get_visitInfo(),
                sdpOffer : offerSdp
            });
        });
    });
}

const checkTimeFormat = (number) => {
    return (''+number).length < 2 ? '0'+number : number;
}

export const messAboutStop = () => {
    const {s, m, h} = callbacks.get_timer();
    if (callState !== NO_CALL){
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

export const messForCloseReception = (receptionId, endType) => {
    sendMessage({
        id : 'closeReception',
        name: callbacks.get_from(),
        other_name: callbacks.get_to(),
        receptionId
    });
    sendMessage({
        id : 'chat',
        from: callbacks.get_from(),
        to: callbacks.get_to(),
        date: Math.ceil(Date.now()/1000),
        isVisEnd: true,
        endType
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
