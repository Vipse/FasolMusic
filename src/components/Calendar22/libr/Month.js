import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'
import cn from 'classnames'

import dates from './utils/dates'
import localizer from './localizer'
import chunk from 'lodash/chunk'

import { navigate, views } from './utils/constants'
import { notify } from './utils/helpers'
import getPosition from 'dom-helpers/query/position'
import raf from 'dom-helpers/util/requestAnimationFrame'

import DateContentRow from './DateContentRow'
import Header from './Header'
import DateHeader from './DateHeader'

import { accessor, dateFormat } from './utils/propTypes'
import { segStyle, inRange, sortEvents, sortScheds } from './utils/eventLevels'

let eventsForWeek = (evts, start, end, props) =>
  evts.filter(e => inRange(e, start, end, props))

let schedsForWeek = (evts, start, end, props,editor) =>
    evts.filter(e => inRange(e, start, end, props,editor))

let propTypes = {
  events: PropTypes.array.isRequired,
  date: PropTypes.instanceOf(Date),

  min: PropTypes.instanceOf(Date),
  max: PropTypes.instanceOf(Date),

  step: PropTypes.number,
  now: PropTypes.instanceOf(Date),

  scrollToTime: PropTypes.instanceOf(Date),
  eventPropGetter: PropTypes.func,
  dayPropGetter: PropTypes.func,

  culture: PropTypes.string,
  dayFormat: dateFormat,

  rtl: PropTypes.bool,
  width: PropTypes.number,

  titleAccessor: accessor.isRequired,
  allDayAccessor: accessor.isRequired,
  startAccessor: accessor.isRequired,
  endAccessor: accessor.isRequired,

  selected: PropTypes.object,
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: PropTypes.number,

  onNavigate: PropTypes.func,
  onSelectSlot: PropTypes.func,
  onSelectEvent: PropTypes.func,
  onDoubleClickEvent: PropTypes.func,
  onShowMore: PropTypes.func,
  onDrillDown: PropTypes.func,
  getDrilldownView: PropTypes.func.isRequired,

  dateFormat,

  weekdayFormat: dateFormat,
  popup: PropTypes.bool,

  messages: PropTypes.object,
  components: PropTypes.object.isRequired,
  popupOffset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ]),
}

class MonthView extends React.Component {
  static displayName = 'MonthView'
  static propTypes = propTypes

  static defaultProps = {
    now: new Date(),
  }

  constructor(...args) {
    super(...args)

    this.state = {
      rowLimit: 5,
      needLimitMeasure: true,
    }
  }

  componentWillReceiveProps({ date }) {
    this.setState({
      needLimitMeasure: !dates.eq(date, this.props.date),
    })
  }

  componentDidMount() {
    let running

    if (this.state.needLimitMeasure) this.measureRowLimit(this.props)

    window.addEventListener(
      'resize',
      (this._resizeListener = () => {
        if (!running) {
          raf(() => {
            running = false
            this.setState({ needLimitMeasure: true }) //eslint-disable-line
          })
        }
      }),
      false
    )
  }

  componentDidUpdate() {
    if (this.state.needLimitMeasure) this.measureRowLimit(this.props)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeListener, false)
  }

  getContainer = () => {
    return findDOMNode(this)
  }

  render() {
    let { date, culture, weekdayFormat, className } = this.props,
      month = dates.visibleDays(date, culture),
      weeks = chunk(month, 7)

    // this._weekCount = weeks.length

    return (
      <div className={cn('rbc-month-view', className)}>
        <div className="rbc-row rbc-month-header">
          {this.renderHeaders(weeks[0], weekdayFormat, culture)}
        </div>
        {weeks.map(this.renderWeek)}
      </div>
    )
  }

  renderWeek = (week, weekIdx) => {
    let {
      events,
        schedules,
      components,
      selectable,
      titleAccessor,
      startAccessor,
      endAccessor,
      allDayAccessor,
      eventPropGetter,
      dayPropGetter,
      messages,
      selected,
      now,
      date,
      longPressThreshold,
        editor,
        isUser,
    } = this.props;

    const { needLimitMeasure, rowLimit } = this.state;
    if(editor) {
      schedules =  schedsForWeek(schedules, week[0], week[week.length - 1], this.props,true);
      schedules.sort((a, b) => sortScheds(a, b, this.props))
    }
    else{
        events = eventsForWeek(events, week[0], week[week.length - 1], this.props);
        events.sort((a, b) => sortEvents(a, b, this.props))
    }


    return (
      <DateContentRow
        key={weekIdx}
        weekIdx={weekIdx}
        ref={weekIdx === 0 ? 'slotRow' : undefined}
        container={this.getContainer}
        className="rbc-month-row"
        now={now}
        date={date}
        range={week}
        events={events}
        maxRows={rowLimit}
        selected={selected}
        selectable={selectable}
        messages={messages}
        titleAccessor={titleAccessor}
        startAccessor={startAccessor}
        endAccessor={endAccessor}
        allDayAccessor={allDayAccessor}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        renderHeader={this.readerDateHeading}
        renderForMeasure={needLimitMeasure}
        onShowMore={this.handleShowMore}
        isUser={isUser}
        cancelAppByPatient = {this.props.cancelAppByPatient}
        schedules={schedules}
        editor={editor}
        onSelect={this.handleSelectEvent}
        onSelectSlot={this.handleSelectSlot}
        eventComponent={components.event}
        eventWrapperComponent={components.eventWrapper}
        dateCellWrapper={components.dateCellWrapper}
        longPressThreshold={longPressThreshold}
      />
    )
  }

  readerDateHeading = ({ date, className, ...props }) => {
    let {
      date: currentDate,
      getDrilldownView,
      dateFormat,
      culture,
    } = this.props

    let isOffRange = dates.month(date) !== dates.month(currentDate)
    let isCurrent = dates.eq(date, currentDate, 'day')
    let drilldownView = getDrilldownView(date)
    let label = localizer.format(date, dateFormat, culture)
    let DateHeaderComponent = this.props.components.dateHeader || DateHeader

    return (
      <div
        {...props}
        className={cn(
          className,
          isOffRange && 'rbc-off-range',
          isCurrent && 'rbc-current'
        )}
        onClick={(e) => this.handleHeadingClick(date, drilldownView, e)}
      >
        <DateHeaderComponent
          label={label}
          date={date}
          drilldownView={drilldownView}
          isOffRange={isOffRange}
        />
      </div>
    )
  }



  renderHeaders(row, format, culture) {
    let first = row[0]
    let last = row[row.length - 1]

    return dates.range(first, last, 'day').map((day, idx) => (
      <div key={'header_' + idx} className="rbc-header" style={segStyle(1, 7)}>
        <Header
          label={localizer.format(day, 'dddd', culture)}
        />
      </div>
    ))
  }


  measureRowLimit() {
    this.setState({
      needLimitMeasure: false,
      rowLimit: this.refs.slotRow.getRowLimit(),
    })
  }

  handleSelectSlot = (range, slotInfo,selecting) => {

      if(this.props.editor){
        let allowed = true,
            time = null,
            schedule = {};

          if(range && slotInfo.action === 'click'){
            let selectedTime = range[0],
                notNext = false;
            this.props.schedules.every(sched => {
                if(sched.intervalOb.length !==0){
                  time = sched.intervalOb[0].start;
                  notNext = time.getDate() === selectedTime.getDate() &&
                      time.getMonth() === selectedTime.getMonth() &&
                      time.getFullYear() === selectedTime.getFullYear();
                  if(notNext){
                    allowed = +(sched.isEditable);
                    schedule = sched;
                  }
                }
                else if(sched.intervalEx.length !==0){
                    time = sched.intervalEx[0].start;
                    notNext = time.getDate() === selectedTime.getDate() &&
                        time.getMonth() === selectedTime.getMonth() &&
                        time.getFullYear() === selectedTime.getFullYear();
                    if(notNext){
                        allowed = +(sched.isEditable);
                        schedule = sched;
                    }
                }
                return !notNext;
            });
          }
          if (allowed)
            this.props.onSelecting(range, slotInfo,selecting, schedule)
    }
  }

  handleHeadingClick = (date, view, e) => {
      e.preventDefault()
    notify(this.props.onDrillDown, [date, view])
  }

  handleSelectEvent = (...args) => {
    notify(this.props.onSelectEvent, args)
  }

  handleShowMore = (events, date, cell, slot) => {

    const { popup, onDrillDown, onShowMore, getDrilldownView } = this.props

    if (popup) {
      let position = getPosition(cell, findDOMNode(this))

      this.setState({
        overlay: { date, events, position },
      })
    } else {
      notify(onDrillDown, [date, getDrilldownView(date) || views.DAY])
    }

    notify(onShowMore, [events, date, slot])
  }

}

MonthView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'month')

    case navigate.NEXT:
      return dates.add(date, 1, 'month')

    default:
      return date
  }
}

MonthView.title = (date, { formats, culture }) =>
  localizer.format(date, formats.monthHeaderFormat, culture)

export default MonthView
