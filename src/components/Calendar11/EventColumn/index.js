import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'

import EventTraining from '../EventTraining'

import './styles.css'
import AdminEvent from '../AdminEvent';
import { message } from 'antd';
import history from '../../../store/history';


class EventColumn extends React.Component {

    isStudentSchedule = () => { 
        const {pathname} = history.location;
        return pathname.includes('/app/schedule') && pathname.length !== ('/app/schedule'.length) ? true : false
    }


    renderHeadColumn = () => {
        const { startTime } = this.props;
        const momentDay = moment(+startTime * 1000);

        return (
            <div className="rbc-label rbc-header-eventgutter">
                <p className="event-timebody">{momentDay.format("dddd")}</p>
                <p className="event-timebody">{momentDay.format("D")}</p>
            </div>)
    }

    isIncludeIntervals = (startEvent) => {

        const { freeInterval } = this.props;

        if (Array.isArray(freeInterval) && freeInterval.includes(+startEvent)) {
            return true
        }
        return false
    }

    isIncludeEvent = (startEvent) => {
        const { listSchedule, isAdmin } = this.props;

        if(listSchedule.hasOwnProperty(startEvent) && listSchedule[startEvent].isBooking){
            if(isAdmin) return true
            else return false
        }
    
        return listSchedule.hasOwnProperty(startEvent)
    }


    handleClickFreeEvent = (startEvent) => {
        const {
            masters,
            listNewSchedule,
            clickedIdEvent,
            clickedTrainer,

            useFrozenTraining,

            pushBtnUnfresh,
            pushBtnTrial
        } = this.props;

        if (pushBtnUnfresh) {
            let listNew = { ...listNewSchedule }

            if (!clickedTrainer.id) {
                listNew = {}
                this.props.masterFreeOnDate(startEvent, masters)
            }

            listNew[startEvent] = {
                type: 'clicked_event',
                start: startEvent,
                idMaster: clickedTrainer.id,
                masterFio: clickedTrainer.name
            }

            if(useFrozenTraining < Object.keys(listNew).length){
                message.info(`Вы можете распределеить не больше ${useFrozenTraining} тренировок`);
            }
            else{
                this.props.setParamsId({ listNewSchedule: listNew })
            }
        }

        else if (pushBtnTrial && !pushBtnUnfresh) {
            const listNew = {};
            listNew[startEvent] = {
                type: 'clicked_event',
                start: startEvent,
                idMaster: clickedTrainer.id,
                masterFio: clickedTrainer.name
            }

            this.props.setParamsId({ listNewSchedule: listNew })
            this.props.masterFreeOnDate(startEvent, masters)
        }
        else if (clickedIdEvent) {
            this.props.setParamsId({ timeClickFreeEvent: startEvent })
            this.props.showTransferOrNewScheduleModal()
        }
        else {
            message.info('Выберите тренировку')
        }

    }

    renderCells = () => {
        const { startTime, endTime, listSchedule } = this.props;
        let startTimeMoment = moment(+startTime * 1000);
        let endTimeMoment = moment(+endTime * 1000);
        let arrReander = [];

        while (startTimeMoment.isBefore(endTimeMoment)) {

            const startEvent = startTimeMoment.format('X')
            const isInclude = this.isIncludeIntervals(startEvent)
            const isIncludeEvent = this.isIncludeEvent(startEvent)

            const handleClick = isInclude ? this.handleClickFreeEvent : () => { };

            let classStyle = 'rbc-timeslot-group';

            if (isInclude && !isIncludeEvent) {
                classStyle += " rbc-timeslot-group-OK"
            }
            else {
                classStyle += " rbc-timeslot-group-NOT"
            }

            if (isIncludeEvent) {
                //debugger
            }

            arrReander.push(
                <div className={classStyle} onClick={() => handleClick(startEvent)}>
                    <div className="rbc-time-slot rbc-eventlabel">
                        {isIncludeEvent ?
                            <EventTraining
                                key={startEvent}
                                event={listSchedule[startEvent]}
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
        const { isAdmin } = this.props;

        return (
            <div className='rbc-time-eventgutter rbc-time-eventcolumn'>
                {this.renderHeadColumn()}

                {isAdmin && !this.isStudentSchedule() ? 
                    this.renderAdminCells()  
                    : 
                    this.renderCells()
                }

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
        isAdmin: state.auth.mode === "admin",
        listSchedule: { ...state.scheduleIdParams.listSchedule, ...listNewSchedule },
        freeInterval: state.scheduleIdParams.freeInterval,
        masters: state.scheduleIdParams.masters,

        useFrozenTraining: state.student.useFrozenTraining,

        listNewSchedule,
        clickedTrainer,
        clickedIdEvent,
        pushBtnUnfresh,
        pushBtnTrial,
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
