import React from 'react'
import {connect} from 'react-redux';
import {Route} from 'react-router-dom'

import Row from "../../components/Row/index.js";
import Col from "../../components/Col/index.js";
import Login from "../../components/Login/index.js";
import {message} from 'antd';
import LoginForget from "../../components/LoginForget/index.js";
import CreateProfile from "../../components/CreateProfile";

import moment from 'moment'
import * as actions from '../../store/actions'
import './styles.css'
import RegistrationTrainer from '../../components/RegistrationTrainer';
import CreateTrainModal from "../../components/Modals/CreateTrainModal";
import logo from "../../img/logo.svg"

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRegFinished: false
        };
    }

    componentDidMount() {
        if (sessionStorage.getItem('landing')) {
            this.props.onGetIdUserByToken(sessionStorage.getItem('landing'), this.props.history)
        }
    }

    onSendDataTrialModal = (data) => {
        const {disciplinesList,isAdmin} = this.props;
        const {email, type} = data;
        const registerData = {
            email,
            password: "123456",
            name: email,
            disciplines: [{discipline: [disciplinesList[type].code]}],
            frozenTraining: Object.keys(disciplinesList).length
        };
        let newUserData = {};

        this.props.onRegisterUser(registerData, this.props.history)
            .then(res => {
                if (res && res.data.code === 200) {
                    newUserData.id = res.data.result.id;
                    this.props.onUnauthorizedTrialDataSave(data);


                    const time0 = moment(Date.now()).startOf('week').format('X');
                    const time1 = moment(Date.now()).endOf('week').format('X');
                    this.props.onGetAvailableInterval(time0, time1, Object.keys(data.selectedDays), [disciplinesList[type].code],isAdmin)
                        .then(data => {
                            if(!data.length)  message.info('На выбранной неделе нет свободных тренеров - перейди на следующую неделю')
                        })
                    this.props.onSetPushTrialTraining('trial');
                    this.props.onChangeCurrDiscipline(disciplinesList[type]);

                    this.props.history.push('/app/schedule');
                    message.info("Вы зарегистрированы. Выберите время для пробной тренировки", 7);
                } else message.error("Произошла ошибка, попробуйте ещё раз");
            })
            .catch(err => console.log(err));
    };

    render() {
        const {disciplinesList} = this.props;
        return (
            <div className="loginPage">
                <React.Fragment>
                    <div className="loginPage-header">
                        <a className="loginPage-header-logo" href='https://fasolstudio.by'>
                            <img src={logo} width={156} height={80}/>
                        </a>
                    </div>

                    <Row style={{marginLeft: 0, marginRight: 0}}>
                        <Col xs={{span: 12, offset: 6}}
                             sm={{span: 12, offset: 6}}
                             md={{span: 12, offset: 6}}
                             lg={{span: 12, offset: 6}}
                             xl={{span: 12, offset: 6}}>
                            <Route path="/signin"
                                   exact
                                   render={() => <Login urlForget={this.props.match.url + '/forget'}
                                                        urlRegistrationStudent='/registration'
                                                        urlTrialTraining='trial-training'
                                                        errorCode={this.props.errorCode}
                                                        resetError={this.props.onResetError}
                                                        onSubmitLogin={(obj) => this.props.onLogin(obj, this.props.history)}
                                                        onSubmitRegistration={(obj) => this.props.onRegisterUser(obj, this.props.history)}
                                                        onSocialAuthorization={(obj) =>
                                                            this.props.onSocialAuthorization(obj, this.props.history)}
                                                        history={this.props.history}
                                                        onSocialNetworkCheck={this.props.onSocialNetworkCheck}
                                   />}
                            />
                            <Route path="/signin/forget"
                                   exact
                                   render={() => <LoginForget urlLogin={this.props.match.url}
                                                              onForgetEmail={this.props.onForgetEmail}
                                                              history={this.props.history}
                                                              onUrlChange={() => {
                                                                  this.props.history.replace(this.props.match.url)
                                                              }}/>}
                            />
                            <Route path="/registration"
                                   exact
                                   render={() => <CreateProfile onSubmit={this.props.onRegisterUser}
                                                                urlLogin="/app"
                                                                getSelectors={this.props.getSelectors}
                                                                uploadFile={this.props.uploadFile}
                                                                onSocialNetworkCheck={this.props.onSocialNetworkCheck}
                                       //checkEmailAvailability={this.props.onCheckEmailAvailability}
                                       //uploadFile = {this.props.uploadFile}
                                   />}
                            />
                            <Route path="/registration-trainer"
                                   exact
                                   render={() => <RegistrationTrainer errorCode={this.props.errorCode}
                                                                      onSubmit={(userInfo) => this.props.onRegisterTrainer(userInfo, this.props.history)}
                                   />}
                            />
                            <Route path="/trial-training"
                                   exact
                                   render={() => <CreateTrainModal
                                       title='Запишись на пробную тренировку'
                                       width={770}
                                       visible={true}
                                       unauthorized={true}
                                       closable={false}
                                       trial={true}
                                       disciplinesList={disciplinesList}
                                       onSave={this.onSendDataTrialModal}
                                   />}
                            />
                        </Col>
                    </Row>
                </React.Fragment>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        errorCode: state.auth.errorCode,
        disciplinesList: state.abonement.disciplines,
        isAdmin:  state.auth.mode === "admin",
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin: ({userName, password, remember}, history) => dispatch(actions.login(userName, password, remember, history)),
        onRegisterUser: (userInfo, history) => dispatch(actions.registerUser(userInfo, history)),
        onSocialNetworkCheck: (idSocial, networkName) => dispatch(actions.socialNetworkCheck(idSocial, networkName)),
        onSocialAuthorization: (idSocial, history) => dispatch(actions.socialAuthorization(idSocial, history)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        reportBug: (message, href) => dispatch(actions.reportBug(message, href)),
        uploadFile: (file) => dispatch(actions.uploadFile(file)),
        onRegisterTrainer: (userInfo, history) => dispatch(actions.registerTrainer(userInfo, history)),
        onUnauthorizedTrialDataSave: (data) => dispatch(actions.unauthorizedTrialDataSave(data)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline,isCallAdmin) => dispatch(actions.getAvailableInterval(dateStart,dateEnd,weekdays,discipline,isCallAdmin)),
        onSetPushBtnAddTraining: () => dispatch(actions.setPushBtnAddTraining()),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onChangeCurrDiscipline: (disc) => dispatch(actions.changeCurrDiscipline(disc)),
        onGetIdUserByToken: (token, history) => dispatch(actions.getIdUserByToken(token, history)),
        onResetError: () => dispatch(actions.resetError()),
        onForgetEmail:(email) => {}//dispatch(actions.forgetEmail(email))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
