import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import moment from "moment";


export const autoLogin = (history) => {
    return (dispatch) => {

        const login = localStorage.getItem('_appdoc-user');
        const passw = localStorage.getItem('_appdoc-pass');

        if(login && passw){
            dispatch(login(login, passw, false, history, true));
        }
    }
}

export const setOnlineStatus = (id,isOnline) => {
    return dispatch => {
        const newObj = {
            id,
            status: isOnline ? 1 : 0,
        }
        axios.post('/fusers.doc/userOnOff',
            JSON.stringify(newObj))
            .then(res => {
                //console.log('[setOnlineStatus] results',res)
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}

export const login = (userName, password, remember, history, isAuto) => {

    return (dispatch) => {
        dispatch(authStart());
        axios.post('/fusers.doc/loginDoc',
                JSON.stringify({
                    login: userName,
                    password: password,
                }))
                    .then(res => {
                        !res.data.error
                            ? (
                                dispatch(authSuccess(res.data.id, res.data.usergroup)),
                                dispatch(setOnlineStatus(res.data.id, true)),
                                sessionStorage.setItem('_appdoc-id', res.data.id),
                                sessionStorage.setItem('_appdoc-mode', res.data.usergroup),
                                rememberMe(remember, userName, password),
                                history.push('/app')
                            )
                            : (
                                dispatch(authFail(res.data.error)),
                                    isAuto && (
                                        // TODO: test
                                        localStorage.removeItem('_appdoc-user'),
                                        localStorage.removeItem('_appdoc-pass'),
                                        sessionStorage.removeItem('_appdoc-id'),
                                        sessionStorage.removeItem('_appdoc-mode')
                                    )
                            );
                    })
                    .catch(err => {
                        console.log('error: ',err);
                        //dispatch(authFail(err.response.data.error));
                    })
    }
}

export const registerDoctor = (data) => {
    delete data.avatarThumb;
    return () => {

        const fillNewField = (res, name) => {
            const info = name.split('-');
            let array = [];
            if (res[info[0]])
                array = [...res[info[0]]];

            array[+info[2]] = (info[1] === 'ucationyears' && data[name])
                ? {
                    ...array[+info[2]],
                    [info[1]]: [
                        moment(data[name][0]).format("X"),
                        moment(data[name][1]).format("X"),
                    ],
                }
                : {
                    ...array[+info[2]],
                    [info[1]]: (info[1].indexOf('photo')+1 || info[1].indexOf('copycontract')+1)
                        ? data[name]
                            ? data[name]
                            : []
                        : data[name],
                };
            return {
                ...res,
                [info[0]]: array,
            }
        };


        let result = {};
        for (let key in data){
            result = (key.indexOf('educationsgroup')+1 || key.indexOf('work')+1)
                ? fillNewField(result,key)
                : (key.indexOf('doc')+1 || key.indexOf('photos')+1 || key.indexOf('copycontract')+1 || key.indexOf('avatar')+1 )
                    ? data[key]
                        ? {
                            ...result,
                            [key]: data[key],
                        }
                        : {
                            ...result,
                            [key]: [],
                        }
                    : (key === 'workdate' || key === 'datebirth')
                        ? {
                            ...result,
                            [key]: moment(data[key]).format("X"),
                        }
                        : {
                            ...result,
                            [key]: data[key],
                        };
        }
        console.log(result, "TO  REGISTER DOCTOR")
        return axios.post('/fusers.doc/createUserDoc',
            JSON.stringify(result))
            .then(res => res)
            .catch(err => {
                console.log('error: ',err);
            })
    }
};
export const registerUser = (userInfo) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.REG_PATIENT_START
        });
        return axios.post('/catalog.doc2/creatUser',
                JSON.stringify(userInfo))
                    .then(res => res)
                    .catch(err => {
                        console.log('error: ',err);
                    })
    }
}

export const resetRegisterStatus = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.RESET_REG_STATUS
        });
    };
}

export const logout = () => {
    return (dispatch, getState) => {
        localStorage.removeItem('_appdoc-user');
        localStorage.removeItem('_appdoc-pass');
        sessionStorage.removeItem('_appdoc-id');
        sessionStorage.removeItem('_appdoc-mode');
        dispatch(setOnlineStatus(getState().auth.id, false));
        dispatch(authSuccess(0, ''));
    }

}

export const checkEmailAvailability = (email) => {
    return () => {
        const emailObj = {
            email: email
        };
        return axios.post('/catalog.doc2/emailVerification',
            JSON.stringify(emailObj))
            .then(res => res)
            .catch(err => {
                console.log('error: ', err);
            })
    }
};

const rememberMe = (flag, userName, password) => {
    flag ?
        (localStorage.setItem('_appdoc-user',userName),
        localStorage.setItem('_appdoc-pass',password))
        : null;
}

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
