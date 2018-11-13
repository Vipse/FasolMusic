import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'
import TimeSlot from './TimeSlot'
import date from './utils/dates.js'
import localizer from './header/localizer'
import { elementType, dateFormat } from './utils/propTypes'

import EventSlot from './EventSlot';

export default class TimeSlotGroup extends Component {
  static propTypes = {
    dayWrapperComponent: elementType,
    timeslots: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    value: PropTypes.instanceOf(Date).isRequired,
    showLabels: PropTypes.bool,
    isNow: PropTypes.bool,
    slotPropGetter: PropTypes.func,
    timeGutterFormat: dateFormat,
    culture: PropTypes.string,
    resource: PropTypes.string,
  }
  static defaultProps = {
    timeslots: 2,
    step: 30,
    isNow: false,
    showLabels: false,
    freeTrainers: null,
  }


  renderSlice(slotNumber, content, value) {
    const {
      dayWrapperComponent,
      showLabels,
      isNow,
      culture,
      resource,
      slotPropGetter,
      showTransferEvent, //my
    } = this.props
    
    return (
      <TimeSlot
        key={slotNumber}
        slotNumber={slotNumber}
        slotPropGetter={slotPropGetter}
        dayWrapperComponent={dayWrapperComponent}
        showLabel={showLabels}
        content={content}
        culture={culture}
        isNow={isNow}
        resource={resource}
        value={value}
        showTransferEvent={showTransferEvent}
      /> 
    )
  }

  renderSlices() {
    const ret = []
    const sliceLength = this.props.step
    let sliceValue = this.props.value;
    for (let i = 0; i < this.props.timeslots; i++) {
      const content = localizer.format(
        sliceValue,
        'HH:mm',
        this.props.culture
      );
      ret.push(this.renderSlice(i, content, sliceValue))
      sliceValue = date.add(sliceValue, sliceLength, 'minutes')
    }
    return ret
  }

  renderEvent = () => {
    let {
      events, 
      showTransferEvent, 
      freeTrainers,
      setChoosenTrainer,
      showLabels
    } = this.props;
   
    for( let i = 0; i < events.length; i++){
     
          if(events[i].start.getTime() === this.props.value.getTime() && !showLabels) {
            return (
              <EventSlot 
                  value={this.props.value.getTime()}
                  event={events[i]}
                  showTransferEvent={showTransferEvent} 
                  setChoosenTrainer={this.props.setChoosenTrainer}
                  freeTrainers={freeTrainers}
                  idEvent={events[i].start.getTime()}
                 
            />)
          }
    }
    if(freeTrainers && freeTrainers.idEvent === this.props.value.getTime() && !showLabels){ // рендер выпадающего списка freeTrainer
        return <EventSlot 
            value={this.props.value.getTime()}
            showTransferEvent={showTransferEvent} 
            freeTrainers={freeTrainers}
            setChoosenTrainer={this.props.setChoosenTrainer}
            idEvent={freeTrainers.idEvent}
        />
    }
   
    return null;
  }

  showModalTransferEvent = (e,idValue) => {
      e.preventDefault();
     this.props.showModalTransferEvent(idValue);
  }

  render() {
    const {intervals, value, freeTrainers} = this.props;
    

    const flag = intervals.some(el => {
      return (value >= el.start*1000) && value < (el.end * 1000)
    });

    const modalTransferEvent = flag ? this.showModalTransferEvent : () => {}; // перенос тренировки
    const isViewTrainer = (freeTrainers && freeTrainers.idEvent === this.props.value.getTime()) ? true : false;//не OK если таместь freeTrainers
    const currentEvent = this.renderEvent();

    let cellClass = cn('rbc-timeslot-group', flag && !isViewTrainer && !currentEvent ? 'rbc-timeslot-group-OK' : 'rbc-timeslot-group-NOT');

    return <div className={cellClass} onClick={(e) => modalTransferEvent(e, value.getTime())}>
              {this.renderSlices()}
              {currentEvent}
            </div>
  }
}
