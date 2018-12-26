import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import moment from "moment";


export const autoLogin = (history) => {
    return (dispatch) => {

        const login = localStorage.getItem('_fasol-user');
        const passw = localStorage.getItem('_fasol-pass');

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
        axios.post('/catalog.fasol/authorization',
                JSON.stringify({
                    login: userName,
                    password: password,
                }))
                    .then(res => {
                        console.log("AUTH", res);
                        console.log('res.data.error :', res.data.hasOwnProperty('error'));
                        !res.data.hasOwnProperty('error')
                            ? (
                                dispatch(authSuccess(res.data.result.id, res.data.result.usergroup)),
                                dispatch(setOnlineStatus(res.data.result.id, true)),
                                sessionStorage.setItem('_fasol-id', res.data.result.id),
                                sessionStorage.setItem('_fasol-mode', res.data.result.usergroup),
                                rememberMe(remember, userName, password),

                                history.push('/app')
                            )
                            : (
                                dispatch(authFail(res.data.error)),
                                    isAuto && (
                                        // TODO: test
                                        localStorage.removeItem('_fasol-user'),
                                        localStorage.removeItem('_fasol-pass'),
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
        return axios.post('/catalog.fasol/registratin',
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
        localStorage.removeItem('_fasol-user');
        localStorage.removeItem('_fasol-pass');
        sessionStorage.removeItem('_fasol-id');
        sessionStorage.removeItem('_fasol-mode');
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

export const getSelectors = (name) => {
    return () => {
        const selectorNameObj = {
            code: name
        };
        return axios.post('/catalog.fasol/getSelectors',
            JSON.stringify(selectorNameObj))
            .then(res => res)
            .catch(err => {
                console.log('error: ', err);
            })
    }
};

const rememberMe = (flag, userName, password) => {
    flag ?
        (localStorage.setItem('_fasol-user',userName),
        localStorage.setItem('_fasol-pass',password))
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
