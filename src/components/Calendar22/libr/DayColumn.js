import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'
import cn from 'classnames'

import PopoverApp from '../../Popover'
import Selection, { getBoundsForNode, isEvent } from './Selection'
import dates from './utils/dates'
import { isSelected } from './utils/selection'
import localizer from './localizer'

import { notify } from './utils/helpers'
import { accessor, elementType, dateFormat } from './utils/propTypes'
import { accessor as get } from './utils/accessors'

import getStyledEvents, {
  positionFromDate,
  startsBefore,
} from './utils/dayViewLayout'

import TimeColumn from './TimeColumn'

function snapToSlot(date, step) {
  var roundTo = 1000 * 60 * step
  return new Date(Math.floor(date.getTime() / roundTo) * roundTo)
}

function startsAfter(date, max) {
  return dates.gt(dates.merge(max, date), max, 'minutes')
}

class DayColumn extends React.Component {
  static propTypes = {
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
    onDoubleClickEvent: PropTypes.func.isRequired,

    className: PropTypes.string,
    dragThroughEvents: PropTypes.bool,
    eventPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    dayWrapperComponent: elementType,
    eventComponent: elementType,
    eventWrapperComponent: elementType.isRequired,
    resource: PropTypes.string,
  }

  static defaultProps = {
    dragThroughEvents: true,
    timeslots: 2,
  }

  state = {
    selecting: false,
      event: null
  };

  componentDidMount() {
    this.props.selectable && this._selectable()
  }

  componentWillUnmount() {
    this._teardownSelectable()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectable && !this.props.selectable) this._selectable()
    if (!nextProps.selectable && this.props.selectable)
      this._teardownSelectable()
  }

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

    this._totalMin = dates.diff(min, max, 'minutes')
    let { selecting, startSlot, endSlot } = this.state
    let slotStyle = this._slotStyle(startSlot, endSlot)

    let selectDates = {
      start: this.state.startDate,
      end: this.state.endDate,
    }

    const { className, style } = (dayPropGetter && dayPropGetter(max)) || {}

    return (
      <TimeColumn
        {...props}
        className={cn(
          'rbc-day-slot',
          className,
          dates.isToday(max) && 'rbc-today'
        )}
        style={style}
        now={now}
        min={min}
        max={max}
        step={step}
      > 
        <div className={cn('rbc-events-container', { rtl: this.props.rtl })}>
          {this.renderEvents()}
        </div>
        {selecting && (
          <div className="rbc-slot-selection" style={slotStyle}>
            <span> 111
              {localizer.format(selectDates, selectRangeFormat, culture)}
            </span>
          </div>
        )}
      </TimeColumn>
    )
  }

  onEventClickHandler = (event, e) => {
      this.setState({event})
      this._select(event, e)
  }

  renderEvents = () => {
    let {
      components: { event: EventComponent },
      culture,
      endAccessor,
      eventPropGetter,
      eventTimeRangeEndFormat,
      eventTimeRangeFormat,
      eventTimeRangeStartFormat,
      eventWrapperComponent: EventWrapper,
      events,
      max,
      messages,
      min,
      rtl: isRtl,
      selected,
      showMultiDayTimes,
      startAccessor,
      step,
      timeslots,
      titleAccessor,
    } = this.props

    let styledEvents = getStyledEvents({
      events,
      startAccessor,
      endAccessor,
      min,
      showMultiDayTimes,
      totalMin: this._totalMin,
      step,
      timeslots,
    })
  
    return styledEvents.map(({ event, style }, idx) => {
    
      let _eventTimeRangeFormat = eventTimeRangeFormat
      let _continuesPrior = false
      let _continuesAfter = false
      let start = get(event, startAccessor)
      let end = get(event, endAccessor)

      if (start < min) {
        start = min
        _continuesPrior = true
        _eventTimeRangeFormat = eventTimeRangeEndFormat
      }

      if (end > max) {
        end = max
        _continuesAfter = true
        _eventTimeRangeFormat = eventTimeRangeStartFormat
      }

      let continuesPrior = startsBefore(start, min)
      let continuesAfter = startsAfter(end, max)

      let fio = get(event, 'fio')
      let label
      if (_continuesPrior && _continuesAfter) {
        label = messages.allDay
      } else {
        label = localizer.format({ start, end }, _eventTimeRangeFormat, culture)
      }

      let _isSelected = isSelected(event, selected)

      if (eventPropGetter)
        var { style: xStyle, className } = eventPropGetter(
          event,
          start,
          end,
          _isSelected
        )

      let { height, top, width, xOffset } = style
      return (
        <EventWrapper event={event} key={'evt_' + idx}>
          <PopoverApp data={this.state.event}
                      onClose={this.props.onPopoverClose}
                      onEmail={this.props.onPopoverEmail}
                      onGoto={this.props.onGotoPatient}
          >
          <div
            style={{
              ...xStyle,
              top: `${top}%`,
              height: `${height}%`,
              /*[isRtl ? 'right' : 'left']: `${Math.max(0, xOffset)}%`,*/
            }}
            title={(typeof label === 'string' ? label + ': ' : '') + fio}
            onClick={e => {
              this.onEventClickHandler(event, e)
            }}
            onDoubleClick={e => this._doubleClick(event, e)}
            className={cn('rbc-event', className, {
              /*'rbc-selected': _isSelected,*/
              'rbc-event-continues-earlier': continuesPrior,
              'rbc-event-continues-later': continuesAfter,
              'rbc-event-continues-day-prior': _continuesPrior,
              'rbc-event-continues-day-after': _continuesAfter,
            })}
          >

            <div className="rbc-event-content">
              {EventComponent ? (
                <EventComponent event={event} title={fio} />
              ) : (
                fio
              )}
            </div>
          </div>
          </PopoverApp>
        </EventWrapper>
      )
    })
  }

  _slotStyle = (startSlot, endSlot) => {
    let top = startSlot / this._totalMin * 100
    let bottom = endSlot / this._totalMin * 100

    return {
      top: top + '%',
      height: bottom - top + '%',
        width: '100%'
    }
  }

  _selectable = () => {
    let node = findDOMNode(this)
    let selector = (this._selector = new Selection(() => findDOMNode(this), {
      longPressThreshold: this.props.longPressThreshold,
    }))

    let selectionState = ({ y }) => {
      let { step, min, max } = this.props
      let { top, bottom } = getBoundsForNode(node)

      let mins = this._totalMin

      let range = Math.abs(top - bottom)

      let current = (y - top) / range

      current = snapToSlot(minToDate(mins * current, min), step)

      if (!this.state.selecting) this._initialDateSlot = current

      let initial = this._initialDateSlot

      if (dates.eq(initial, current, 'minutes'))
        current = dates.add(current, step, 'minutes')

      let start = dates.max(min, dates.min(initial, current))
      let end = dates.min(max, dates.max(initial, current))

      return {
        selecting: true,
        startDate: start,
        endDate: end,
        startSlot: positionFromDate(start, min, this._totalMin),
        endSlot: positionFromDate(end, min, this._totalMin),
      }
    }

    let selectorClicksHandler = (box, actionType) => {
        if (!isEvent(findDOMNode(this), box))
        this._selectSlot({ ...selectionState(box), action: actionType });
      this.setState({ selecting: false })
    }

    selector.on('click', box => selectorClicksHandler(box, 'click'))

    selector.on('doubleClick', box => selectorClicksHandler(box, 'doubleClick'))
  }

  _teardownSelectable = () => {
    if (!this._selector) return
    this._selector.teardown()
    this._selector = null
  }

  _selectSlot = ({ startDate, endDate, action }) => {
    let current = startDate,
      slots = []

    while (dates.lte(current, endDate)) {
      slots.push(current)
      current = dates.add(current, this.props.step, 'minutes')
    }

    notify(this.props.onSelectSlot, {
      slots,
      start: startDate,
      end: endDate,
      resourceId: this.props.resource,
      action,
    })
  }

  _select = (...args) => {
    notify(this.props.onSelectEvent, args)
  }

  _doubleClick = (...args) => {
    notify(this.props.onDoubleClickEvent, args)
  }
}

function minToDate(min, date) {
  var dt = new Date(date),
    totalMins = dates.diff(dates.startOf(date, 'day'), date, 'minutes')

  dt = dates.hours(dt, 0)
  dt = dates.minutes(dt, totalMins + min)
  dt = dates.seconds(dt, 0)
  return dates.milliseconds(dt, 0)
}

export default DayColumn
