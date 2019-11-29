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

    isVisibleTransferEvent = () => {
        const {isAdmin, listSchedule, crossCurrentIdTraining: idTraining} = this.props;
        if(isAdmin) {
            return true
        }

        function wasTransferEvent(list, idTraining){
            for(let key in list){
                if(list[key].id === idTraining){
                    if(list[key].wasTransfer) return true
                    else return false
                }
            }
        }
       
        if(wasTransferEvent(listSchedule, idTraining)){
            return false
        }

        return true
    }

    render() {

        return (
            <div className="transfer-or-freeze">
                {this.isVisibleTransferEvent() && 
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
