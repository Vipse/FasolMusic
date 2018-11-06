import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'
import TimeSlot from './TimeSlot'
import date from './utils/dates.js'
import localizer from './localizer'
import { elementType, dateFormat } from './utils/propTypes'

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
  }

  onViewModal = () => {
    console.log("onView")
  }

  renderSlice(slotNumber, content, value) {
    const {
      dayWrapperComponent,
      showLabels,
      isNow,
      culture,
      resource,
      slotPropGetter,
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

  render() {
    const {intervals, value} = this.props;
    
// console.log('intervals, value :', intervals, value);
// console.log('this.props.events :', this.props.events);


    // const isInside = intervals.some(elem => {
    //   return  (value >= el.start*1000) && value < (el.end * 1000)
    // })

    const flag = intervals.some(el => {
      return (value >= el.start*1000) && value < (el.end * 1000)
    });
    let cellClass = cn('rbc-timeslot-group', flag ? 'rbc-timeslot-group-OK' : 'rbc-timeslot-group-NOT');

    return <div onClick={this.onViewModal} className={cellClass}>{this.renderSlices()}</div>
  }
}
