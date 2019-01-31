import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPayment from "../../components/CoachPayment";
import StudentPayment from "../../components/StudentPayment";

import {Redirect} from 'react-router-dom'
import TrialTrainModal from './../../components/TrialTrainModal/index';
import moment from 'moment'

import Modal from './../../components/Modal/index';
import Button from "../../components/Button";


class Payment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visibleTrialModal: false,
            redirectToSchedule: false,
            countTraining: 0,
            payModal: false,
        }
    }

    componentDidMount() {

        this.props.onGetDeadlinePay(this.props.id);	
    }
    onSendDataModal = (data) => {
        const {disciplines} = this.props;
        let array = [];
        let weekdays = []; // post
        let currDiscipline = null;
        const time0 = moment(Date.now()).startOf('week').format('X');
        const time1 = moment(Date.now()).endOf('week').format('X');
        const codeDisc = disciplines[data.type].code;

        for(let i = 0; i < 7; i++){
                if(data.selectedDays.hasOwnProperty(i)){
                    weekdays.push(i+1)
                }                 
        }
        
        this.props.onChangeCurrDiscipline(disciplines[data.type]);
        this.props.onSetFreeIntervals(array,  data.type);


        this.props.onGetAvailableInterval(time0 ,time1, weekdays, [codeDisc]);
        // if(this.props.mainUser){
        //     this.props.onGetTheMasterInterval(time0, time1, this.props.mainUser, [1,2,3,4,5,6,7])
            
        // }
        // else{
        //     const {chooseWeekdays} = this.props;
        //     const dateStart = Math.floor( + start.getTime() / 1000);
        //     const dateEnd   = Math.floor( + end.getTime() / 1000);

        //     this.props.onGetTheMasterInterval(dateStart, dateEnd, this.props.mainUser, chooseWeekdays);

        // }
        

        this.setState({visibleTrialModal: true, redirectToSchedule: true});
    }

    showTrialModal = (count) => {
        
         const newFrozen = +this.props.frozenTraining + (+count);
         let profile = {...this.props.profileStudent};
         profile.frozenTraining = newFrozen;
         this.props.onSaveUserEdit(profile);

        this.setState({visibleTrialModal: true, countTraining: count})
        this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: count});
    }
    hideTrialModal = () => {
        this.setState({visibleTrialModal: false})
    }

    render() {
        let {deadlinePay, disciplinesList} = this.props;
        let isStudent = this.props.auth.mode === "student";

        return (
            <Hoc>
                {isStudent ? (
                    <StudentPayment
                        showTrialModal = {(count) => this.setState({payModal: true, countPay: count})}
                        deadlinePay = {deadlinePay}
                        frozenTraining = {this.props.frozenTraining}
                        nextTrainingTime={this.props.nextTrainingTime}
                    />)
                    : (<CoachPayment/>)}

                <TrialTrainModal
                    title='Запишись на тренировку'
                    width={770}
                    visible={this.state.visibleTrialModal}
                    disciplinesList={disciplinesList}
                    onCancel={this.hideTrialModal} 
                    onSave={this.onSendDataModal}
                />

                <Modal 
                    title='Сообщение'
                    visible={this.state.payModal}
                    onCancel={() => this.setState({payModal : false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                >
                        <div className="schedule-message-modal"> 
                                <div className="schedule-message-btn"> 
                                    <Button btnText='Вернуть подтверждение об оплате'    
                                        onClick= {() => this.showTrialModal(this.state.countPay)}
                                        type='yellow'/>
                                </div>

                               
                                <div className="schedule-message-btn"> 
                                    <Button btnText='Вернуть ошибку об оплате'    
                                    onClick= {() => this.setState({payModal : false})}
                                    type='yellow'/>
                                </div>
                        </div>
                </Modal>

                { this.state.redirectToSchedule ? <Redirect to="/app/schedule"/> : null }
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        profileDoctor: state.profileDoctor,
        profileStudent: state.profilePatient,
        frozenTraining: (state.profilePatient) ? state.profilePatient.frozenTraining : 0,
        mainUser: (state.profilePatient) ? state.profilePatient.mainUser : null,
        auth: state.auth,
        id: state.auth.id,
        deadlinePay: state.student.deadlinePay,
        disciplinesList: state.abonement.disciplines,
        nextTrainingTime: state.training.nextTrainingTime,
        amountTraining: state.profilePatient.amountTraining,

    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),
        onGetDeadlinePay: (idStudent) => dispatch(actions.getDeadlinePay(idStudent)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline) => dispatch(actions.getAvailableInterval(dateStart, dateEnd, weekdays, discipline)),
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data)),
        onGetTheMasterInterval: (dateStart, dateEnd, idMaster, weekdays) => dispatch(actions.getTheMasterInterval(dateStart, dateEnd, idMaster, weekdays)), 
        
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
/*

export default Payment;*/
