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
import {Modal as PopupModal, message} from 'antd';


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
      
        if(this.props.mode === 'student'){
            this.props.onGetSubscriptionsByStudentId(this.props.id)
            this.props.onGetDisciplineCommunication(this.props.id);
        }
        this.props.onGetDeadlinePay(this.props.id);	
    }
    onSendDataModal = (data) => {
     
        let array = [];
        const {disciplinesList, discCommunication,subsForDisc, abonementIntervals} = this.props;
        const time0 = moment(Date.now()).startOf('week').format('X');
        const time1 = moment(Date.now()).endOf('week').format('X');
        const codeDisc = disciplinesList[data.type].code;


        this.props.onChangeCurrDiscipline(disciplinesList[data.type]);
        this.props.onSetFreeIntervals(array,  data.type);

       
        if(discCommunication.hasOwnProperty(codeDisc) && subsForDisc.hasOwnProperty(codeDisc) && discCommunication[codeDisc].idMaster){
            
            //
            if(Array.isArray(subsForDisc[codeDisc]) && subsForDisc[codeDisc].length) {
                
                this.props.onAddAmountTraining(subsForDisc[codeDisc][0], abonementIntervals.countTraining)
            }

            message.success('Количество добавленных тренировок '+ abonementIntervals.countTraining);
            //
            //this.props.onSetPushTrialTraining('select_master');
            //this.props.onSetMasterTheDisicipline(discCommunication[codeDisc].idMaster);
            //this.props.onGetTheMasterInterval(time0, time1, discCommunication[codeDisc].idMaster, [0,1,2,3,4,5,6]);         
        }
        else{
            
            this.props.onSetPushTrialTraining(null);
            this.props.onSetMasterTheDisicipline(null);
            this.props.onGetAvailableInterval(time0 ,time1, [0,1,2,3,4,5,6], [codeDisc]);
            this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: abonementIntervals.countTraining});
        }
        
        this.setState({visibleTrialModal: true, redirectToSchedule: true});
    }

    showTrialModal = (count) => {
        PopupModal.info({
            title: 'Отлично! Вот вы уже и Фасолянин!',
            width: '500px',
            className: 'fast-modal',
            content: 'Отлично! Вот вы уже и Фасолянин! Быстренько пробежимся по правилам:\n' +
                'Каждую тренировку можно переносить 1 раз;\n' +
                'Перенос за 24 часа до начала тренировки не возможен, если вы не сможете присутствовать, она считается проведенной;\n' +
                'Заморозка занятий действует 3 месяца. \nВот и все, вперед покорять музыку вместе с Fasol музыкальная качалка',
            zIndex: 1010
        });

        //  const newFrozen = +this.props.frozenTraining + (+count);
        //  let profile = {...this.props.profileStudent};
        //  profile.frozenTraining = newFrozen;
        //  this.props.onSaveUserEdit(profile);

        this.setState({visibleTrialModal: true, countTraining: count});
        this.props.onSetNeedSaveIntervals({visibleTrialModal: false, countTraining: count});
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
                    onCancel={() => this.setState({payModal: false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                >
                    <div className="schedule-message-modal">
                        <div className="schedule-message-btn">
                            <Button btnText='Вернуть подтверждение об оплате'
                                    onClick={() => this.showTrialModal(this.state.countPay)}
                                    type='yellow'/>
                        </div>


                        <div className="schedule-message-btn">
                            <Button btnText='Вернуть ошибку об оплате'
                                    onClick={() => this.setState({payModal: false})}
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
        mode: state.auth.mode,
        deadlinePay: state.student.deadlinePay,
        disciplinesList: state.abonement.disciplines,
        nextTrainingTime: state.training.nextTrainingTime,
        amountTraining: state.profilePatient.amountTraining,
        discCommunication: state.student.discCommunication,
        subsForDisc : state.abonement.subsForDisc,
        abonementIntervals: state.patients.abonementIntervals,

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
        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onSetMasterTheDisicipline: (idMaster) => dispatch(actions.setMasterTheDisicipline(idMaster)),
        onAddAmountTraining: (idSubscription, addAmount) => dispatch(actions.addAmountTraining(idSubscription, addAmount)),
        onGetSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),

        
        
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
/*

export default Payment;*/
