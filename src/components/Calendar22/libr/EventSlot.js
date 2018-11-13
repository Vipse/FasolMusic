import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

import Icon from './../../Icon/index';
import { PerfectScrollbar } from 'react-perfect-scrollbar';
import NotificationItem from './../../Notification/index';

export default class EventSlot extends Component {
    constructor(props) {
        super(props);
    };

    showTransferEvent = (id) => {
        this.props.showTransferEvent(id);
    }
    getChoosenTrainer = (id) => {
        this.props.setChoosenTrainer(id, this.props.value);
    }

    render() {
        const {
            event,
            freeTrainers,
            idEvent
        } = this.props;

        let eventStyle = (freeTrainers && freeTrainers.freeTrainers.length && idEvent === freeTrainers.idEvent) ?
            "event-group event-group-freetrainers"
            :
            "event-group";
            
            console.log('freeTrainers :', freeTrainers);
        return (
        <div className={eventStyle} >
            {freeTrainers && freeTrainers.freeTrainers.length && idEvent === freeTrainers.idEvent ? 
                freeTrainers.freeTrainers.map((elem) => {
                    return (
                        <p className="event-group-text" key={elem.id} onClick={() => this.getChoosenTrainer(elem.id)}>
                            {elem.fio}
                        </p>)
                })
                
                :
                <div>
                    <div className="event-group-cross">
                        <Icon type='close' size={7} onClick={() => this.showTransferEvent(this.props.event.id)}/>
                    </div>
                    <p className="event-group-text" >
                        {event.fio}
                    </p>
                </div>
            }
           
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