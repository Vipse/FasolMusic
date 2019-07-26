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

    getSlotName = (event) => {
        let name = (event.name) ? 
            event.name : (event.fio) ? 
                event.fio : '';
        
        if (name !== null && name !== undefined && name !== "" && name !== " "){
            name = name.substring(0,
                                    name.indexOf('@') > 0 ? 
                                        name.indexOf('@') : name.length
                                 ) 
        }

        name += event.trial ? ' Пробная ' : '';
        
        return name;
    }

    render() {
        const {
            event,
            mode,
            onGotoPage,
            isPushBtnTransfer,
            idEvent,
            clickOnEvent,
            isDragging,
            selectIdEvent,
            connectDragSource,
            item,
        } = this.props;

        const opacity = isDragging ? 0 : 1;
        const dragFunc = event.trial ? this.props.onRemoveTrialTraining : () => this.props.onCancelTraining(event.id, event.idSubscription)


        let backgroundColor = event.status ? '#b6e0ff' : '#f3f3f3'; // прошло ли время тренировки
            backgroundColor = event.isComplete ? '#fdc401' : backgroundColor; // была ли завершена тренировка    
            backgroundColor = (event.idMaster == 1) ? '#ff7daa' : backgroundColor;  // нету тренера
            backgroundColor = event.isBooking ? '#c0c0c0' : backgroundColor;  // бронированные тренировки
            backgroundColor = (event.id === selectIdEvent) ? '#FDC4ED' : backgroundColor

        let nameBlock = this.getSlotName(event);
               
        let isNearDay =  moment(event.start.getTime()).diff(moment(Date.now()), 'days');
            isNearDay = (isNearDay < 1) ? false : true
        
        let viewCross = event.isComplete ? false : true // если заверешна то без крестика
        
        // if( event.status && 
        //     !event.isBooking && 
        //     !event.isComplete && 
        //     mode !== 'master' && 
        //     !event.wasTransfer && 
        //     isNearDay &&
        //     isPushBtnTransfer &&
        //     !event.trial
        // ){
        //     return connectDragSource(
        //         <div key= {event.id} className="event-group" style={{opacity, backgroundColor}}>
        //                 <div>
        //                     {viewCross && <div className="event-group-cross">
        //                         <Icon 
        //                             type='close' 
        //                             size={7} 
        //                             onClick={dragFunc}/>
        //                     </div>}
        //                     <p className="event-group-text" >
        //                         {nameBlock}
        //                     </p>
        //                 </div>
        //         </div>
        //     )
        // }

        const eventKey = event.idMaster ? event.idMaster: event.id;
        let funcOnClick = (eventKey && eventKey != 1) ? () => onGotoPage(eventKey) : () => {};
        funcOnClick = mode === 'master' ? () => onGotoPage(event.idStudent) : funcOnClick;
        if(isPushBtnTransfer) funcOnClick = () => clickOnEvent(event)
        
        let crossFunc = event.trial ? this.onRemoveTrialTraining : (e) => this.onCancelTraining(e, event.id, event.idSubscription)
            crossFunc = event.hasOwnProperty('apiPatients') ? (e) => this.deleteEventApiPatients(e,event.id) : crossFunc

        

        return (
           (event.isBooking && mode == 'student') ?
           <div></div>
           :
            <div key = {event.dateStart} onClick={funcOnClick}  className="event-group" style={{backgroundColor}}>
                    <div>
                        {viewCross && <div className="event-group-cross">
                            <Icon type='close' size={7} onClick={crossFunc}/>
                        </div>}
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


  //export default DragSource('event-group', itemSource, collect)(EventSlot);
  export default EventSlot;