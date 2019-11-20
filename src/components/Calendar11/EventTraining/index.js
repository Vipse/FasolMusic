import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import * as actions from '../../../store/actions'

import './styles.css'

class EventTraining extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            eventWillTransfer: false
        }
    };


     componentDidUpdate(prevProps, prevState) {
         console.log("componentDidUpdate");
           
    }


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
        const { event } = this.props;

        let crossFunc;
        if(event.trial){
            crossFunc = this.onRemoveTrialTraining
        }  
        else {
            crossFunc = (e) => this.onCancelTraining(e, event.id, event.idSubscription)
        }


        crossFunc = event.hasOwnProperty('apiPatients') ? (e) => this.deleteEventApiPatients(e, event.id) : crossFunc
        return crossFunc
    }

    onRemoveTrialTraining = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.deleteTraining(this.props.event.id);
    }

    onCancelTraining = (e, id, idSubscription) => {
        const {setParamsId, showTransferOrFreezeModal} = this.props;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        setParamsId({
            crossCurrentIdTraining: id,
            crossCurrendIdSubscription: idSubscription
        })
        showTransferOrFreezeModal();
    }

    deleteEventApiPatients = (e, id) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.deleteEventApiPatient(id)
    }

    clickOnEvent = (idEvent) => {
        const {isPushBtnTransfer, setParamsId} = this.props;

        if(isPushBtnTransfer){
            setParamsId({clickedIdEvent: idEvent})
        }
        
    }

    render() {
        const {event} = this.props;
        const {id} = event;

        const backgroundColor = this.getBgColor()
        const functionCross = this.getFunctionCross()
        

        return (
                <div className='event-group' style={{ backgroundColor }} onClick={() => this.clickOnEvent(id)}>
                    <div> 
                        <div className="event-group-cross" onClick={functionCross}>
                            {!event.isComplete && <span className="icon icon-close"></span>}
                        </div>
                        <p className="event-group-text">{event.masterFio}</p>
                    </div>
                </div>
        )
    }
}

//crossCurrentIdTraining: null,
//crossCurrendIdSubscription: null


const mapStateToProps = state => {
    return {
        clickedIdEvent: state.scheduleIdParams.clickedIdEvent,

        isPushBtnTransfer: state.student.isPushBtnTransfer,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showTransferOrFreezeModal: () => dispatch(actions.showTransferOrFreezeModal()),
        setParamsId: (params) => dispatch(actions.setParamsId(params)),
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(EventTraining);
