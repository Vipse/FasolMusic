import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import EventTraining from '../EventTraining'

import './styles.css'
import AdminEvent from '../AdminEvent';


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
        
        const {intervals} = this.props;

        if(Array.isArray(intervals) && intervals.includes(+startEvent)) {
            return  "rbc-timeslot-group-OK"
        }
        return "rbc-timeslot-group-NOT"
    }

    renderCells = () => {
        const { startTime, endTime, studentSchedule, eventWillTransfer } = this.props;
        let startTimeMoment = moment(+startTime * 1000);
        let endTimeMoment = moment(+endTime * 1000);
        let arrReander = [];

        while (startTimeMoment.isBefore(endTimeMoment)) {
            let startEvent = startTimeMoment.format('X')
            let classStyle = "rbc-timeslot-group " + this.isIncludeIntervals(startEvent)

            
            arrReander.push(
                <div class={classStyle}>
                    <div class="rbc-time-slot rbc-eventlabel">
                        {studentSchedule && studentSchedule.hasOwnProperty(startEvent) ?
                            <EventTraining  
                                key={startEvent}
                                event = {studentSchedule[startEvent]}
                                eventWillTransfer = {eventWillTransfer}

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
    intervals: {}
};

export default EventColumn;
