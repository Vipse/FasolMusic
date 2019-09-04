import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './styles.css'

class EventTraining extends React.Component{

    getBgColor = () => {
        const {event} = this.props;
        
        let backgroundColor = event.status ? {} : '#eee'; // прошло ли время тренировки
        backgroundColor = event.isComplete ? '#fdc401' : backgroundColor; // была ли завершена тренировка    
        backgroundColor = (event.idMaster == 1) ? '#ff7daa' : backgroundColor;  // нету тренера
        backgroundColor = event.isBooking ? '#21bedd' : backgroundColor;  // бронированные тренировки
        return backgroundColor;
    }

    getFunctionCross =  () => {
        const { event } = this.props;

        let crossFunc = event.trial ? this.onRemoveTrialTraining : (e) => this.onCancelTraining(e, event.id, event.idSubscription)
        crossFunc = event.hasOwnProperty('apiPatients') ? (e) => this.deleteEventApiPatients(e, event.id) : crossFunc
        return crossFunc
    }

    onRemoveTrialTraining = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.deleteTraining(this.props.event.id);
    }

    onCancelTraining = (e, id, idSubscription) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.onCancelTraining(id, idSubscription)
    }

    deleteEventApiPatients = (e, id) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.deleteEventApiPatient(id)
    }

    render() {
        const {event} = this.props;
        const backgroundColor = this.getBgColor()
        const functionCross = this.getFunctionCross()
        

        return (
                <div class='event-group' style={{ backgroundColor }}>
                    <div> 
                        <div class="event-group-cross" onClick={functionCross}>
                            {!event.isComplete && <span className="icon icon-close"></span>}
                        </div>
                        <p class="event-group-text">{event.masterFio}</p>
                    </div>
                </div>
        )
    }
}

EventTraining.propTypes = {
};

EventTraining.defaultProps = {
};

export default EventTraining;
