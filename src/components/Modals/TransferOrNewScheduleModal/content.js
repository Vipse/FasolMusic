import React from 'react';
import { Form, Button } from 'antd';
import history from '../../../store/history'

import FreeAdminTrainersItem from '../../FreeAdminTrainersItem'

const FormItem = Form.Item;

class ContentForm extends React.Component {
    constructor(props) {
        super(props);

    }

    setTransfer_1_Training = () => {
        const {
            isAdmin,
            currentIdUser,
            currDiscipline, 
            discCommunication,
            clickedIdEvent,
            timeClickFreeEvent,

            startDate,
            endDate,

            getStudentsSchedule,
            transferTrainining,
            onCancel} = this.props;

        const id = currentIdUser;
        const idDiscipline = currDiscipline.code
        let currMaster = null;

        if(discCommunication.hasOwnProperty(idDiscipline)){
            currMaster = discCommunication[idDiscipline]
        }

        if(currMaster && timeClickFreeEvent){
            
            const obj = {
                idTraining: clickedIdEvent,
                idMaster: currMaster.idMaster,
                dateStart: timeClickFreeEvent
            }

            transferTrainining(obj, isAdmin)
                .then(() => getStudentsSchedule(id, startDate, endDate, idDiscipline, isAdmin))
        }

        onCancel();
    }

    setAbonement_Training = () => {

        
        //onCancel();
    }



    render() {

        return (
            <div className="transfer-or-newschedule">
                <div className="transfer-or-newschedule-btn">
                    <Button 
                        className="btn-yellow"
                        onClick={this.setTransfer_1_Training}
                    >
                        Перенести 1 тренировку 
                    </Button>
                </div>

                <div className="transfer-or-newschedule-btn">
                    <Button 
                        className="btn-yellow"
                        onClick={this.onClickFreeze}
                    >
                        Новое расписание
                    </Button>
                </div>
            
            </div>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
