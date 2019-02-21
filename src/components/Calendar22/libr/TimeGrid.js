import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'
import { findDOMNode } from 'react-dom'

import dates from './utils/dates'
import localizer from './header/localizer'
import DayColumn from './DayColumn'
import TimeColumn from './TimeColumn'
import Header from './header/Header'
import Icon from '../../Icon'

import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import message from './utils/messages'

import { accessor, dateFormat } from './utils/propTypes'
import { notify } from './utils/helpers'
import { accessor as get } from './utils/accessors'

import { inRange, sortEvents, segStyle } from './utils/eventLevels'
import moment from 'moment';

class TimeGrid extends Component {
  constructor(props) {
    super(props)
    this.state = { gutterWidth: undefined, isOverflowing: null }
    this.handleSelectEvent = this.handleSelectEvent.bind(this)
    this.handleDoubleClickEvent = this.handleDoubleClickEvent.bind(this)
    this.handleHeaderClick = this.handleHeaderClick.bind(this)
  }

  componentWillMount() {
    this._gutters = []
    this.calculateScroll()
  }

  componentDidMount() {
    
    this.checkOverflow()
    this.applyScroll()
  }

  componentWillUnmount() {
    window.clearTimeout(this._timeIndicatorTimeout)
  }

  componentDidUpdate() {
    this.applyScroll();
  }

  componentWillReceiveProps(nextProps) {
    const { range, scrollToTime } = this.props
    // When paginating, reset scroll
    if (
      !dates.eq(nextProps.range[0], range[0], 'minute') ||
      !dates.eq(nextProps.scrollToTime, scrollToTime, 'minute')
    ) {
      this.calculateScroll()
    }
  }

  // fasol - для каждого DayColumn соответствующий intervals
  getCurrentIntervalsDay = (date) => { 
    
    let {intervals} = this.props;

    let answer = [];
    if( Array.isArray(intervals) && intervals.length > 0){

        for(let i = 0; i < intervals.length; i++){
              if(intervals[i].day === moment(date.getTime()).day()){
                //this.numberDay++;

                
                answer = [...answer, ...intervals[i].intervals];
              }
        }
    }
    return answer;
  }

  render() {
      let {
      events,
      range,
      width,
      startAccessor,
      endAccessor,
      resources,
      allDayAccessor,
      showMultiDayTimes,
      handleDrop
    } = this.props

    width = width || this.state.gutterWidth

    let start = range[0],
      end = range[range.length - 1]

    this.slots = range.length

    let allDayEvents = [],
      rangeEvents = []

    events.forEach(event => {
        if (inRange(event, start, end, this.props)) {
        let eStart = get(event, startAccessor),
          eEnd = get(event, endAccessor)


        if (
          get(event, allDayAccessor) ||
          (dates.isJustDate(eStart) && dates.isJustDate(eEnd)) ||
          (!showMultiDayTimes && !dates.eq(eStart, eEnd, 'day'))
        ) {
          allDayEvents.push(event)
        } else {
          rangeEvents.push(event)
        }
      }
    })

    allDayEvents.sort((a, b) => sortEvents(a, b, this.props))

    let gutterRef = ref => (this._gutters[1] = ref && findDOMNode(ref))

    let eventsRendered = this.renderEvents(
      range,
      this.props.events,// rangeEvents,
      this.props.now,
      resources || [null]
    )

    return (
      <div className="rbc-time-view">
        {this.renderHeader(range, allDayEvents, width, resources)}

        {
          // this.props.intervals.length ? 
          (
            <div ref="content" className="rbc-time-content">
            
                  <TimeColumn
                    {...this.props}
                    showLabels
                    style={{ width }}
                    ref={gutterRef}
                    className="rbc-time-gutter"
                    showLabels={false}
                  />
                  {eventsRendered}
                 
                </div>
          ) 
          // : (
          //   <div ref="content" className="calendar-empty-content">
          //     <div className="warning">График не заполнен.</div>
          //   </div>
          // )
        }
      </div>
    )
  }

  renderEvents(range, events, today, resources) {
    let {
      min,
      max,
      endAccessor,
      startAccessor,
      resourceAccessor,
      resourceIdAccessor,
      components,
      intervals
    } = this.props

    this.numberDay = 0;
 

    return range.map((date, idx) => {
      let daysEvents = events.filter(event => 
      
          dates.inRange(
            date,
            get(event, startAccessor),
            get(event, endAccessor),
            'day'
          )
        
      )
      return resources.map((resource, id) => {
        let eventsToDisplay = !resource
          ? daysEvents
          : daysEvents.filter(
              event =>
                get(event, resourceAccessor) ===
                get(resource, resourceIdAccessor)
            )

        return (
          <DayColumn
            {...this.props}

            intervals={this.getCurrentIntervalsDay(date)}
            min={dates.merge(date, min)}
            max={dates.merge(date, max)}
            resource={resource && resource.id}
            eventComponent={components.event}
          
            dayWrapperComponent={components.dayWrapper}
            className={cn({ 'rbc-now': dates.eq(date, today, 'day') })}
            style={segStyle(1, this.slots)}
            key={idx + '-' + id}
            date={date}
            events={events}  //eventsToDisplay
            showLabels={true}
          />
        )
      })
    })
  }

  renderHeader(range, events, width, resources) {
    let { messages, rtl, selectable, components, now } = this.props
    let { isOverflowing } = this.state || {}

    let style = {}
    if (isOverflowing)
      style[rtl ? 'marginLeft' : 'marginRight'] = scrollbarSize() + 'px'

    let headerRendered = resources
      ? this.renderHeaderResources(range, resources)
      : message(messages).allDay

    return (
      <div
        ref="headerCell"
        className={cn('rbc-time-header', isOverflowing && 'rbc-overflowing')}
        style={style}
      >
        <div className="rbc-row">
          <div className="rbc-label rbc-header-gutter rbc-clock-icon">
            <Icon type="clock" svg size={28}/>
          </div>
            {this.renderHeaderCells(range)}
        </div>
        {resources && (
          <div className="rbc-row rbc-row-resource">
            <div className="rbc-label rbc-header-gutter" style={{ width }} />
            {headerRendered}
          </div>
        )}

        
      </div>
    )
  }

  renderHeaderResources(range, resources) {
    const { resourceTitleAccessor } = this.props
    return range.map((date, i) => {
      return resources.map((resource, j) => {
        return (
          <div
            key={i + '-' + j}
            className={cn('rbc-header', dates.isToday(date) && 'rbc-today')}
            style={segStyle(1, this.slots)}
          >
            <span>{get(resource, resourceTitleAccessor)}</span>
          </div>
        )
      })
    })
  }

  renderHeaderCells(range) {
    let {
      dayFormat,
      culture,
      dayPropGetter,
      getDrilldownView,
    } = this.props
    let HeaderComponent = Header
      
    return range.map((date, i) => {
        let drilldownView = getDrilldownView(date)
        let labels = [localizer.format(date, 'dddd', culture),
            localizer.format(date, 'DD', culture)];

        const { className, style: dayStyles } =
        (dayPropGetter && dayPropGetter(date)) || {}

      let header = (
        <HeaderComponent
          date={date}
          labels={labels}
          localizer={localizer}
          format={dayFormat}
          culture={culture}
        />
      )

      return (
        <div
          key={i}
          className={cn(
            'rbc-header',
            className,
            dates.isToday(date) && 'rbc-today'
          )}
          style={Object.assign({}, dayStyles, segStyle(1, this.slots ))}
        >
            {
                drilldownView ? (
                    <span onClick={e => this.handleHeaderClick(date, drilldownView, e)}>
                        {header}
                    </span>
                    ) : (
                        <span>{header}</span>
                    )
            }
          
        </div>
      )
    })
  }

  handleHeaderClick(date, view, e) {
    e.preventDefault()
    notify(this.props.onDrillDown, [date, view])
  }

  handleSelectEvent(...args) {
    notify(this.props.onSelectEvent, args)
  }

  handleDoubleClickEvent(...args) {
    notify(this.props.onDoubleClickEvent, args)
  }

  applyScroll() {
    if (this._scrollRatio) {
      const { content } = this.refs
      content.scrollTop = content.scrollHeight * this._scrollRatio
      // Only do this once
      this._scrollRatio = null
    }
  }

  calculateScroll() {
    const { min, max, scrollToTime } = this.props

    const diffMillis = scrollToTime - dates.startOf(scrollToTime, 'day')
    const totalMillis = dates.diff(max, min)

    this._scrollRatio = diffMillis / totalMillis
  }

  checkOverflow() {
    if (this._updatingOverflow) return

    let isOverflowing =
      this.refs.content.scrollHeight > this.refs.content.clientHeight

    if (this.state.isOverflowing !== isOverflowing) {
      this._updatingOverflow = true
      this.setState({ isOverflowing }, () => {
        this._updatingOverflow = false
      })
    }
  }
}


TimeGrid.propTypes = {
  events: PropTypes.array.isRequired,
  resources: PropTypes.array,

  step: PropTypes.number,
  range: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  min: PropTypes.instanceOf(Date),
  max: PropTypes.instanceOf(Date),
  now: PropTypes.instanceOf(Date),

  scrollToTime: PropTypes.instanceOf(Date),
  eventPropGetter: PropTypes.func,
  dayPropGetter: PropTypes.func,
  dayFormat: dateFormat,
  showMultiDayTimes: PropTypes.bool,
  culture: PropTypes.string,

  rtl: PropTypes.bool,
  width: PropTypes.number,

  titleAccessor: accessor.isRequired,
  allDayAccessor: accessor.isRequired,
  startAccessor: accessor.isRequired,
  endAccessor: accessor.isRequired,
  resourceAccessor: accessor.isRequired,

  resourceIdAccessor: accessor.isRequired,
  resourceTitleAccessor: accessor.isRequired,

  selected: PropTypes.object,
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: PropTypes.number,

  onNavigate: PropTypes.func,
  onSelectEnd: PropTypes.func,
  onSelectStart: PropTypes.func,
  onSelectEvent: PropTypes.func,
  onDoubleClickEvent: PropTypes.func,
  onDrillDown: PropTypes.func,
  getDrilldownView: PropTypes.func.isRequired,

  messages: PropTypes.object,
  components: PropTypes.object.isRequired,

  showTransferEvent: PropTypes.func,
  freeTrainers: PropTypes.object,
  showModalTransferEvent: PropTypes.func,
  setChoosenTrainer: PropTypes.func,
  transferTraining: PropTypes.func,
  onCancelTraining: PropTypes.func,
  trainerTraining: PropTypes.object,
}

 

TimeGrid.defaultProps = {
  events: [],
  step: 30,
  min: dates.startOf(new Date(), 'day'),
  max: dates.endOf(new Date(), 'day'),
  scrollToTime: dates.startOf(new Date(), 'day'),
  /* these 2 are needed to satisfy requirements from TimeColumn required props
   * There is a strange bug in React, using ...TimeColumn.defaultProps causes weird crashes
   */
  type: 'gutter',
  now: new Date(),
}

export default TimeGrid;