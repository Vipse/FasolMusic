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
        const {timeDay} = this.props;
        const momentDay = moment(+timeDay * 1000);

        return (
            <div class="rbc-label rbc-header-eventgutter">
                <p class="event-timebody">{momentDay.format("dddd")}</p>
                <p class="event-timebody">{momentDay.format("D")}</p>
                {/* <span class="event-body">
                    
                </span> */}
            </div>)
    }

    isIncludeIntervals = (startEvent) => {
        
        const {freeInterval} = this.props;

        if(Array.isArray(freeInterval) && freeInterval.includes(+startEvent)) {
            return  true
        }
        return false
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
            const handleClick = isInclude ? this.handleClickFreeEvent : () => {};

            let classStyle = 'rbc-timeslot-group';

            if(isInclude){
                classStyle += " rbc-timeslot-group-OK"
            }
            else{
                classStyle += " rbc-timeslot-group-NOT"
            }
            

            
            arrReander.push(
                <div className={classStyle} onClick={() => handleClick(startEvent)}>
                    <div class="rbc-time-slot rbc-eventlabel">
                        {studentSchedule.hasOwnProperty(startEvent) ?
                            <EventTraining  
                                key={startEvent}
                                event = {studentSchedule[startEvent]}

                                deleteTraining={this.props.deleteTraining}
                                onCancelTraining={this.props.onCancelTraining}
                                deleteEventApiPatient={this.props.deleteEventApiPatient}
                                clickOnEvent={this.props.clickOnEvent}
                            /> : ''}
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
                <div class={classStyle}>
                    <div class="rbc-time-slot rbc-eventlabel">
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
            <div class='rbc-time-eventgutter rbc-time-eventcolumn'>
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
