import React from 'react';
import { Form, Button } from 'antd';
import history from '../../../store/history'

import FreeAdminTrainersItem from '../../FreeAdminTrainersItem'

const FormItem = Form.Item;

class ContentForm extends React.Component {
    constructor(props) {
        super(props);

    }

    setTransfer_End_Training = () => {
        const {
            onCancel,
            currentIdUser,
            currDiscipline,

            isAdmin, 
            crossCurrentIdTraining,

            startDate, 
            endDate,
            getStudentsSchedule,
            transferTraininingToEnd} = this.props;

        const obj = {idTraining : crossCurrentIdTraining}

        transferTraininingToEnd(obj, isAdmin)
        .then(() => getStudentsSchedule(currentIdUser, startDate, endDate, currDiscipline.code))
        
        onCancel();
    }

    onClickFreeze = () => {
        const {
            currentIdUser: id,
            crossCurrendIdSubscription,

            freezeAbonement,
            getUseFrozenTraining,
            getDisciplineCommunication,
            getSubscriptionsByStudentId,

            startDate, 
            endDate,
            currDiscipline,
            getStudentsSchedule,
            onCancel,
        } = this.props;
        
        if(id){
            freezeAbonement(crossCurrendIdSubscription)
            .then(() => {
                getStudentsSchedule(id, startDate, endDate, currDiscipline.code);
                getUseFrozenTraining (id);
                getDisciplineCommunication (id); //?
                getSubscriptionsByStudentId (id);  //?
            })
            .catch(err => console.log(err))
        }
        
        onCancel();
    }

    render() {

        return (
            <div className="transfer-or-freeze">
                <div className="transfer-or-freeze-btn">
                    <Button 
                        className="btn-yellow"
                        onClick={this.setTransfer_End_Training}
                    >
                        Перенести тренировку в конец 
                    </Button>
                </div>

                <div className="transfer-or-freeze-btn">
                    <Button 
                        className="btn-yellow"
                        onClick={this.onClickFreeze}
                    >
                        Заморозка расписания
                    </Button>
                </div>
            
            </div>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
