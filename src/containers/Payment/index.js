import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPayment from "../../components/CoachPayment";
import StudentPayment from "../../components/StudentPayment";

import {Redirect} from 'react-router-dom'
import TrialTrainModal from './../../components/TrialTrainModal/index';
import moment from 'moment'


class Payment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visibleTrialModal: false,
            redirectToSchedule: false,
            countTraining: 0
        }
    }

    componentDidMount() {

        this.props.onGetDeadlinePay(this.props.id);	
    }
    onSendDataModal = (data) => {

        let array = [];
        let weekdays = []; // post
        const time0 = moment(Date.now()).startOf('week').format('X');
        const time1 = moment(Date.now()).endOf('week').format('X');
        const codeDisc = this.props.disciplines[data.type].code;

        for(let i = 0; i < 7; i++){
                if(data.selectedDays.hasOwnProperty(i)){
                    weekdays.push(i+1)
                }                 
        }

        this.props.onGetAvailableInterval(time0 ,time1, weekdays, [codeDisc]);
        this.props.onSetFreeIntervals(array,  data.type);

        this.setState({visibleTrialModal: true, redirectToSchedule: true});
    }

    showTrialModal = (count) => {
        this.setState({visibleTrialModal: true, countTraining: count})
        this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: count});
    }
    hideTrialModal = () => {
        this.setState({visibleTrialModal: false})
    }

    render() {
        let {deadlinePay} = this.props;
        let isStudent = this.props.auth.mode === "student";

        return (
            <Hoc>
                {isStudent ? (
                    <StudentPayment
                        showTrialModal = {this.showTrialModal}
                        deadlinePay = {deadlinePay}
                    />)
                    : (<CoachPayment/>)}

                <TrialTrainModal
                    title='Запишись на тренировку'
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
        id: state.auth.id,
        deadlinePay: state.student.deadlinePay,
        disciplines: state.abonement.disciplines,

    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),
        onGetDeadlinePay: (idStudent) => dispatch(actions.getDeadlinePay(idStudent)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline) => dispatch(actions.getAvailableInterval(dateStart, dateEnd, weekdays, discipline)),
        
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
/*

export default Payment;*/
