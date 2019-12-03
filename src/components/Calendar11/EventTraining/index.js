import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import * as actions from '../../../store/actions'

import './styles.css'
import history from '../../../store/history';
import moment from 'moment'
import { message } from 'antd';

class EventTraining extends React.Component{

    getBgColor = () => {
        const {event, clickedIdEvent} = this.props;
        let 
        backgroundColor = event.status ? 'rgba(33, 190, 221, 0.2)' : '#eee'; // прошло ли время тренировки
        backgroundColor = event.isComplete ? '#fdc401' : backgroundColor; // была ли завершена тренировка    
        backgroundColor = (event.idMaster == 1) ? '#ff7daa' : backgroundColor;  // нету тренера
        backgroundColor = event.isBooking ? '#21bedd' : backgroundColor;  // бронированные тренировки
        backgroundColor = (clickedIdEvent === event.id) ? '#fdedc4' : backgroundColor  //тренировка выбрана для переноса
        
        return backgroundColor;
    }

    getFunctionCross =  () => {
        const { 
            isAdmin,
            event, 
            listNewSchedule,
        
            startDate,
            endDate,
            currDiscipline} = this.props;

        let crossFunc;

        if(event.type === 'clicked_event'){
            crossFunc = (e) => {
                e.stopPropagation();
                
                function isEmptyListNewSchedule(list){
                    if(Object.keys(list).length){
                        return false
                    }
                    return true
                }

                let listNew = {...listNewSchedule};
                delete listNew[event.start];

                this.props.setParamsId({listNewSchedule: listNew})
                
                if(isEmptyListNewSchedule(listNew)){
                    
                    this.props.getAvailableInterval(startDate, endDate, currDiscipline.code, isAdmin)
                    .then(() => {
                        this.props.setParamsId({clickedTrainer: {id: null, name: null}})
                    })
                }
               
            }    
        }
        
        else if(event.trial){
            crossFunc = this.onRemoveTrialTraining
        }  
        else {
            crossFunc = (e) => this.onCancelTraining(e, event.id, event.idSubscription)
        }


        //crossFunc = event.hasOwnProperty('apiPatients') ? () => {} : crossFunc
        return crossFunc
    }

    onRemoveTrialTraining = (e) => {
        const {event} = this.props;
        e.stopPropagation();

        this.props.showRemoveTrialTrainingModal()
        this.props.setParamsId({
            crossCurrentIdTrialTraining: event.id
        })
    }

    onCancelTraining = (e, id, idSubscription) => {
        const {setParamsId, showTransferOrFreezeModal} = this.props;
        e.stopPropagation();

        setParamsId({
            crossCurrentIdTraining: id,
            crossCurrendIdSubscription: idSubscription
        })
        showTransferOrFreezeModal();
    }

    clickOnEvent = (e,idEvent) => {
        e.stopPropagation();
        const {isAdmin, isTrainer, pushBtnTransfer, setParamsId, event} = this.props;

        if(this.isPostEvent()){

        }
        else if(pushBtnTransfer){
            if(event.trial){
                message.info('Пробная тренировка только удаляется')
            }
            else if(isAdmin){
                setParamsId({clickedIdEvent: idEvent})
            }
            else if(event.wasTransfer){
                message.info('Тренировка уже переносилась один раз')
            }
            else{
                setParamsId({clickedIdEvent: idEvent})
            }
        }
        else{
            if(isTrainer){
                history.push('/app/student'+ event.idStudent)
            }
            else{
                history.push('/app/coach'+ event.idMaster)
            }
            
        }
        
    }

    getName = () => {
        const {event, isTrainer} = this.props;
        const name = event.masterFio ? event.masterFio : event.fio

        if(event.trial){
            return `Пробная: ${name}`
        }
        return name
    }

    isPostEvent = () => {
        const {event} = this.props;

        if(moment(+event.start * 1000) <= moment()){
            return true
        }
        return false
    }

    render() {
        const {event, isTrainer} = this.props;
        const {id} = event;

        const backgroundColor = this.getBgColor()
        const functionCross = this.getFunctionCross()
        

        return (
                <div className='event-group' style={{ backgroundColor }} onClick={e => this.clickOnEvent(e,id)}>
                    <div> 
                        {!isTrainer && !this.isPostEvent() && !event.isComplete && !event.isBooking && 
                            <div className="event-group-cross" onClick={functionCross}>
                                <span className="icon icon-close"></span>
                            </div>
                        }
                        
                        <p className="event-group-text">{this.getName()}</p>
                    </div>
                </div>
        )
    }
}

//crossCurrentIdTraining: null,
//crossCurrendIdSubscription: null


const mapStateToProps = state => {
    const {
        listNewSchedule,
        clickedIdEvent,

        pushBtnTransfer
    } = state.scheduleIdParams;

    return {
        isAdmin: state.auth.mode === "admin",
        isTrainer: state.auth.mode === "master",
        currDiscipline: state.abonement.currDiscipline,

        startDate: state.training.startDate,
        endDate: state.training.endDate,

        listNewSchedule,
        clickedIdEvent,

        pushBtnTransfer

    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAvailableInterval: (start, end, discipline, isAdmin)=>dispatch(actions.getAvailableInterval(start, end,discipline,isAdmin)),

        showTransferOrFreezeModal: () => dispatch(actions.showTransferOrFreezeModal()),
        showRemoveTrialTrainingModal: () => dispatch(actions.showRemoveTrialTrainingModal()),
        
        setParamsId: (params) => dispatch(actions.setParamsId(params)),
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(EventTraining);
