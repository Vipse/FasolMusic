import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPayment from "../../components/CoachPayment";
import StudentPayment from "../../components/StudentPayment";

import {Redirect} from 'react-router-dom'
import CreateTrainModal from './../../components/CreateTrainModal/index';
import moment from 'moment'

import Modal from './../../components/Modal/index';
import Button from "../../components/Button";
import {Modal as PopupModal, message} from 'antd';


class Payment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visibleCreateTrainModal: false,
            redirectToSchedule: false,
            countTraining: 0,
            payModal: false,
            amount: null,
            price: null,
        }
    }

    componentDidMount() {
      
        if(this.props.mode === 'student'){
            this.props.onGetDisciplineCommunication(this.props.id);
        }
        this.props.onGetDeadlinePay(this.props.id);	
    }
    onSendDataModal = (data) => {
     
        let array = [];
        const {disciplinesList, discCommunication,subsForDisc, abonementIntervals, id} = this.props;
        const time0 = moment(Date.now()).startOf('week').format('X');
        const time1 = moment(Date.now()).endOf('week').format('X');
        const codeDisc = disciplinesList[data.type].code;


        this.props.onChangeCurrDiscipline(disciplinesList[data.type]);
        this.props.onSetFreeIntervals(array,  data.type);

       
        if(discCommunication.hasOwnProperty(codeDisc) && subsForDisc.hasOwnProperty(codeDisc) && discCommunication[codeDisc].idMaster){
                  
                this.props.onAddAmountTraining(subsForDisc[codeDisc], abonementIntervals.countTraining)

                message.success('Количество добавленных тренировок '+ abonementIntervals.countTraining);    
        }
        else{
            
                this.props.onSetPushTrialTraining(null);
                this.props.onSetMasterTheDisicipline(null);
                this.props.onGetAvailableInterval(time0 ,time1, [0,1,2,3,4,5,6], [codeDisc]);
                this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: abonementIntervals.countTraining});
        }
        
        this.props.onGetToken(id, this.state.amount, this.state.price, codeDisc)
        setTimeout( () => this.props.onGetStudentBalance(id), 1500);
      
        //this.setState({visibleCreateTrainModal: true, redirectToSchedule: true});
    }



    showTrialModal = (amount, price) => {

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

        this.setState({payModal: true, amount, price})
        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: amount});

    }
    hideTrialModal = () => {
        this.setState({payModal: false})
    }

    render() {
        let {deadlinePay, disciplinesList} = this.props;
        let isStudent = this.props.auth.mode === "student";

        return (
            <Hoc>
                {isStudent ? (
                    <StudentPayment
                        showTrialModal = {this.showTrialModal}
                        deadlinePay = {deadlinePay}
                        studentBalance = {this.props.studentBalance}
                        nextTrainingTime={this.props.nextTrainingTime}
                        onSubmitPaySubscription = {this.onSubmitPaySubscription}
                    />)
                    : (<CoachPayment/>)}

                <CreateTrainModal
                    title='Запишись на тренировку'
                    width={770}
                    visible={this.state.payModal}
                    disciplinesList={disciplinesList}
                    onCancel={this.hideTrialModal} 
                    onSave={this.onSendDataModal}
                />


               { /*<Modal 

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

               </Modal> */ }


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
        studentBalance: state.abonement.studentBalance,

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
       
        onGetToken: (idUser, amount, price, discipline) => dispatch(actions.getToken(idUser, amount, price, discipline)),
        onGetStudentBalance: (idStudent) => dispatch(actions.getStudentBalance(idStudent)),

        
        
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
/*

export default Payment;*/
