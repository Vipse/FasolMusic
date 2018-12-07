import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import dates from './utils/dates'

import { accessor, elementType, dateFormat } from './utils/propTypes'

import TimeColumn from './TimeColumn'

class DayColumn extends React.Component {

  state = {
    selecting: false,
      event: null
  };

  render() {
    const {
      min,
      max,
      step,
      now,
      selectRangeFormat,
      culture,
      dayPropGetter,
      ...props
    } = this.props

    return (
      <TimeColumn
        {...props}
        className={cn(
          'rbc-day-slot',
          dates.isToday(max) && 'rbc-today'
        )}
        now={now}
        min={min}
        max={max}
        step={step}
      > 
        
      </TimeColumn>
    )
  }

}

DayColumn.propTypes = {
  events: PropTypes.array.isRequired,
  components: PropTypes.object,
  step: PropTypes.number.isRequired,
  min: PropTypes.instanceOf(Date).isRequired,
  max: PropTypes.instanceOf(Date).isRequired,
  now: PropTypes.instanceOf(Date),

  rtl: PropTypes.bool,
  titleAccessor: accessor,
  allDayAccessor: accessor.isRequired,
  startAccessor: accessor.isRequired,
  endAccessor: accessor.isRequired,

  selectRangeFormat: dateFormat,
  eventTimeRangeFormat: dateFormat,
  eventTimeRangeStartFormat: dateFormat,
  eventTimeRangeEndFormat: dateFormat,
  showMultiDayTimes: PropTypes.bool,
  culture: PropTypes.string,
  timeslots: PropTypes.number,
  messages: PropTypes.object,

  selected: PropTypes.object,
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
  eventOffset: PropTypes.number,
  longPressThreshold: PropTypes.number,

  onSelecting: PropTypes.func,
  onSelectSlot: PropTypes.func.isRequired,
  onSelectEvent: PropTypes.func.isRequired,

  className: PropTypes.string,
  dragThroughEvents: PropTypes.bool,
  eventPropGetter: PropTypes.func,
  dayWrapperComponent: elementType,
  eventComponent: elementType,
  resource: PropTypes.string,

  showTransferEvent:PropTypes.func,
  freeTrainers: PropTypes.object,
  showModalTransferEvent: PropTypes.func,
  setChoosenTrainer: PropTypes.func,
  transferTraining: PropTypes.func,
  setTransfer_End_Training: PropTypes.func,
}

DayColumn.defaultProps = {
  dragThroughEvents: true,
  timeslots: 2,
}

export default DayColumn
