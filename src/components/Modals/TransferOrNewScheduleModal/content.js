import React from 'react';
import { Form, Button } from 'antd';
import history from '../../../store/history'

import moment from 'moment'

const FormItem = Form.Item;

class ContentForm extends React.Component {
    constructor(props) {
        super(props);

    }

    setParamsId = () => {
        const {setParamsId, setParamsStatusPush, clearFreeInterval} = this.props;
        
        setParamsId({clickedIdEvent: null, timeClickFreeEvent: null})
        setParamsStatusPush({isPushBtnTransfer: false})

        clearFreeInterval();
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
            onCancel } = this.props;

        const id = currentIdUser;
        const idDiscipline = currDiscipline.code
        let currMaster = null;

        if (discCommunication.hasOwnProperty(idDiscipline)) {
            currMaster = discCommunication[idDiscipline]
        }

        if (currMaster && timeClickFreeEvent) {

            const obj = {
                idTraining: clickedIdEvent,
                idMaster: currMaster.idMaster,
                dateStart: timeClickFreeEvent
            }

            transferTrainining(obj, isAdmin)
                .then(() => getStudentsSchedule(id, startDate, endDate, idDiscipline))
        }

        this.setParamsId();
        onCancel();
    }

    setAbonement_Training = () => {
        const {
            currentIdUser,
            listSchedule,
            clickedIdEvent,
            timeClickFreeEvent,
        
            startDate,
            endDate,
            currDiscipline,
        
            onCancel} = this.props;

        const id = currentIdUser;
        const idDiscipline = currDiscipline.code;
        let trainingTime = {};
        let amountTrainingInNewSchedule = 0;
        let dateStart = null; //timestamp, start of schedule
        let idSubscription = null;

        function getNewTrainingTime(trainingTime, time, event) {
            let newTrainingTime = {...trainingTime}
            let weekDay = moment(+time * 1000).weekday()+1; //+1, но надо было пн=0 ... воскр=6

            if (!newTrainingTime.hasOwnProperty(weekDay)) {
                newTrainingTime[weekDay] = []
            }

            newTrainingTime[weekDay].push({
                id: event.idMaster,
                start: time
            })

            return newTrainingTime
        }

        for (let key in listSchedule) {
            const event = listSchedule[key];

            if (event.id === clickedIdEvent) {
                trainingTime = getNewTrainingTime(trainingTime, timeClickFreeEvent, event)
            }
            else {
                trainingTime = getNewTrainingTime(trainingTime, key, event)
            }

            amountTrainingInNewSchedule = event.amount;
            dateStart = event.dateStart,
            idSubscription = event.idSubscription
        }

        const obj = {
            idStudent: currentIdUser, //?
            amount: amountTrainingInNewSchedule,
            dateStart,
            idSubscription,
            trainingTime
        }
        console.log("new schedule", obj)

        this.props.changeSubscription(obj, true)
        .then(() => this.props.getStudentsSchedule(id, startDate, endDate, idDiscipline))
        
        this.setParamsId();
        onCancel();
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
                        onClick={this.setAbonement_Training}
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
