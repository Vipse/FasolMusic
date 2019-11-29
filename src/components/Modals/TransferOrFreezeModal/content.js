import React from 'react';
import { Form, Button, message } from 'antd';
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
            isAdmin,
            crossCurrendIdSubscription,

            freezeAbonement,
            getUseFrozenTraining,
            getDisciplineCommunication,
            getSubscriptionsByStudentId,
            getCountTrainingByDiscipline,

            startDate, 
            endDate,
            currDiscipline,
            getStudentsSchedule,

            canFrozen,
            onCancel,
        } = this.props;
        
       
        if((id && canFrozen) || isAdmin){
            freezeAbonement(crossCurrendIdSubscription)
            .then(() => {
                getStudentsSchedule(id, startDate, endDate, currDiscipline.code);
                getUseFrozenTraining (id);
                getDisciplineCommunication (id); //?
                getSubscriptionsByStudentId (id);  //?
                getCountTrainingByDiscipline(id, currDiscipline.code);
            })
            .catch(err => console.log(err))
        }
        else{
            message.info('Замораживать абонементы можно только один раз в три месяца')
        }
        
        onCancel();
    }

    isWasTransferEvent = () => {
        const {studentSchedule, crossCurrentIdTraining: idTraining} = this.props;

        for(let key in studentSchedule){
            if(studentSchedule[key].id === idTraining){
                if(studentSchedule[key].wasTransfer) return true
                else return false
            }
        }

        return false
    }

    render() {

        return (
            <div className="transfer-or-freeze">
                {!this.isWasTransferEvent() && 
                    <div className="transfer-or-freeze-btn">
                        <Button 
                            className="btn-yellow"
                            onClick={this.setTransfer_End_Training}
                        >
                            Перенести тренировку в конец 
                        </Button>
                    </div>
                }

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
