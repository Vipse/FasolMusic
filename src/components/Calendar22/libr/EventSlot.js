import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

import Icon from './../../Icon/index';
import { PerfectScrollbar } from 'react-perfect-scrollbar';
import NotificationItem from './../../Notification/index';

import { DragSource } from 'react-dnd';
import moment from 'moment'

const itemSource = {
    beginDrag(props) {
        console.log("draggin", props)
        return props;
    },
    endDrag(props, monitor, component) {
        if(!monitor.didDrop()){
            return;
        }
        console.log('ENd drag :', props);
        return props.handleDrop(props);
    }

}

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    }
}

class EventSlot extends Component {
    constructor(props) {
        super(props);
    };

    showTransferEvent = () => {
        console.log('this.props :', this.props);
        this.props.showTransferEvent(this.props.event.id);
    }

    render() {
        const {
            event,
            mode,
            onGotoPage
        } = this.props;

        //drag and drop
        const {
            isDragging,
            connectDragSource,
            item
        } = this.props;
        const opacity = isDragging ? 0 : 1;
        let backgroundColor = event.status ? {} : '#eee'; // прошло ли время тренировки
        backgroundColor = event.isComplete ? '#fdc401' : backgroundColor; // была ли завершена тренировка    
        backgroundColor = (event.idMaster == 1) ? '#ff7daa' : backgroundColor;  // нету тренера
        backgroundColor = event.isBooking ? '#21bedd' : backgroundColor;  // бронированные тренировки

        let nameBlock =  event.name ? event.name : event.fio;
            nameBlock += event.trial ? ' Пробная ' : '';
        
        
        let isNearDay =  moment(event.start.getTime()).diff(moment(Date.now()), 'days');
        isNearDay = (isNearDay < 1) ? false : true
        
        
        if(event.status && !event.isBooking && !event.isComplete && mode !== 'master' && !event.wasTransfer && isNearDay){
            return connectDragSource(
                <div key= {event.id} className="event-group" style={{opacity, backgroundColor}}>
                        <div>
                            <div className="event-group-cross">
                                <Icon type='close' size={7} onClick={() => this.props.onCancelTraining(event.id, event.idSubscription)}/>
                            </div>
                            <p className="event-group-text" >
                                {nameBlock}
                            </p>
                        </div>
                </div>
            )
        }

        const eventKey = event.idMaster ? event.idMaster: event.id
        return (
            <div key = {eventKey} onClick={()=> onGotoPage(eventKey)}  className="event-group" style={{backgroundColor}}>
                    <div>
                        <div className="event-group-cross">
                            <Icon type='close' size={7} onClick={() => this.showTransferEvent()}/>
                        </div>
                        <p className="event-group-text" >
                            {nameBlock}
                        </p>
                    </div>
            </div>
        )
        
    }
}



EventSlot.propTypes = {
     event : PropTypes.object,
     showTransferEvent : PropTypes.func,
     freeTrainers: PropTypes.object,
     idEvent: PropTypes.number,
  }
  
  EventSlot.defaultProps = {
      freeTrainers: null,
      showTransferEvent: () => {},
  }


  export default DragSource('event-group', itemSource, collect)(EventSlot);