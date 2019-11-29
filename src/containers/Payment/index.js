import React from 'react'


import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPayment from "../../components/CoachPayment";
import StudentPayment from "../../components/StudentPayment";

import {Redirect} from 'react-router-dom'
import moment from 'moment'

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
        if (this.props.mode === 'student'){
            this.props.onGetDisciplineCommunication(this.props.id);
            this.props.onGetNextTraining(this.props.id);
            this.props.onGetUserCountry();
            this.props.onGetAbonementsPrice();
        }
        else {
            let start = null;
            let end = null;
            this.props.onGetPostTrainerTraining(this.props.id, start, end);
        }
        this.props.onGetDeadlinePay(this.props.id);
    }

    countCompletedTrainingsNumber = () => {
        const {postTraining} = this.props;
        let count = 0;

        for(let day in postTraining)
            for(let train in postTraining[day])
                ++count;
            return count;
    };

    showCreateTrainModal = (amount, price,currency) => {
        const {id, currDiscipline, profileStudent} = this.props;

        this.props.onGetToken(id, amount, price, currency, profileStudent.login);

        this.setState({amount, price});
        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: amount});
    };

    render() {
        let {deadlinePay, studentBalance, nextTrainingTime, country, priceList} = this.props;
        let isStudent = this.props.auth.mode === "student";

        return (
            <React.Fragment>
                {isStudent ? (
                    <StudentPayment
                        showTrialModal = {this.showCreateTrainModal}
                        deadlinePay = {deadlinePay}
                        studentBalance = {studentBalance}
                        nextTrainingTime={nextTrainingTime}
                        onSubmitPaySubscription = {this.onSubmitPaySubscription}
                        country={country}
                        priceList={priceList}
                    />)
                    : (<CoachPayment
                        completedAmount={this.countCompletedTrainingsNumber()}
                    />)}



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
                                    onClick={() => this.showCreateTrainModal(this.state.countPay)}
                                    type='yellow'/>
                        </div>


                        <div className="schedule-message-btn">
                            <Button btnText='Вернуть ошибку об оплате'
                                    onClick={() => this.setState({payModal: false})}
                                    type='yellow'/>
                        </div>

               </Modal> */ }


                { this.state.redirectToSchedule ? <Redirect to="/app/schedule"/> : null }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        currDiscipline: state.abonement.currDiscipline,


        profileCoach: state.profileCoach,
        profileStudent: state.profileStudent,
        frozenTraining: (state.profileStudent) ? state.profileStudent.frozenTraining : 0,
        mainUser: (state.profileStudent) ? state.profileStudent.mainUser : null,
        auth: state.auth,
        id: state.auth.id,
        mode: state.auth.mode,
        country: state.loading.country,
        priceList: state.loading.priceList,
        deadlinePay: state.student.deadlinePay,
        disciplinesList: state.abonement.disciplines,
        nextTrainingTime: state.training.nextTrainingTime,
        amountTraining: state.profileStudent.amountTraining,
        discCommunication: state.student.discCommunication,
        subsForDisc : state.abonement.subsForDisc,
        abonementIntervals: state.students.abonementIntervals,
        studentBalance: state.abonement.studentBalance,
        postTraining: state.trainer.postTraining,
        isAdmin:  state.auth.mode === "admin",
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),
        onGetDeadlinePay: (idStudent) => dispatch(actions.getDeadlinePay(idStudent)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline, isCallAdmin) => dispatch(actions.getAvailableInterval(dateStart, dateEnd, weekdays, discipline,isCallAdmin)),
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data)),
        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onSetMasterTheDisicipline: (idMaster) => dispatch(actions.setMasterTheDisicipline(idMaster)),
        onAddAmountTraining: (idSubscription, addAmount) => dispatch(actions.addAmountTraining(idSubscription, addAmount)),

        onGetToken: (idUser, amount, price, discipline, currency) => dispatch(actions.getToken(idUser, amount, price, discipline, currency)),
        onGetStudentBalance: (idStudent) => dispatch(actions.getStudentBalance(idStudent)),
        onGetPostTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getPostTrainerTraining(idMaster, dateMin, dateMax)),
        onGetNextTraining: (id) => dispatch(actions.getNextTraining(id)),
        onGetUserCountry: () => dispatch(actions.getUserCountry()),
        onGetAbonementsPrice: () => dispatch(actions.getAbonementsPrice())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
/*

export default Payment;*/
