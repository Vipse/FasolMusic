
import * as actionTypes from './actionTypes';
import axios from './axiosSettings'
import * as actions from '../actions'


export const getFreeAndBusyMasterList = (dateStart, dateEnd) => {
    return dispatch => {
        const obj = {
            dateStart,
            dateEnd
        }

        dispatch(actions.startLoading())

        return axios.post('/catalog.fasol/freeAndBusyMasterListNewVersionShort', JSON.stringify(obj))
            .then(res => {
                if (!res.data.error) {
                    const masterList = res.data.result ? res.data.result : {}

                    dispatch({
                        type: actionTypes.GET_FREE_AND_BUSY_MASTER_LIST,
                        masterList,
                    })

                    dispatch(actions.endLoading())
                }
            })
            .catch(err => {
                console.log('error: ', err);
                dispatch(actions.endLoading())
            })
    }
}

export const getFreeAndBusyMasterListOnHour = (dateStart) => {
    return dispatch => {
        const obj = { dateStart }

        return axios.post('/catalog.fasol/freeAndBusyMasterListOnHour', JSON.stringify(obj))
            .then(res => {
                if (!res.data.error) {
                    const {busytrainers, freetrainers} = res.data.result.interval

                    dispatch({
                        type: actionTypes.GET_FREE_AND_BUSY_MASTER_LIST_ON_HOUR,
                        freetrainers_listModal: freetrainers ? freetrainers : [],
                        busytrainers_listModal: busytrainers ? busytrainers : []
                    })

                    dispatch(actions.showListTrainersModal())
                }
            })
            .catch(err => {
                console.log('error: ', err);
            })
    }
}


export const getInfoMasters = (idMaster) => {
    let obj = { id: idMaster };

    return axios.post('/catalog.fasol/getUserInfo', JSON.stringify(obj))
        .then(rez => {
            let fdata = rez.data.result.data;
            fdata['idMaster'] = idMaster;
            fdata.hasOwnProperty('aboutme') ? fdata.aboutme = fdata.aboutme.replace(/(['])/g, "\"") : ''
            fdata.hasOwnProperty('bestcomment') ? fdata.bestcomment = fdata.bestcomment.replace(/(['])/g, "\"") : ''
            return fdata;
        })
        .catch(err => {
            console.log(err);
        })

}

// export const getAllInfoMasters = (typeMasters, masterList) => {
//     return (dispatch) => {
//         let arr = [];
//         masterList.forEach(el => {

//             arr.push(getInfoMasters(el)
//                 .catch((err) => { console.log(err) }));
//         });

//         return Promise.all(arr)
//             .then((rez) => {
//                 if (typeMasters === 'free') {
//                     dispatch({
//                         type: actionTypes.GET_ALL_ADMIN_INFO_MASTERS_FREE,
//                         adminMasters: rez,
//                     })
//                 }
//                 else if (typeMasters === 'busy') {
//                     dispatch({
//                         type: actionTypes.GET_ALL_ADMIN_INFO_MASTERS_BUSY,
//                         adminMasters: rez,
//                     })
//                 }

//             })
//             .catch((err) => {
//                 console.log(err)
//             });
//     }
// }

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
        return axios.post('/catalog.fasol/getUserInfo', JSON.stringify({ id }))
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