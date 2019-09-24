import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import firebase from 'firebase'
import { detect } from 'detect-browser';


export const sendPushNotification = (token,type,callerName) => {
    return dispatch => {

        const header = {
            headers: {
                'Content-Type':'application/json',
                'Authorization':'key=AAAA1JRR8nU:APA91bEno9o3N32bR45v2D8rKVNbaijNn5PI-atQ8Uc2Ufh2zN3I4RiOFiM6KzNi1aYnTvs2RusImwD8iYPKyWiIf4EkKPculkFNvy3UBnDpAMdUbIl7m6iBZQ4YDxOW4QLAmk9uLExO',
              }
        }

        let data,body = {};
        
        switch (type) {
            case 'call_To_Master':
                body = (callerName) ? "Студент: " + callerName : ""
                data = {
                    "notification": {
                        "title": "Входящий звонок",
                        "body": `${body}`,
                        "icon": "https://cdn4.iconfinder.com/data/icons/communication-and-audio/128/6-512.png"
                    },
                    "to": `${token}`
                    }
                break;

            case 'call_To_Student': 
            body = (callerName) ? "Преподаватель: " + callerName : "" 
                data = {
                    "notification": {
                        "title": "Входящий звонок",
                        "body": `${body}`,
                        "icon": "https://cdn4.iconfinder.com/data/icons/communication-and-audio/128/6-512.png"
                    },
                    "to": `${token}`
                    }
                break;

            default: 
                data = {
                    "notification": {
                        "title": "Входящий звонок",
                        "body": `${callerName}`,
                        "icon": "https://cdn4.iconfinder.com/data/icons/communication-and-audio/128/6-512.png"
                    },
                    "to": `${token}`
                }
        }

        setTimeout(() => {
            axios.post('https://fcm.googleapis.com/fcm/send',data,header)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })    
        }, 3000);
            
        
            
            
        
    }
}

export const getPushNotificationsToken = (idUser,changeStore) => {
    return dispatch => {

        let obj = {
            idUser
        };

       return axios.post('/catalog.fasol/getMessageDesktop',
            JSON.stringify(obj))
            .then(res => {
                let token = res.data.result[0].message;

                if (changeStore == true && token != false) {
                    dispatch({
                        type: actionTypes.ALLOW_NOTIFICATIONS,
                        token: token
                    })
                }
        
                return token
            })
            .catch(err => {
                console.log(err)
            })
        
    }
}

export const askForPermissionToReceiveNotifications = (idUser) => {
    return dispatch => {
        return new Promise((resolve,reject) => {

            const browser = detect();
            const supportedBrowsers = {chrome:'',firefox:'',opera:'',edge:''}

            const isSupported = (browser && browser.name in supportedBrowsers);

            if (isSupported) {

                const messaging = firebase.messaging();
                messaging.requestPermission()
                .then(permissionType => {
                    messaging.getToken()
                    .then(token => {

                        let obj = {
                            idUser,
                            message:token
                        };

                        axios.post('/catalog.fasol/putMessageDesktop',
                        JSON.stringify(obj))
                        .then(res => {
                            dispatch({
                                type: actionTypes.ALLOW_NOTIFICATIONS,
                                token:token
                            })
                            resolve(permissionType)
                        })
                        .catch(err => console.log(err)) 

                    })
                    .catch(err => {
                        console.log(err)
                    })    

                })
                .catch(err => {
                    console.log(err)
                    resolve('failed')
                }) 
            }
            else reject();
        })
    }
}

export const refreshPushNotificationsToken = (idUser,token) => {

    return dispatch => {
        const browser = detect();
        const supportedBrowsers = {chrome:'',firefox:'',opera:'',edge:''}

        const isSupported = (browser && browser.name in supportedBrowsers);
        
        if (isSupported){

            const messaging = firebase.messaging();

            if (Notification.permission == "granted") {
                messaging.getToken()
                .then(newToken => {

                    const isNewDevice = (token == newToken) ? false : true;
        
                    if (isNewDevice) {

                        let obj = {
                            idUser,
                            message:newToken
                        };

                        axios.post('/catalog.fasol/putMessageDesktop',
                        JSON.stringify(obj))
                        .catch(err => console.log(err))

                        dispatch({
                            type: actionTypes.ALLOW_NOTIFICATIONS,
                            token: newToken
                        })

                    }
        
                })
            }
            else if (Notification.permission == 'default') {
                messaging.requestPermission()
                .then(res => {
                    messaging.getToken()
                    .then(newToken => {

                        const isNewDevice = (token == newToken) ? false : true;
            
                        if (isNewDevice) {

                            let obj = {
                                idUser,
                                message:newToken
                            };

                            axios.post('/catalog.fasol/putMessageDesktop',
                            JSON.stringify(obj))
                            .catch(err => console.log(err))

                            dispatch({
                                type: actionTypes.ALLOW_NOTIFICATIONS,
                                token: newToken
                            })

                        }
            
                    })
                })

            }
        }
    }
}




