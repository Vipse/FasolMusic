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
import defaultFormats from './header/formats'
import message from './utils/messages'
import moveDate from './utils/move'
import Toolbar from './header/Toolbar'
import BackgroundWrapper from './BackgroundWrapper'

import omit from 'lodash/omit'
import defaults from 'lodash/defaults'
import SmallCalendar from './../../SmallCalendar/index';
import Spinner from "../../Spinner";

import Button from './../../Button/index';
import CancelVisitModal from './../../CancelVisitModal/index';
import Week from './Week';
import FreeTrainers from './../../FreeTrainers/index';

function viewNames(_views) {
  return !Array.isArray(_views) ? Object.keys(_views) : _views
}

function isValidView(view, { views: _views }) {
  let names = viewNames(_views)
  return names.indexOf(view) !== -1
}

let now = new Date()

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isWorkTime: false,   
    }
  }
  
  getDrilldownView = date => {
    const { view, drilldownView, getDrilldownView } = this.props

    if (!getDrilldownView) return drilldownView
        return getDrilldownView(date, view, ['week'])
  }

  changeWorkTime = () => {
    this.setState({isWorkTime: true});
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
        onChange,
        highlightedDates,
        isNeedSaveIntervals,
        fillTrainingWeek,
        freeTrainers,
        setChoosenTrainer,
        isShowFreeTrainers,
      ...props
    } = this.props

    formats = defaultFormats(formats)
    messages = message(messages)

    let names = ['week'];
    
    let viewComponents = defaults(
      components[view] || {},
      omit(components, names),
      {
        dayWrapper: BackgroundWrapper,
        dateCellWrapper: BackgroundWrapper,
      }
    )

    const label = Week.title(current, { formats, culture, length })

    return (
      <div className="wrapper-calendar">    

        {this.props.scheduleSpinner && 
            <div className = "schedule-spinner">
              <Spinner isInline={true} size='large'/>
            </div>}

        <div
          {...elementProps}
          className={cn('rbc-calendar', className, {
            'rbc-rtl': props.rtl,
          })}
          style={style}
        >
          <div className='rbc-calendar-wrapper'>      
            {toolbar && (
              <Toolbar
                date={current}
                view={view}
                views={names}
                label={label}
                onNavigate={this.handleNavigate}
                messages={messages}
                receptionNum={receptionNum}
                isUser = {this.props.isUser}
                isNeedSaveIntervals = {isNeedSaveIntervals}
                fillTrainingWeek = {fillTrainingWeek}
                selectDisciplines = {this.props.selectDisciplines}
                currDiscipline = {this.props.currDiscipline}
                onChangeCurrDiscipline = {this.props.onChangeCurrDiscipline}
                notRedirectDiscipline = {this.props.notRedirectDiscipline}
                countTrainingDiscipline = {this.props.countTrainingDiscipline}
              />
            )}
            <Week
              ref="view"
              {...props}
              {...formats}
              messages={messages}
              culture={culture}

              masterList={this.props.masterList}
              isAdmin = {this.props.isAdmin}

              events={events}
              date={current}
              length={length}
              components={viewComponents}
              getDrilldownView={this.getDrilldownView} // для навигации по  header в timegrid
              onNavigate={this.handleNavigate}
              onDrillDown={this.handleDrillDown}
              onSelectEvent={this.handleSelectEvent} 
            />

          </div>
          <div className='rbc-smallcalendar-wrapper'>
          
         
            
            { this.props.isShowFreeTrainers ?
              <FreeTrainers 
                  freeTrainers={freeTrainers} 
                  setChoosenTrainer={setChoosenTrainer}
                  selectAnyTrainer = {this.props.selectAnyTrainer}
                  onGotoPage = {this.props.onGotoPage}
              /> 
              :
              <div className="wrapper-small-calendar">
              
                <SmallCalendar 
                    date={current}
                    onChange={onChange}
                    isUser = {this.props.isUser}
                    highlightedDates = {highlightedDates}
                />
              </div>
              
            }
              
            <div className="table-footer">
                <div className="type">
                    <div className='type-color-available'/>
                    <div className='type-name'>Свободно</div>
                </div>
                <div className="type">
                    <div className='type-color-bron'/>
                    <div className='type-name'>Забронированная тренировка</div>
                </div> 
                <div className="type">
                    <div className='type-color-own'/>
                    <div className='type-name'>Ваша тренировка</div>
                </div>
                <div className="type">
                    <div className='type-color-done'/>
                    <div className='type-name'>Проведенная тренировка</div>
                </div>
                <div className="type">
                    <div className='type-color-error'/>
                    <div className='type-name'>Перенеси тренировку</div>
                </div>
            
            </div>


            <CancelVisitModal visible={this.state.isWorkTime}
                              onCancel={() => this.setState({isWorkTime: false})}
                />
          </div> 

          
        </div>
       
      </div>
    )
  }

  handleNavigate = (action, newDate, isOnDay) => { 
    let { view, date, onNavigate, ...props } = this.props
    let ViewComponent = Week;

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


  handleDrillDown = (date, view) => {
    const { onDrillDown } = this.props;
    
    if (onDrillDown) {
      onDrillDown(date, view, this.drilldownView)
      return
    }
    if (view) this.handleViewChange(view, date)
    this.handleNavigate(navigate.DATE, date, true)
  }
}

Calendar.propTypes = {
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

  showTransferEvent: PropTypes.func,
  freeTrainers: PropTypes.object,
  showModalTransferEvent: PropTypes.func,
  setChoosenTrainer: PropTypes.func,
  isNeedSaveIntervals: PropTypes.bool,
  fillTrainingWeek: PropTypes.func,
  isShowFreeTrainers: PropTypes.bool,
  transferTraining: PropTypes.func,
  deleteEvent: PropTypes.func,
  onCancelTraining: PropTypes.func,
  trainerTraining: PropTypes.object,
}

Calendar.defaultProps = {
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

export default uncontrollable(Calendar, {
  view: 'onView',
  date: 'onNavigate',
  selected: 'onSelectEvent',
})
