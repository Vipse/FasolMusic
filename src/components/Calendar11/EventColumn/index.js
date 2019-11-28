import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {connect} from 'react-redux';
import * as actions from '../../../store/actions'

import EventTraining from '../EventTraining'

import './styles.css'
import AdminEvent from '../AdminEvent';
import { message } from 'antd';


class EventColumn extends React.Component{


    renderHeadColumn = () => {
        const {startTime} = this.props;
        const momentDay = moment(+startTime * 1000);

        return (
            <div className="rbc-label rbc-header-eventgutter">
                <p className="event-timebody">{momentDay.format("dddd")}</p>
                <p className="event-timebody">{momentDay.format("D")}</p>
            </div>)
    }

    isIncludeIntervals = (startEvent) => {
        
        const {freeInterval} = this.props;

        if(Array.isArray(freeInterval) && freeInterval.includes(+startEvent)) {
            return  true
        }
        return false
    }

    isIncludeEvent = (startEvent) => {
        const {studentSchedule} = this.props;
        
        return studentSchedule.hasOwnProperty(startEvent)
    }


    handleClickFreeEvent = (startEvent) => {
        const {
            masters,
            listNewSchedule,
            clickedIdEvent, 
            clickedTrainer,

            pushBtnUnfresh,
            pushBtnTrial 
        } = this.props;
        
        if (pushBtnUnfresh && clickedTrainer.id){
            let listNew = {...listNewSchedule}
                listNew[startEvent] = {
                    type: 'clicked_event',
                    start: startEvent,
                    idMaster: clickedTrainer.id,
                    masterFio: clickedTrainer.name
                }

            this.props.setParamsId({listNewSchedule: listNew})
            
        }
        else if(pushBtnUnfresh && !clickedTrainer.id){
            this.props.masterFreeOnDate(startEvent, masters)
        }

        else if(pushBtnTrial && !pushBtnUnfresh){
            const listNew = {};
            listNew[startEvent] = {
                type: 'clicked_event',
                start: startEvent,
                idMaster: clickedTrainer.id,
                masterFio: clickedTrainer.name
            }

            this.props.setParamsId({listNewSchedule: listNew})
            this.props.masterFreeOnDate(startEvent, masters)
        }
        else if(clickedIdEvent){
            this.props.setParamsId({timeClickFreeEvent: startEvent})
            this.props.showTransferOrNewScheduleModal()
        }
        else{
            message.info('Выберите тренировку')
        }
        
    }

    renderCells = () => {
        const { startTime, endTime, studentSchedule } = this.props;
        let startTimeMoment = moment(+startTime * 1000);
        let endTimeMoment = moment(+endTime * 1000);
        let arrReander = [];

        while (startTimeMoment.isBefore(endTimeMoment)) {
            
            const startEvent = startTimeMoment.format('X')
            const isInclude = this.isIncludeIntervals(startEvent)
            const isIncludeEvent = this.isIncludeEvent(startEvent)

            const handleClick = isInclude ? this.handleClickFreeEvent : () => {};

            let classStyle = 'rbc-timeslot-group';

            if(isInclude && !isIncludeEvent){
                classStyle += " rbc-timeslot-group-OK"
            }
            else{
                classStyle += " rbc-timeslot-group-NOT"
            }
            

            
            arrReander.push(
                <div className={classStyle} onClick={() => handleClick(startEvent)}>
                    <div className="rbc-time-slot rbc-eventlabel">
                        {isIncludeEvent  ?
                            <EventTraining  
                                key={startEvent}
                                event = {studentSchedule[startEvent]}
                            /> : null}
                    </div>
                </div>)

           startTimeMoment = startTimeMoment.add(1, 'hour')
        }

        return arrReander;
    }


    renderAdminCells = () => {
        const { startTime, endTime, masterList } = this.props;
        let startTimeMoment = moment(+startTime * 1000);
        let endTimeMoment = moment(+endTime * 1000);
        let arrReander = [];

        while (startTimeMoment.isBefore(endTimeMoment)) {
            let startEvent = startTimeMoment.format('X')
            let classStyle = "rbc-timeslot-group"
            arrReander.push(
                <div className={classStyle}>
                    <div className="rbc-time-slot rbc-eventlabel">
                        {masterList.hasOwnProperty(startEvent) ?
                                <AdminEvent
                                    key={startEvent}
                                    date={startEvent}
                                    event={masterList[startEvent]}
                                 /> : ''}
                    </div>
                </div>)

            startTimeMoment = startTimeMoment.add(1, 'hour')
        }

        return arrReander;
    }
    

    render() {
        const{ isAdmin} = this.props;

        return (
            <div className='rbc-time-eventgutter rbc-time-eventcolumn'>
                {this.renderHeadColumn()}
                
                {!isAdmin ? this.renderCells() : this.renderAdminCells()}
                             
            </div>
        )
    }
}

EventColumn.propTypes = {
};

EventColumn.defaultProps = {
};

const mapStateToProps = state => {
    const {
        listNewSchedule,
        clickedTrainer,
        clickedIdEvent,
        pushBtnUnfresh,
        pushBtnTrial
    } = state.scheduleIdParams;

    return {
        studentSchedule: {...state.student.studentSchedule, ...listNewSchedule},
        freeInterval: state.scheduleIdParams.freeInterval,
        masters: state.scheduleIdParams.masters,

        listNewSchedule,
        clickedTrainer,
        clickedIdEvent,
        pushBtnUnfresh,
        pushBtnTrial
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setParamsId: (params) => dispatch(actions.setParamsId(params)),

        hideCreateTrainModal_clickUnfreeze: () => dispatch(actions.hideCreateTrainModal_clickUnfreeze()),
        hideCreateTrainModal_clickTrial: () => dispatch(actions.hideCreateTrainModal_clickTrial()),
          
        showTransferOrNewScheduleModal: () => dispatch(actions.showTransferOrNewScheduleModal()),

        masterFreeOnDate: (date, chooseMasters) => dispatch(actions.masterFreeOnDate(date, chooseMasters))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventColumn);
