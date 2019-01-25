import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux';
import {NavLink, Redirect, Route} from 'react-router-dom'
import Hoc from '../../hoc'
import Icon from "../../components/Icon/index.js";
import Row from "../../components/Row/index.js";
import Col from "../../components/Col/index.js";
import Login from "../../components/Login/index.js";
import { message } from 'antd';
import LoginForget from "../../components/LoginForget/index.js";
import Registration from "../../components/Registration/index.js";
import CreateProfile from "../../components/CreateProfile";

import RegistrationPatient from "../../components/RegistrationPatient/index.js";
import langsArray from "../../helpers/langsArray"
import addInfoObj from "../../helpers/addInfoObj"

import moment from 'moment'
import * as actions from '../../store/actions'
import './styles.css'
import RegistrationTrainer from '../../components/RegistrationTrainer';
import TrialTrainModal from "../../components/TrialTrainModal";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRegFinished: false
        };
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

    render(){
        return (
            <Hoc>

                <div className="loginPage-header">
                    <div className="loginPage-header-close">
                        <NavLink to="/login" onClick={this.onOk}>
                            <Icon type='close' svg />
                        </NavLink>
                    </div>
                </div>

                <Row style={{marginLeft: 0, marginRight: 0}}>
                    <Col xs={{span: 12, offset: 6}}
                         sm={{span: 12, offset: 6}}
                         md={{span: 12, offset: 6}}
                         lg={{span: 12, offset: 6}}
                         xl={{span: 12, offset: 6}}>
                        <Route path="/login"
                               exact
                               render={() => <Login urlForget={this.props.match.url + '/forget'}
                                                    urlRegistrationStudent='/registration'
                                                    errorCode={this.props.errorCode}
                                                    onSubmit={(obj) => this.props.onLogin(obj, this.props.history)}
                               />}
                        />
                        <Route path="/login/forget"
                               exact
                               render={() => <LoginForget urlLogin={this.props.match.url}
                                                          onUrlChange={() => {
                                                              this.props.history.replace(this.props.match.url)
                                                          }}/>}
                        />
                        <Route path="/registration"
                               exact
                               render={() => <CreateProfile onSubmit={this.props.onRegisterUser}
                                                            urlLogin="/app"
                                                            getSelectors={this.props.getSelectors}
                                                            //checkEmailAvailability={this.props.onCheckEmailAvailability}
                                                            //uploadFile = {this.props.uploadFile}
                               />}
                        />
                        <Route path="/registration-trainer"
                               exact
                               render={() => <RegistrationTrainer  errorCode={this.props.errorCode}
                                                                    onSubmit={(userInfo) => this.props.onRegisterTrainer(userInfo, this.props.history)}
                               />}
                        />
                        <Route path="/trial-training"
                               exact
                               render={() => <TrialTrainModal
                                   title='Запишись на пробную тренировку'
                                   width={770}
                                   visible={true}
                                   unauthorized={true}
                                   closable={false}
                                   onSave={this.onSendDataTrialModal}
                               />}
                        />
                    </Col>
                </Row>
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
	return {
        errorCode: state.auth.errorCode,
        disciplinesList: state.abonement.disciplines
	}
};

const mapDispatchToProps = dispatch => {
	return {
        onLogin: ({userName, password, remember}, history) => dispatch(actions.login(userName, password, remember, history)),
        onRegisterUser: (userInfo, history) => dispatch(actions.registerUser(userInfo, history)),
        onCheckEmailAvailability: (email) => dispatch(actions.checkEmailAvailability(email)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        reportBug: (message, href) => dispatch(actions.reportBug(message, href)),
        uploadFile: (file) => dispatch(actions.uploadFile(file)),
        onRegisterTrainer: (userInfo, history) => dispatch(actions.registerTrainer(userInfo, history)),
        onUnauthorizedTrialDataSave: (data) => dispatch(actions.unauthorizedTrialDataSave(data)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline) => dispatch(actions.getAvailableInterval(dateStart, dateEnd, weekdays, discipline)),
        onSetPushBtnAddTraining: () => dispatch(actions.setPushBtnAddTraining()),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
