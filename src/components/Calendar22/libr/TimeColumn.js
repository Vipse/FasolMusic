import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

import dates from './utils/dates'
import { elementType, dateFormat } from './utils/propTypes'
import BackgroundWrapper from './BackgroundWrapper'
import TimeSlotGroup from './TimeSlotGroup'
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import moment from 'moment';

export default class TimeColumn extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    culture: PropTypes.string,
    timeslots: PropTypes.number.isRequired,
    now: PropTypes.instanceOf(Date).isRequired,
    min: PropTypes.instanceOf(Date).isRequired,
    max: PropTypes.instanceOf(Date).isRequired,
    showLabels: PropTypes.bool,
    timeGutterFormat: dateFormat,
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    resource: PropTypes.string,

    slotPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    dayWrapperComponent: elementType,

    freeTrainers: PropTypes.object,
    showModalTransferEvent: PropTypes.func,
    setChoosenTrainer: PropTypes.func,
    transferTraining: PropTypes.func,
    onCancelTraining: PropTypes.func,
    trainerTraining: PropTypes.object,
  }
  static defaultProps = {
    step: 30,
    timeslots: 2,
    showLabels: false,
    type: 'day',
    className: '',
    dayWrapperComponent: BackgroundWrapper,
  }

  renderTimeSliceGroup(key, isNow, date, resource) {
    const {
      dayWrapperComponent,
      timeslots,
      showLabels,
      step,
      slotPropGetter,
      dayPropGetter,
      timeGutterFormat,
      culture,
      events,
      showTransferEvent,
      freeTrainers,
      showModalTransferEvent,
      setChoosenTrainer, 
      intervals,
      handleDrop,
      transferTraining,
      onCancelTraining,
      trainerTraining,
      masterList,
      isAdmin,
      showMasterList,
      mode,
      onGotoPage,
      isPushBtnTransfer,
      onRemoveTrialTraining
    } = this.props;

    let slotMasterList = null;
    for(let el in masterList){
      
        if(+el * 1000 === date.getTime()){
            slotMasterList = masterList[el];
        }
    }

    return (
      <TimeSlotGroup
        key={key}
        isNow={isNow}
        events={events}
        value={date}
        step={step}
        masterList={slotMasterList}
        isAdmin={isAdmin}

        slotPropGetter={slotPropGetter}
        dayPropGetter={dayPropGetter}
        intervals={intervals}
        culture={culture}
        timeslots={timeslots}
        resource={resource}
        showLabels={showLabels}
        timeGutterFormat={timeGutterFormat}
        dayWrapperComponent={dayWrapperComponent}
        children={this.props.children}

        showTransferEvent={showTransferEvent}
        freeTrainers={freeTrainers}
        showModalTransferEvent={showModalTransferEvent}
        setChoosenTrainer={setChoosenTrainer}
        handleDrop = {handleDrop}
        transferTraining = {transferTraining}
        setAbonement_Training = {this.props.setAbonement_Training}
        onCancelTraining = {onCancelTraining}
        trainerTraining = {trainerTraining}
        showMasterList  = {showMasterList}
        mode = {mode}
        onGotoPage = {onGotoPage}
        isPushBtnTransfer = {isPushBtnTransfer}
        onRemoveTrialTraining = {onRemoveTrialTraining}
        deleteTraining = {this.props.deleteTraining}

      />
    )
  }

  render() {
    const {
      className,
      children,
      style,
      now,
      min,
      max,
      step,
      resource,
      
    } = this.props;

      let timeslots = 1;

    const totalMin = dates.diff(min, max, 'minutes')
    const numGroups = Math.ceil(totalMin / (step * timeslots))
    const renderedSlots = []
    const groupLengthInMinutes = step * timeslots

    let date = min
    let next = date
    let isNow = false
    for (var i = 0; i < numGroups; i++) {
      isNow = dates.inRange(
        now,
        date,
        dates.add(next, groupLengthInMinutes - 1, 'minutes'),
        'minutes'
      )
      next = dates.add(date, groupLengthInMinutes, 'minutes')

      renderedSlots.push(this.renderTimeSliceGroup(i, isNow, date, resource))

      date = next
    }

    return (
      <div className={cn(className, 'rbc-time-column')} style={style}>
        {renderedSlots}
        {children}
      </div>
    )
  }
}
