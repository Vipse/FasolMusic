import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import uncontrollable from 'uncontrollable'
import cn from 'classnames'
import Toolbar from './header/Toolbar'
import Spinner from "../../Spinner";


import Button from './../../Button/index';
import CancelVisitModal from './../../CancelVisitModal/index';
import Week from './Week';
import FreeTrainers from './../../FreeTrainers/index';
import DateColumn from './../../Calendar11/DateColumn/index';
import EventColumn from './../../Calendar11/EventColumn/index';

let now = new Date()

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isWorkTime: false,   
        
    }
    this.now = (new Date).getTime()
  }

  componentWillReceiveProps(nextProps) {
    const {studentSchedule, intervals} = this.props;

    if (studentSchedule == nextProps.studentSchedule && 
      intervals == nextProps.intervals){

      return false // проверить!
    }
    return true
      
  }

  getIntervalForColumn = (startTime) => {
    const {intervals} = this.props;
    const amountDay = startTime.day();
  
    if (intervals && intervals.hasOwnProperty(amountDay)){
      return {...intervals[amountDay]}
    }
  }

  rendertEventColumn = () => {

    const { min, max, studentSchedule, intervals, currDiscipline, isAdmin, clickOnEvent} = this.props;

    let arrRender = [];
    const endOf = moment().endOf('week');
    let startOf = moment().startOf('week');
    let startTime = moment(+min);
    let endTime = moment(+max);
    
    while (startOf.isBefore(endOf)) {
        arrRender.push(
            <EventColumn
                key={startOf.format('X')}
                timeDay={startOf.format('X')}
                studentSchedule={studentSchedule}
                startTime={startTime.format('X')}
                endTime={endTime.format('X')} 
                intervals={intervals}//{this.getIntervalForColumn(startTime)}
                isAdmin={isAdmin}
                currDiscipline={currDiscipline}
                clickOnEvent={clickOnEvent}

                //admin
                masterList={this.props.masterList}

                //func
                deleteTraining={this.props.deleteTraining}
                onCancelTraining={this.props.onCancelTraining}
                deleteEventApiPatient={this.props.deleteEventApiPatient}

              />)

        startOf.add(1, 'day')

        startTime.add(1, 'day')
        endTime.add(1, 'day')
    }

    return arrRender;
  }

  changeWorkTime = () => {
    this.setState({isWorkTime: true});
  }

  render() {
    let {
      min,
      max,
      currentDate,


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

  

    const label = 'calendar label'
    return (
      <div className="wrapper-calendar">    

        {this.props.scheduleSpinner && 
            <div className = "schedule-spinner">
              <Spinner isInline={true} size='large'/>
            </div>}

        <div
          className={'rbc-calendar'}
        >
          <div className='rbc-calendar-eventwrapper'>    
              <Toolbar
                min={min}
                max={max}
                mode = {this.props.mode}
                currentDate={currentDate}
                isAdmin={this.props.isAdmin}

                //func
                dateChange={this.props.dateChange}
                

              
              
              
              //
                label={label}
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

              <div className="rbc-calendar-eventwrapper-cells">
                <DateColumn
                  min={min}
                  max={max} />

              
                {this.rendertEventColumn()}

              </div>
            
            {/* <Week
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
              onNavigate={this.handleNavigate}
              onDrillDown={this.handleDrillDown}
              onSelectEvent={this.handleSelectEvent} 
            /> */}

          </div>
          <div className='rbc-smallcalendar-eventwrapper'>     
            { this.props.isShowFreeTrainers ?
              <FreeTrainers 
                  freeTrainers={freeTrainers} 
                  setChoosenTrainer={setChoosenTrainer}
                  selectAnyTrainer = {this.props.selectAnyTrainer}
                  onGotoPage = {this.props.onGotoPage}
                  isSpinnerFreeTrainers = {this.props.isSpinnerFreeTrainers}
              /> 
              :
              <div className="table-footer wrapper-small-calendar">
                <div className="type">
                    <div className='type-color-available'/>
                    <div className='type-name'>Свободно</div>
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
                <div className="type">
                  <div className='type-color-bron' />
                  <div className='type-name'>Забронированная тренировка</div>
                </div>

                
            
              </div>  
            }
              
            <CancelVisitModal visible={this.state.isWorkTime}
                              onCancel={() => this.setState({isWorkTime: false})}
                />
          </div>  
        </div>      
      </div>
    )
  }


}

Calendar.propTypes = {
  elementProps: PropTypes.object,

  date: PropTypes.instanceOf(Date),

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
  longPressThreshold: 250,
}

export default uncontrollable(Calendar, {
  view: 'onView',
  date: 'onNavigate',
  selected: 'onSelectEvent',
})
