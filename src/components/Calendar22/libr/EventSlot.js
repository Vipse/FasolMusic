import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

import Icon from './../../Icon/index';
import { PerfectScrollbar } from 'react-perfect-scrollbar';
import NotificationItem from './../../Notification/index';

import { DragSource } from 'react-dnd';


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
            event
        } = this.props;

        //drag and drop
        const {
            isDragging,
            connectDragSource,
            item
        } = this.props;
        const opacity = isDragging ? 0 : 1;
        let backgroundColor = event.status ? {} : '#eee'; // цвет на была ли тренировка
        backgroundColor = event.isBooking ? '#21bedd' : backgroundColor;  // бронированные тренировки

console.log('event :', event);
       
        if(event.status && !event.isBooking){
            return connectDragSource(
                <div key= {event.id} className="event-group" style={{opacity, backgroundColor}}>
                        <div>
                            <div className="event-group-cross">
                                <Icon type='close' size={7} onClick={() => this.props.setAbonement_Training}/>
                            </div>
                            <p className="event-group-text" >
                                {event.fio}
                            </p>
                        </div>
                </div>
            )
        }

        
        return (
            <div key = {event.id} className="event-group" style={{backgroundColor}}>
                    <div>
                        <div className="event-group-cross">
                            <Icon type='close' size={7} onClick={() => this.showTransferEvent()}/>
                        </div>
                        <p className="event-group-text" >
                            {event.fio}
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