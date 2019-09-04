
import * as actionTypes from './actionTypes';
import axios from './axiosSettings'


export const getFreeAndBusyMasterList = (dateStart, dateEnd) => {
    return dispatch => {
        const obj = {
            dateStart,
            dateEnd
        }

        return axios.post('/catalog.fasol/freeAndBusyMasterList',
            JSON.stringify(obj))
            .then(res => {
                let final = {};
                if(res.data && res.data.result.interval){
                    const {interval} = res.data.result;
                    for(let key in interval){
                        final = {...final, ...interval[key]}
                    }
                }

                console.log('--------------final :', final);
                dispatch({
                    type: actionTypes.GET_FREE_AND_BUSY_MASTER_LIST,
                    masterList: final,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}



        export const getInfoMasters = (idMaster) => {
            let obj = {id : idMaster};

            return axios.post('/catalog.fasol/getUserInfo', JSON.stringify(obj))
                .then(rez => {
                    let fdata = rez.data.result.data;
                    fdata['idMaster'] = idMaster;
                    fdata.hasOwnProperty('aboutme') ?  fdata.aboutme = fdata.aboutme.replace(/(['])/g, "\"") : ''
                    fdata.hasOwnProperty('bestcomment') ? fdata.bestcomment = fdata.bestcomment.replace(/(['])/g, "\"") : ''
                    return fdata;
                })
                .catch(err => {
                    console.log(err);
                })

        }

export const getAllInfoMasters = (typeMasters, masterList) => {
    return (dispatch) => {
        let arr = [];
        masterList.forEach(el => {

            arr.push(getInfoMasters(el)
                .catch((err) => { console.log(err)}));
        });

        return Promise.all(arr)
            .then((rez) => {
                    if(typeMasters === 'free')
                    {
                        dispatch({
                            type: actionTypes.GET_ALL_ADMIN_INFO_MASTERS_FREE,
                            adminMasters: rez,
                        })
                    }
                    else  if(typeMasters === 'busy')
                    {
                        dispatch({
                            type: actionTypes.GET_ALL_ADMIN_INFO_MASTERS_BUSY,
                            adminMasters: rez,
                        })
                    }

            })
            .catch((err) => {
                console.log(err)
            });
    }
}

export const getReport = (dateStart, dateEnd) => {
    const obj = {
        dateStart,
        dateEnd
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/reportToExcel', JSON.stringify(obj))
            .then(res => {
                console.log('reportToExcel', res);
                dispatch({
                    type: actionTypes.GET_REPORT_LINKS,
                    excelLink: res.data.result.doclink,
                    htmlLink: res.data.result.htmllinc
                });
                return res;
            })
            .catch(err => console.log(err));
    }
};


export const getRegistrationRepost = () => {

    return (dispatch) => {
        return axios.post('/catalog.fasol/registrationListToExcel')
            .then(res => {
                console.log('registrationListToExcel', res);
                dispatch({
                    type: actionTypes.GET_REPORT_REGISTRATION_LINKS,
                    excelRegLink: res.data.result.doclink,
                    htmlRegLink: res.data.result.htmllinc
                });
                return res;
            })
            .catch(err => console.log(err));
    }
};


export const getInfoScheduleStudent = (id) => {

    return (dispatch) => {
        return axios.post('/catalog.fasol/getUserInfo',JSON.stringify({id}))
            .then(res => {
                let fdata = res.data.result.data;
                if (fdata && fdata.userGroup === 'student') {
                    fdata.id = id;
                    fdata.hasOwnProperty('aboutme') ? fdata.aboutme = fdata.aboutme.replace(/(['])/g, "\"") : ''
                    fdata.hasOwnProperty('bestcomment') ? fdata.bestcomment = fdata.bestcomment.replace(/(['])/g, "\"") : ''

                    dispatch({
                        type: actionTypes.INFO_SCHEDULE_STUDENT,
                        profileStudent: fdata,
                    });
                }

                return res;
            })
            .catch(err => {
                console.log(err);
            })
    }
};