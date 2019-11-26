import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import uncontrollable from 'uncontrollable'

import Toolbar from './header/Toolbar'
import Spinner from "../../Spinner";

import FreeTrainers from './../../FreeTrainers/index';
import DateColumn from './../../Calendar11/DateColumn/index';
import EventColumn from './../../Calendar11/EventColumn/index';
import AdditionalCalendarInfo from '../../Calendar11/AdditionalCalendarInfo'

let now = new Date()

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.now = (new Date).getTime()
  }

  rendertEventColumn = () => {

    const { min, 
       max, 
       currDiscipline, 
       isAdmin, 
       clickOnEvent
      } = this.props;

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
                startTime={startTime.format('X')}
                endTime={endTime.format('X')}
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

          <div className={'rbc-calendar'}>
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
      

            </div>
            <AdditionalCalendarInfo />
            
              
   
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

export default Calendar
