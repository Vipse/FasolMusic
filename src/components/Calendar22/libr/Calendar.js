import PropTypes from 'prop-types'
import React from 'react'
import uncontrollable from 'uncontrollable'
import cn from 'classnames'
import {
  accessor,
  elementType,
  dateFormat,
  dateRangeFormat,
  views as componentViews,
} from './utils/propTypes'

import { notify } from './utils/helpers'
import { navigate, views } from './utils/constants'
import defaultFormats from './formats'
import message from './utils/messages'
import moveDate from './utils/move'
import VIEWS from './Views'
import Toolbar from './Toolbar'
import EventWrapper from './EventWrapper'
import BackgroundWrapper from './BackgroundWrapper'

import omit from 'lodash/omit'
import defaults from 'lodash/defaults'
import transform from 'lodash/transform'
import PatientPage from "../../../containers/MainPage/PatientPage";

function viewNames(_views) {
  return !Array.isArray(_views) ? Object.keys(_views) : _views
}

function isValidView(view, { views: _views }) {
  let names = viewNames(_views)
  return names.indexOf(view) !== -1
}

let now = new Date()

class Calendar extends React.Component {
  static propTypes = {
    elementProps: PropTypes.object,

    date: PropTypes.instanceOf(Date),

    view: PropTypes.string,
    events: PropTypes.arrayOf(PropTypes.object),
    titleAccessor: accessor,
    allDayAccessor: accessor,
    startAccessor: accessor,
    endAccessor: accessor,
    resourceAccessor: accessor,
    resources: PropTypes.arrayOf(PropTypes.object),
    resourceIdAccessor: accessor,
    resourceTitleAccessor: accessor,
    onNavigate: PropTypes.func,
    onView: PropTypes.func,
    onDrillDown: PropTypes.func,
    onSelectSlot: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    onSelecting: PropTypes.func,
    selected: PropTypes.object,
    views: componentViews,
    drilldownView: PropTypes.string,
    getDrilldownView: PropTypes.func,
    length: PropTypes.number,
    toolbar: PropTypes.bool,
    popup: PropTypes.bool,
    popupOffset: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    ]),
    selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
    resizable: PropTypes.bool,
    longPressThreshold: PropTypes.number,
    step: PropTypes.number,
    timeslots: PropTypes.number,
    rtl: PropTypes.bool,
    eventPropGetter: PropTypes.func,
    slotPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    showMultiDayTimes: PropTypes.bool,
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    scrollToTime: PropTypes.instanceOf(Date),
    culture: PropTypes.string,
    formats: PropTypes.shape({
      dayFormat: dateFormat,
      weekdayFormat: dateFormat,
      timeGutterFormat: dateFormat,
      monthHeaderFormat: dateFormat,
      dayRangeHeaderFormat: dateRangeFormat,
      dayHeaderFormat: dateFormat,
      agendaHeaderFormat: dateRangeFormat,
      selectRangeFormat: dateRangeFormat,
      agendaDateFormat: dateFormat,
      agendaTimeFormat: dateFormat,
      agendaTimeRangeFormat: dateRangeFormat,
      eventTimeRangeFormat: dateRangeFormat,
      eventTimeRangeStartFormat: dateFormat,
      eventTimeRangeEndFormat: dateFormat,
    }),
  components: PropTypes.shape({
      event: elementType,
      eventWrapper: elementType,
      dayWrapper: elementType,
      dateCellWrapper: elementType,

      toolbar: elementType,

      agenda: PropTypes.shape({
        date: elementType,
        time: elementType,
        event: elementType,
      }),

      day: PropTypes.shape({
        header: elementType,
        event: elementType,
      }),
      week: PropTypes.shape({
        header: elementType,
        event: elementType,
      }),
      month: PropTypes.shape({
        header: elementType,
        dateHeader: elementType,
        event: elementType,
      }),
    }),

    /**
     * String messages used throughout the component, override to provide localizations
     */
    messages: PropTypes.shape({
      allDay: PropTypes.node,
      previous: PropTypes.node,
      next: PropTypes.node,
      today: PropTypes.node,
      month: PropTypes.node,
      week: PropTypes.node,
      day: PropTypes.node,
      agenda: PropTypes.node,
      date: PropTypes.node,
      time: PropTypes.node,
      event: PropTypes.node,
      showMore: PropTypes.func,
    }),
  }

  static defaultProps = {
    elementProps: {},
    popup: false,
    toolbar: true,
    view: views.WEEK,
    views: [views.MONTH, views.WEEK, views.DAY],
    date: now,
    step: 30,
    length: 30,

    drilldownView: views.DAY,

    titleAccessor: 'title',
    allDayAccessor: 'allDay',
    startAccessor: 'start',
    endAccessor: 'end',
    resourceAccessor: 'resourceId',

    resourceIdAccessor: 'id',
    resourceTitleAccessor: 'title',

    longPressThreshold: 250,
  }

  getViews = () => {
    const views = this.props.views


    if (Array.isArray(views)) {
      return transform(views, (obj, name) => (obj[name] = VIEWS[name]), {})
    }

    return VIEWS
  }

  getView = () => {
    const views = this.getViews()
    return views[this.props.view]
  }

  getDrilldownView = date => {
    const { view, drilldownView, getDrilldownView } = this.props

    if (!getDrilldownView) return drilldownView

    return getDrilldownView(date, view, Object.keys(this.getViews()))
  }

  render() {
    let {
        view,
        toolbar,
        events,
        culture,
        components = {},
        formats = {},
        messages = {},
        style,
        className,
        elementProps,
        date: current,
        length,
        receptionNum,
      ...props
    } = this.props

    formats = defaultFormats(formats)
    messages = message(messages)

    let View = this.getView()
    let names = viewNames(this.props.views)

    let viewComponents = defaults(
      components[view] || {},
      omit(components, names),
      {
        eventWrapper: EventWrapper,
        dayWrapper: BackgroundWrapper,
        dateCellWrapper: BackgroundWrapper,
      }
    )

    const label = View.title(current, { formats, culture, length })

    return (
      <div
        {...elementProps}
        className={cn('rbc-calendar', className, {
          'rbc-rtl': props.rtl,
        })}
        style={style}
      >
        {toolbar && (
          <Toolbar
            date={current}
            view={view}
            views={names}
            label={label}
            onViewChange={this.handleViewChange}
            onNavigate={this.handleNavigate}
            messages={messages}
            receptionNum={receptionNum}
            editor={this.props.editor}
            isUser = {this.props.isUser}
          />
        )}
        <View
          ref="view"
          {...props}
          {...formats}
          messages={messages}
          culture={culture}
          formats={undefined}
          events={events}
          date={current}
          length={length}
          components={viewComponents}
          getDrilldownView={this.getDrilldownView}
          onNavigate={this.handleNavigate}
          onDrillDown={this.handleDrillDown}
          onSelectEvent={this.handleSelectEvent}
          onDoubleClickEvent={this.handleDoubleClickEvent}
          onSelectSlot={this.handleSelectSlot}
          onShowMore={this._showMore}
          cancelAppByPatient = {this.props.cancelAppByPatient}

        />
      </div>
    )
  }

  handleNavigate = (action, newDate, isOnDay) => {
    let { view, date, onNavigate, ...props } = this.props
    let ViewComponent = this.getView()

    date = moveDate(ViewComponent, {
      ...props,
      action,
      date: newDate || date,
    })

    onNavigate(date, view, action, isOnDay)
  }

  handleViewChange = (view, date) => {
    if (view !== this.props.view && isValidView(view, this.props)) {
      this.props.onView(view, date)
    }
  }

  handleSelectEvent = (...args) => {
    notify(this.props.onSelectEvent, args)
  }

  handleDoubleClickEvent = (...args) => {
    notify(this.props.onDoubleClickEvent, args)
  }

  handleSelectSlot = slotInfo => {
      let flag = this.props.intervals.some(el => {
          return (slotInfo.start >= el.start*1000) && slotInfo.start < (el.end * 1000)
      });
      flag && notify(this.props.onSelectSlot, slotInfo)
  }

  handleDrillDown = (date, view) => {

      const { onDrillDown } = this.props
    if (onDrillDown) {
      onDrillDown(date, view, this.drilldownView)
      return
    }
    if (view) this.handleViewChange(view, date)
    this.handleNavigate(navigate.DATE, date, true)
  }
}

export default uncontrollable(Calendar, {
  view: 'onView',
  date: 'onNavigate',
  selected: 'onSelectEvent',
})
