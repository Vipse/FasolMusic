import axios from './axiosSettings'
import axiosLand from './axiosSettingsLand'

import * as actionTypes from './actionTypes';
import {getInfoDoctor} from "./coachData";
import {getInfoPatient} from "./studentData";

export const setOnlineStatus = (id, isOnline) => {
    return dispatch => {
        const newObj = {
            idUser: id,
            status: isOnline ? 1 : 0,
        };

        axios.post('/catalog.fasol/userOnOff',
            JSON.stringify(newObj))
            .catch(err => {
                console.log('error: ', err);
            })
    }
};


export const autoLogin = (history) => {
    return (dispatch) => {

        const login = localStorage.getItem('_fasol-user');
        const passw = localStorage.getItem('_fasol-pass');

        if(login && passw){
            dispatch(login(login, passw, false, history, true));
        }
    }
};


export const login = (userName, password, remember, history, isAuto) => {

    return (dispatch, getState) => {
        dispatch(authStart());
        axios.post('/catalog.fasol/authorization',
                JSON.stringify({
                    login: userName,
                    password: password,
                }))
                    .then(res => {

                        !res.data.hasOwnProperty('error')
                            ? (
                                dispatch(authSuccess(res.data.result.id, res.data.result.usergroup)),
                                dispatch(setOnlineStatus(res.data.result.id, true)),
                                sessionStorage.setItem('_fasol-id', res.data.result.id),
                                sessionStorage.setItem('_fasol-mode', res.data.result.usergroup),

                                localStorage.setItem('_fasol-mode', res.data.result.id),
                                localStorage.setItem('_fasol-id', res.data.result.usergroup),
                                rememberMe(remember, userName, password),

                                history.push(getState().training.unauthorizedTrialData ? '/app/schedule' : '/app')
                            )
                            : (
                                dispatch(authFail(res.data.error)),
                                    isAuto && (
                                        // TODO: test
                                        localStorage.removeItem('_fasol-user'),
                                        localStorage.removeItem('_fasol-pass'),
                                        localStorage.removeItem('_fasol-id'),
                                        localStorage.removeItem('_fasol-mode'),

                                        localStorage.removeItem('landing'),
                                        sessionStorage.removeItem('_fasol-id'),
                                        sessionStorage.removeItem('_fasol-mode')
                                    )
                            );
                    })
                    .catch(err => {
                        console.log('error: ',err);
                        //dispatch(authFail(err.response.data.error));
                    })
    }
};

export const registerUser = (userInfo, history) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.REG_PATIENT_START
        });
        return axios.post('/catalog.fasol/registratin',
                JSON.stringify(userInfo))
                    .then(res => {
                        if (res && res.data) {
                            if (!res.data.hasOwnProperty('error')) {
                                dispatch(authSuccess(res.data.result.id, res.data.result.usergroup));
                                localStorage.setItem('_fasol-user', userInfo.email);
                                localStorage.setItem('_fasol-pass', userInfo.password);
                            }
                            else dispatch(authFail(res.data.error));
                        }
                        return res;
                    })
                    .catch(err => {
                        console.log('error: ',err);
                    })
    }
};



export const registerTrainer = (userInfo, history) => {

    return (dispatch) => {

        return axios.post('/catalog.fasol/registratin',
                JSON.stringify({"catalogGroup": "master", ...userInfo}))
                    .then(res => {
                        if( !res.data.hasOwnProperty('error'))
                        {
                            dispatch(authSuccess(res.data.result.id, res.data.result.usergroup)),
                            sessionStorage.setItem('_fasol-id', res.data.result.id),
                            sessionStorage.setItem('_fasol-mode', res.data.result.usergroup),
                            localStorage.setItem('_fasol-id', res.data.result.id),
                            localStorage.setItem('_fasol-mode', res.data.result.usergroup),
                           // rememberMe(remember, userName, password),

                            history.push('/app')
                        }
                        // dispatch({
                        //     type: actionTypes.AUTH_SUCCESS,
                        //     id: res.data.result.id,
                        //     usergroup: res.data.result.usergroup,
                        // });
                    })
                    .catch(err => {
                        console.log('error: ',err);
                    })
    }
};


export const resetRegisterStatus = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.RESET_REG_STATUS
        });
    };
};

export const logout = () => {
    return (dispatch, getState) => {
        sessionStorage.removeItem('landing');
        localStorage.removeItem('_fasol-user');
        localStorage.removeItem('_fasol-pass');
        sessionStorage.removeItem('_fasol-id');
        sessionStorage.removeItem('_fasol-mode');
        localStorage.removeItem('_fasol-id');
        localStorage.removeItem('_fasol-mode');
        dispatch({type: actionTypes.LOG_OUT});
        dispatch(setOnlineStatus(getState().auth.id, false));
        dispatch(authSuccess(0, ''));
    }
};

export const getIdUserByToken = (token, history) => {
    console.log("getIdUserByToken")
    return (dispatch, getState) => {
        return axios.post('/catalog.fasol/getIdUserByToken',JSON.stringify({token}))
            .then(res => {
                         console.log("res", res)
                if(!res.data.hasOwnProperty('error')){

                        dispatch(authSuccess(res.data.result.id, res.data.result.usergroup)),
                        dispatch(setOnlineStatus(res.data.id, true)),
                        sessionStorage.setItem('_fasol-id', res.data.result.id),
                        sessionStorage.setItem('_fasol-mode', res.data.result.usergroup),
                        localStorage.setItem('_fasol-id', res.data.result.id),
                        localStorage.setItem('_fasol-mode', res.data.result.usergroup),

                        history.push(getState().training.unauthorizedTrialData ? '/app/schedule' : '/app')
                }
            })
            .catch(err => {
                console.log('error: ', err);
            })
    }
};

export const resetError = () => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: null,
        errorCode: 0
    };
};

const rememberMe = (flag, userName, password) => {
    flag ?
        (localStorage.setItem('_fasol-user',userName),
        localStorage.setItem('_fasol-pass',password))
        : null;
};

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};


const authSuccess = (id, usergroup) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        id,
        usergroup,
    };
};

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
        errorCode: error.code,
    };
};

export const connectionToSocialNetwork = (idProfile, idSocial, networkName) => {
    const obj = {
        id: idProfile,
        networkid: idSocial ? idSocial : -idSocial,
        network: networkName + 'link'
    };

    return (dispatch, getState) => {
        const userType = getState().auth.mode;

        return axios.post('/catalog.fasol/connectionToSocialNetwork',
            JSON.stringify(obj))
            .then(res => {
                console.log("connectionToSocialNetwork", res);
                userType === 'student' ?
                    dispatch(getInfoPatient(obj.id)) :
                    dispatch(getInfoDoctor(obj.id));
                return res;
            })
            .catch(err => {
                console.log('error: ', err);
                return err;
            });
    };
};

export const socialNetworkCheck = (idSocial, networkName) => {
    const obj = {
        networkid: idSocial,
        network: networkName + 'link'
    };

    return () => {
        return axios.post('/catalog.fasol/socialNetworkCheck',
            JSON.stringify(obj))
            .then(res => {
                console.log("socialNetworkCheck", res);
                return res;
            })
            .catch(err => {
                console.log('error: ', err);
                return err;
            });
    };
};

export const socialAuthorization = (idSocial, history) => {
    const obj = {
        socialId: idSocial
    };

    return (dispatch) => {
        dispatch(authStart());
        return axios.post('/catalog.fasol/socialAuthorization',
            JSON.stringify(obj))
            .then(res => {
                console.log("socialAuthorization", res);

                !res.data.hasOwnProperty('error')
                    ? (
                        dispatch(authSuccess(res.data.result.id, res.data.result.usergroup)),
                            sessionStorage.setItem('_fasol-id', res.data.result.id),
                            sessionStorage.setItem('_fasol-mode', res.data.result.usergroup),
                            localStorage.setItem('_fasol-id', res.data.result.id),
                            localStorage.setItem('_fasol-mode', res.data.result.usergroup),

                            history.push('/app')
                    )
                    : (
                        dispatch(authFail(0)),
                            localStorage.removeItem('_fasol-id'),
                            localStorage.removeItem('_fasol-mode'),

                            localStorage.removeItem('_fasol-user'),
                            localStorage.removeItem('_fasol-pass'),
                            sessionStorage.removeItem('_fasol-id'),
                            sessionStorage.removeItem('_fasol-mode')
                    );

                return res;
            })
            .catch(err => {
                console.log('error: ', err);
                return err;
            });
    };
};

export const reportBug = (text, href) => {
    return (dispatch, getState) => {
        const obj = {
            id_user: getState().auth.id,
            message: text+" "+"PAGE: " + href
        };
        return axios.post('/catalog.mf/sendLog',
            JSON.stringify(obj))
            .catch(err => {
                console.log('error: ', err);
            })
    }
};

export const forgetEmail = (email) => {
    return (dispatch, getState) => {
       return axios.post('/catalog.fasol/passwordRecovery',
                JSON.stringify({
                    login: email
                }))
                    .catch(err => {
                        console.log('error: ',err);
                    })
    }
}