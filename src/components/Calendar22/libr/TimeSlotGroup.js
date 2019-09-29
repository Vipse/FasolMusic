import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'
import TimeSlot from './TimeSlot'
import date from './utils/dates.js'
import localizer from './header/localizer'
import { elementType, dateFormat } from './utils/propTypes'

import EventSlot from './EventSlot';
import { DropTarget } from 'react-dnd';
import MasterListSlot from './MasterListSlot';
import moment from 'moment';


import Modal from '../../Modal/index';
import Button from "../../Button";

const squareTarget = {
  drop(props) {
    props.transferTraining(props.value); // drag and drop 
    console.log('DROP props :', props);
    //moveKnight(props.x, props.y);
  },
  // hover(props, monitor, component) {
  //   // This is fired very often and lets you perform side effects
  //   // in response to the hover. You can't handle enter and leave
  //   // here—if you need them, put monitor.isOver() into collect() so you
  //   // can just use componentDidUpdate() to handle enter/leave.

  // }
};

function collect(connect, monitor){

  return{
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem(),
  }
}


class TimeSlotGroup extends Component {
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
    intervals: [],
    timeslots: 2,
    step: 30,
    isNow: false,
    showLabels: false,
    freeTrainers: null,
  }

   constructor(props) {
        super(props);
        this.state = {
            modalWasTransfer: false,
            modalTooLateTransfer: false,
        }
    };


    showWasTransferModal = () => {
        this.setState({modalWasTransfer: true});
    }

    showTooLateTransferModal = () => {
        this.setState({modalTooLateTransfer: true});
    }


  renderSlice(slotNumber, content, value) {
    const {
      dayWrapperComponent,
      showLabels,
      isNow,
      culture,
      resource,
      slotPropGetter,
      showTransferEvent, //my
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
        showTransferEvent={showTransferEvent}
        
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

  renderEvent = () => {
    let {
      events, 
      showTransferEvent, 
      freeTrainers,
      setChoosenTrainer,
      showLabels,
      handleDrop,
      onCancelTraining,
      trainerTraining,
      mode,
      onGotoPage,
      isPushBtnTransfer,
    } = this.props;

    const valueTime = this.props.value.getTime()
    for( let i = 0; i < events.length; i++){
     
          if(events[i].start.getTime() === valueTime && showLabels) {
            return (
              <EventSlot 
                  key={this.props.value.getTime()}
                  value={this.props.value.getTime()}
                  event={events[i]}
                  showTransferEvent={showTransferEvent} 
                  setChoosenTrainer={this.props.setChoosenTrainer}
                  freeTrainers={freeTrainers}Б
                  idEvent={events[i].start.getTime()}
                  handleDrop={handleDrop}
                  setAbonement_Training = {this.props.setAbonement_Training}
                  onCancelTraining = {onCancelTraining}
                  mode = {mode}
                  onGotoPage = {onGotoPage}
                  isPushBtnTransfer = {isPushBtnTransfer}
                  deleteTraining = {this.props.deleteTraining}
                  deleteEventApiPatient={this.props.deleteEventApiPatient}
                  clickOnEvent={this.props.clickOnEvent}
                  selectIdEvent={this.props.selectIdEvent}
                  showTooLateTransferModal={this.showTooLateTransferModal}
                  showWasTransferModal={this.showTooLateTransferModal}
                 
            />)
          }
    }
    
    if(freeTrainers && freeTrainers.idEvent === this.props.value.getTime() && !showLabels){ // рендер выпадающего списка freeTrainer
        return <EventSlot 
            key={this.props.value.getTime()}
            value={this.props.value.getTime()}
            showTransferEvent={showTransferEvent} 
            freeTrainers={freeTrainers}
            setChoosenTrainer={this.props.setChoosenTrainer}
            idEvent={freeTrainers.idEvent}
            onGotoPage = {onGotoPage}
            deleteEventApiPatient = {this.props.deleteEventApiPatient}
            
        />
    }
   
    return null;
  }


  renderMasterList = () => {
    const {masterList, value, showMasterList} = this.props;
    let freetrainers = [];
    let busytrainers = [];
      
    for(let elem in masterList){
          if(elem === 'freetrainers')  {
            freetrainers = masterList[elem]
          }
          if(elem === 'busytrainers'){
            busytrainers = masterList[elem]
          }
    }

    if(freetrainers.length || busytrainers.length)
      return (
          <MasterListSlot 
              key={value.getTime()}
              freetrainers = {freetrainers}
              busytrainers = {busytrainers}
              value = {value.getTime()}
              showMasterList = {showMasterList}
          />
      )
     
  }

  showModalTransferEvent = (idValue) => {
     this.props.showModalTransferEvent(idValue);
  }


  
  render() {
    //drag and drop
    const { connectDropTarget, hovered, item} = this.props;
    const backgroundColor= hovered ? '#e8f8fc ' : 'white';

    const {intervals, value, freeTrainers, isAdmin} = this.props;
    let valuetM = value.getTime();

    const flag = Array.isArray(intervals) ? intervals.some(el => {
          
        if(Array.isArray(el.intervals)){    
              for(let i = 0; i < el.intervals.length; i++){
                if(value.getTime() >= el.intervals[i].start*1000 && value.getTime() < el.intervals[i].end * 1000)
                    return true
              }
        } 
        else{
          
          if((valuetM >= el.start*1000) && valuetM < (el.end * 1000)) return true
        }
         
    }) : null

   
    const isViewTrainer = (freeTrainers && freeTrainers.idEvent === this.props.value.getTime()) ? true : false;//не OK если таместь freeTrainers
    const currentEvent = this.renderEvent();



    let cellClass = cn('rbc-timeslot-group', flag && !isViewTrainer && !currentEvent ? 'rbc-timeslot-group-OK' : 'rbc-timeslot-group-NOT');
    const modalTransferEvent = flag && !isViewTrainer && !currentEvent ? this.showModalTransferEvent : () => {}; // перенос тренировки
    

    
    if(isAdmin) {
      return (
        <div className={cellClass} style={{backgroundColor}} onClick={(e) => modalTransferEvent(value.getTime())}>
          {this.renderSlices()}
          {this.renderMasterList()}
        </div>
      )
    }

    if(flag && !isViewTrainer && !currentEvent){
      return connectDropTarget(
        <div className={cellClass} style={{backgroundColor}} onClick={(e) => modalTransferEvent(value.getTime())}>
           {this.renderSlices()}
           {currentEvent}
         </div>
      )
    }

    return (
      <div className={cellClass} style={{backgroundColor}} onClick={(e) => modalTransferEvent(value.getTime())}>
           {this.renderSlices()}
           {currentEvent}
           

           <Modal
                    title='Сообщение'
                    visible={this.state.modalTooLateTransfer}
                    onCancel={() => this.setState({modalTooLateTransfer : false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                    >
                        <div className="schedule-message-modal-text">
                               Переносить тренировку можно только за 24 часа до тренировки
                        </div>
                        <div className="schedule-message-modal">
                                <div className="schedule-message-btn">
                                    <Button btnText='Ок'
                                        onClick= {() => {
                                            this.setState({modalTooLateTransfer: false});
                                        }}
                                        type='yellow'/>
                                </div>
                        </div>
                    </Modal>

                    <Modal
                    title='Сообщение'
                    visible={this.state.modalWasTransfer}
                    onCancel={() => this.setState({modalWasTransfer : false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                    >
                        <div className="schedule-message-modal-text">
                               Одну тренировку можно переносить лишь один раз
                        </div>
                        <div className="schedule-message-modal">
                                <div className="schedule-message-btn">
                                    <Button btnText='Ок'
                                        onClick= {() => {
                                            this.setState({modalWasTransfer: false});
                                        }}
                                        type='yellow'/>
                                </div>
                        </div>
                    </Modal>           
      </div>
    )
  
  }
}


export default DropTarget('event-group', squareTarget, collect)(TimeSlotGroup);