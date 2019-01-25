import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'
import moment from 'moment'
import { message } from 'antd'


import Spinner from "../../components/Spinner";
import Calendar from "../../components/Calendar22";
import TrialTrainModal from '../../components/TrialTrainModal';

class TrialSchedule extends React.Component{

    constructor(props){
        super(props);
        this.state = {
        }
    }

    onSendDataTrialModal = (data) => {
        const {disciplinesList} = this.props;
        const {email, type} = data;
       // debugger
        const registerData = {
            email,
            password: "123456",
            disciplines: [{discipline: [disciplinesList[type].code]}],
            frozenTraining : 1
        };

        let newUserData = {};

        this.props.onRegisterUser(registerData,  this.props.history)
            .then(res => {
                //debugger;
                if (res && res.data.code === 200) {
                    newUserData.id = res.data.result.id;
                    this.props.onUnauthorizedTrialDataSave(data);
                    
                    
                    const time0 = moment(Date.now()).startOf('week').format('X');
                    const time1 = moment(Date.now()).endOf('week').format('X');
                    this.props.onGetAvailableInterval(time0 ,time1, Object.keys(data.selectedDays),  [disciplinesList[type].code]);
                    this.props.onSetPushTrialTraining('trial');
                    this.props.onChangeCurrDiscipline(disciplinesList[type]);

                    this.props.history.push('/app/schedule');
                    message.info("Вы зарегистрированы. Выберите время для пробной тренировки", 10);
                }
                else message.error("Произошла ошибка, попробуйте ещё раз");
            })
            .catch(err => console.log(err));
    };


    componentDidMount(){

    }


    render() {

            return (
                <Hoc>
                    <TrialTrainModal
                        title='Запишись на пробную тренировку'
                        width={770}
                        visible={true}
                        unauthorized={true}
                        closable={false}
                        onSave={this.onSendDataTrialModal}
                    />
                   <Calendar />
                   
                </Hoc>
            )
    }
}




const mapStateToProps = state => {
    return {
        profileStudent: state.profilePatient,
        appsBetweenCount: state.treatments.appsBetweenCount
    }
};

const mapDispatchToProps = dispatch => {
    return {
         onRegisterUser: (userInfo, history) => dispatch(actions.registerUser(userInfo, history)),
         onUnauthorizedTrialDataSave: (data) => dispatch(actions.unauthorizedTrialDataSave(data)),
         onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline) => dispatch(actions.getAvailableInterval(dateStart, dateEnd, weekdays, discipline)),
         onSetPushBtnAddTraining: () => dispatch(actions.setPushBtnAddTraining()),
         onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
         onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrialSchedule);
