import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPayment from "../../components/CoachPayment";
import StudentPayment from "../../components/StudentPayment";

import {Redirect} from 'react-router-dom'
import TrialTrainModal from './../../components/TrialTrainModal/index';

class Payment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visibleTrialModal: false,
            redirectToSchedule: false,
            countTraining: 0
        }
    }

    onSendDataModal = (data) => {
        console.log('data :', data);
        let array = [];
        for(let i = 0; i < 7; i++){

                if(data.selectedDays.hasOwnProperty(i)){
                    array.push(
                        {
                            day: i, 
                            intervals : [{
                                start: +data.time[0].weekday(i+1).format('X'),
                                end: +data.time[1].weekday(i+1).format('X')
                            }]
                        }
                    )   
                    //console.log("7", data.time[0].day(7));
                } 
                else{
                    array.push(
                        {
                            day: i, 
                            intervals : []
                        }
                    );   
                }
                   
        }

        this.setState({visibleTrialModal: true, redirectToSchedule: true});
        this.props.onSetFreeIntervals(array, this.state.countTraining, data.type);
        //this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: 0});
    }
    showTrialModal = (count) => {
        console.log('showTrialModal :', count);
        this.setState({visibleTrialModal: true, countTraining: count})
        this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: count});
    }
    hideTrialModal = () => {
        this.setState({visibleTrialModal: false})
    }

    render() {
        let isUser = this.props.auth.mode === "student";

        // убрать
        isUser = true;

        return (
            <Hoc>
                {isUser ? (
                    <StudentPayment
                        showTrialModal = {this.showTrialModal}
                    />)
                    : (<CoachPayment/>)}

                <TrialTrainModal  
                    title='Запишись на пробную тренировку'
                    width={770}
                    visible={this.state.visibleTrialModal}
                    onCancel={this.hideTrialModal} 
                    onSave={this.onSendDataModal}
                />

                { this.state.redirectToSchedule ? <Redirect to="/app/schedule"/> : null }
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        profileDoctor: state.profileDoctor,
        profilePatient: state.profilePatient,
        auth: state.auth,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetFreeIntervals: (freeIntervals) => dispatch(actions.setFreeIntervals(freeIntervals)),
        onSetNeedSaveIntervals: (count) => dispatch(actions.setNeedSaveIntervals(count)),

        
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
/*

export default Payment;*/
