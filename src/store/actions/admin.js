
import * as actionTypes from './actionTypes';
import axios from './axiosSettings'


export const getFreeAndBusyMasterList = (dateStart, dateEnd) => {
    return dispatch => {
        const obj = {
            dateStart,
            dateEnd
        }

        axios.post('/catalog.fasol/freeAndBusyMasterList',
            JSON.stringify(obj))
            .then(res => {
                console.log("REEES", res.data.result)
                dispatch({
                    type: actionTypes.GET_FREE_AND_BUSY_MASTER_LIST,
                    masterList: res.data.result,
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
                    rez.data.result.data['idMaster'] = idMaster;
                    return rez.data.result.data;
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
