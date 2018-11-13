import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

import Icon from './../../Icon/index';
import { PerfectScrollbar } from 'react-perfect-scrollbar';
import NotificationItem from './../../Notification/index';

import { getRandomTraining } from './header/subscription';

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


        let want = [
            {
                day: 0,
                intervals: [
                    {
                        start: 1540875800000,
                        end: 1540929400000
                    }    
                ]
            },
            {
                day: 1,
                intervals: [
                    {
                        start: 1540875900000,
                        end: 1540929300000
                    }    
                ]
            }
        ]
        getRandomTraining(want);



        let eventStyle = (freeTrainers && freeTrainers.freeTrainers.length && idEvent === freeTrainers.idEvent) ?
            "event-group event-group-freetrainers"
            :
            "event-group";
            
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