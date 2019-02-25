import React from 'react';
import {docRoutes, patientRoutes, adminRoutes, menuDoc, menuPatient} from '../../routes'
import {coachRoutes, studentRoutes, menuStudent, menuCoach, menuAdmin} from '../../routes'
import {Route, Switch, Redirect} from 'react-router-dom'
import SideNav from '../../components/SideNav'
import Header from '../../components/Header';

import {connect} from 'react-redux';
import {createSocket, closeSocket, register} from './chatWs';
import ab from '../../autobahn.js'

import * as actions from '../../store/actions'
import './styles.css';
import 'antd/dist/antd.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../styles/fonts.css';

import Icon from "../../components/Icon";
import Spinner from "../../components/Spinner";

import {Modal} from "antd";

const renderRoutes = ({path, component, exact}) => (
    <Route key={path} exact={exact} path={path} component={component}/>
);


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            notifications: [],
            scheduleSpinner: false,
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };


    /* Notifications and chat */

    componentWillUnmount(){
        closeSocket();
    }

    runNotificationsWS = () => {
        const that = this;
        //let id = 3199;
        let conn = new ab.Session('wss://web.fasolonline.ru/wss2/',
            function() {
                that.props.getNotifications(that.props.id);

                conn.subscribe("" + that.props.id, function(topic, data) {
                    that.props.onSaveNotification(data.arr);
                    that.setState({
                        notifications: data.arr
                    });
                });
            },
            function() {
                console.warn('WebSocket connection closed');
            },
            {'skipSubprotocolCheck': true, id : this.props.id}
        );
    };

     runChatWS = () => {
        const {chatProps, setChatFromId, setChatToId, setReceptionStatus, setIsCallingStatus,
            setConversationMode, setChatStory, setChatTrainingId, setNewTimer, onSaveMessage,
            setChatInterlocutorInfo, setBeginTime, setIsTrialStatus, setIsCompleteStatus} = this.props;

        createSocket(
            'wss://web.fasolonline.ru:8443/one2one',
            chatProps,
            {
                setChatFromId,
                setChatToId,
                setChatTrainingId,
                setReceptionStatus,
                setIsCallingStatus,
                setConversationMode,
                setChatStory,
                setNewTimer,
                onSaveMessage,
                setChatInterlocutorInfo,
                setBeginTime,
                setIsTrialStatus,
                setIsCompleteStatus,

                get_from: () => this.props.from,
                get_to: () => this.props.to,
                get_receptionStarts: () => this.props.trainingStarts,
                get_isCalling: () => this.props.isCalling,
                get_user_mode: () => this.props.mode,
                get_interlocutorName: () => this.props.interlocutorName,
                get_chatStory: () => this.props.chatStory,
                get_visitInfo: () => this.getChatInfo(),
                get_timer: () => this.props.timer,
                get_history: () => this.props.history,
            }
        );

        register('' + this.props.id, ''/*+this.props.user_id*/, this.props.mode);
    };

     getChatInfo = () => {
         let name, avatar;
         if (this.props.mode === "master" && this.props.profileCoach) {
             name = this.props.profileCoach.name;
             avatar = this.props.profileCoach.avatar;
         }
         else if (this.props.auth.mode === "student" && this.props.profileStudent) {
             name = this.props.profileStudent.name;
             avatar = this.props.profileStudent.avatar;
         }
         return {
             idTraining: this.props.idTraining,
             conversationMode: this.props.conversationMode,
             fromName: name,
             fromAvatar: avatar,
             beginTime: this.props.beginTime,
             isTrial: this.props.isTrial
         }
     };

     warnIfMobileDevice = () => {
         const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);
         if (isMobile)
             Modal.warning({
                 title: 'Мобильное устройство',
                 width: '500px',
                 className: 'fast-modal',
                 content: 'Для более удобной работы с платформой зайдите с компьютера! ' +
                     'Но вы всегда можете записаться на тренировку и с телефона, ' +
                     'здесь для вас также доступен весь функционал!',
                 zIndex: 1050
             });
     };

    componentDidMount() {
        const {id, currDiscipline} = this.props;
        this.props.getSelectors('discipline')
            .then(res => this.props.mode === 'student' && this.props.onGetTrainingsTrialStatus(this.props.id));
        if (this.props.mode === "master"){
            this.props.onGetInfoDoctor(id);
        }
        else if (this.props.mode === "student") {
            //this.props.onGetAbonements(id, currDiscipline);
            this.props.onGetInfoPatient(id);
            this.props.onGetMasterList();
            this.props.onGetStudentBalance(id);
            this.props.onGetUseFrozenTraining(id);
            this.props.onGetSubscriptionsByStudentId(id);
            this.props.onGetDisciplineCommunication(id);
            this.warnIfMobileDevice();
        }

        if (id) {
            this.runChatWS();
            this.runNotificationsWS();
        }
    }

    componentWillMount() {
        const login = localStorage.getItem('_fasol-user'),
            pass = localStorage.getItem('_fasol-pass');

            console.log('win :', window.localStorage);
        this.props.onGetInfoLanding();

        (!this.props.id && !this.props.mode && login && pass) &&
        this.props.onLogin({
            userName: login,
            password: pass,
        }, this.props.history);

    }

    gotoHandler = (id, userGroup) => {
        const {history} = this.props;

        if (userGroup === "master")
            history.push('/app/coach' + id);
        else if (userGroup === "student")
            history.push('/app/student' + id);
    };

    onLogoClick = () => {
        (this.props.history.location.pathname !== "/app") && this.props.history.push('/app');
    };

    onProfileClick = () => {
        (this.props.history.location.pathname !== "/app/personal-info") && this.props.history.push('/app/personal-info');
    };

    onGoToSchedule = () => {
        this.props.history.push('/app/schedule');
    };

    pushBtnTransfer = () => {
        this.setState({scheduleSpinner: true})

        const {weekInterval, discCommunication, disciplinesList, currDiscipline} = this.props;

        const codeDisc = discCommunication.hasOwnProperty(currDiscipline.code) ? discCommunication[currDiscipline.code].idMaster : null


        if(weekInterval && codeDisc){
            let idMaster = this.props.profileStudent.mainUser;
            let chooseWeekdays = [1,2,3,4,5,6,7];

            this.onGoToSchedule();
            this.props.onGetTheMasterInterval(weekInterval.start, weekInterval.end, codeDisc, chooseWeekdays)
             .then(() => {
                this.setState({scheduleSpinner: false})
                 this.props.onSetPushBtnTransferTraining()
             })
        }
        // const start =  moment(Date.now()).startOf('week').format('X');
        // const end = moment(Date.now()).endOf('week').format('X');

    }

    pushBtnUnfresh = () => {

        const {weekInterval} = this.props;
        this.setState({scheduleSpinner: true})
        if(weekInterval){
            let idMaster = this.props.profileStudent.mainUser;
            let chooseWeekdays = [1,2,3,4,5,6,7];

            this.props.onGetTheMasterInterval(weekInterval.start, weekInterval.end, idMaster, chooseWeekdays)
             .then(() => {
                this.setState({scheduleSpinner: false})
                 this.props.onSetPushBtnAddTraining()
            })
        }

    }
    render() {
        let name, avatar;

        if (this.props.mode === "master" && this.props.profileCoach) {
            name = this.props.profileCoach.name;
            avatar = this.props.profileCoach.avatar;
        }
        else if (this.props.auth.mode === "student" && this.props.profileStudent) {
            name = this.props.profileStudent.name;
            avatar = this.props.profileStudent.avatar;
        }

        const {collapsed} = this.state;
        const siderClass = collapsed ? 'main-sidebar collapsed' : 'main-sidebar';
        const wrapperClass = collapsed ? 'main-wrapper collapsed' : 'main-wrapper';
        const isStudent = this.props.mode === "student";

        const isAdmin = this.props.mode === "admin";

        return (
            <div className="main">
                {
                    this.props.id ?
                        <React.Fragment>
                            <div className={siderClass}>
                                <SideNav
                                    avatar={avatar}
                                    name={name}
                                    onLogoClick={this.onLogoClick}
                                    menuItems={isAdmin ? menuAdmin : isStudent ? menuStudent : menuCoach}
                                    isShort={this.state.collapsed}
                                    onProfileClick={this.onProfileClick}
                                />
                            </div>
                            <div className={wrapperClass}>
                                <div className="main-header">
                                    <button onClick={this.toggle}
                                            className="sidenav-root-btn">
                                        {
                                            this.state.collapsed ? (
                                                <Icon type="right-arrow-forward_small" size={12} svg/>
                                            ) : (
                                                <Icon type="left-arrow-forward_small" size={12} svg/>
                                            )
                                        }
                                    </button>
                                    <Header id={this.props.id}
                                            findName={this.props.onGetSearchUsers}
                                            authMode={this.props.mode}
                                            searchData={this.props.usersHeaderSearch}
                                            onGoto={this.gotoHandler}
                                            notifications={this.state.notifications}
                                            getNotifId={id => this.props.readNotification(id)}
                                            getNotifications={() => this.props.getNotifications(this.props.id)}
                                            logout={this.props.onLogout}
                                            isPushBtnTransfer={this.pushBtnTransfer}
                                            isPushBtnAdd={this.pushBtnUnfresh}
                                            isStudent={(this.props.mode === 'student')}
                                            isOnMainPage={this.props.location.pathname === '/app'}
                                            frozenTraining={this.props.frozenTraining}
                                            disciplinesList={this.props.disciplinesList}
                                            
                                            trialTrainingForDisciplines={this.props.trialTrainingForDisciplines}
                                            isTrialTrainingsAvailable={this.props.isTrialTrainingsAvailable}
                                            countTrainingDiscipline = {this.props.countTrainingDiscipline}
                                            discCommunication = {this.props.discCommunication}
                                            studentBalance = {this.props.studentBalance}
                                            useFrozenTraining = {this.props.useFrozenTraining}   
                                            subsForDisc = {this.props.subsForDisc}
                                            abonementIntervals = {this.props.abonementIntervals}

                                            onGetAbonementsFilter = {this.props.onGetAbonementsFilter}
                                            onSetFreeIntervals = {this.props.onSetFreeIntervals}
                                            onGetTheMasterInterval = {this.props.onGetTheMasterInterval}
                                            onIsPushBtnUnfresh = {this.props.onIsPushBtnUnfresh}
                                            onSetMasterTheDisicipline = {this.props.onSetMasterTheDisicipline}
                                            onSetNeedSaveIntervals = {this.props.onSetNeedSaveIntervals}
                                            onEditUseFrozenTraining = {this.props.onEditUseFrozenTraining}
                                            onAddAmountTraining = {this.props.onAddAmountTraining}
                                            onGetAvailableInterval={this.props.onGetAvailableInterval}
                                            onSetPushTrialTraining={this.props.onSetPushTrialTraining}
                                            onChangeCurrDiscipline={this.props.onChangeCurrDiscipline}
                                            onGoToSchedule={this.onGoToSchedule}
                                            isTransferTrainPopupActive={this.props.isTransferTrainPopupActive}
                                            onTransferTrainPopupClose={this.props.onTransferTrainPopupDisable}
                                            onUnsetPushBtnTransferTraining={this.props.onUnsetPushBtnTransferTraining}

                                            notifications = {this.props.notifications}
                                            showSpinner = {() => this.setState({scheduleSpinner: true})}
                                            hideSpinner = {() => this.setState({scheduleSpinner: false})}                                        
                                    />
                                </div>
                                <div className="main-content">
                                    <Switch>
                                        {isAdmin ? adminRoutes.map(route => renderRoutes(route))
                                            : isStudent ?
                                                studentRoutes.map(route => renderRoutes(route)) :
                                                coachRoutes.map(route => renderRoutes(route))
                                        }
                                        <Route
                                            render={() => (
                                                <div style={{textAlign: 'center', padding: '40px 20px', color: '#000'}}>
                                                    <h3 style={{color: '#000'}}>Страница не найдена</h3>
                                                    <p>Проверьте введённый адрес</p>
                                                </div>
                                            )}
                                            fl = {1}
                                        />
                                    </Switch>
                                </div>
                            </div>
                            {this.state.scheduleSpinner &&
                                <div className = "schedule-spinner">
                                  <Spinner isInline={true} size='large'/>
                                </div>}
                        </React.Fragment> :
                        <Redirect to='/signin'/>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        id: state.auth.id,
        mode: state.auth.mode,
        profileCoach: state.profileDoctor,
        profileStudent: state.profilePatient,
        selectors: state.loading.selectors,
        trialTrainingForDisciplines: state.student.trialTrainingForDisciplines,
        isTrialTrainingsAvailable: state.student.isTrialTrainingsAvailable,
        frozenTraining: (state.profilePatient) ? state.profilePatient.frozenTraining : '-',
        usersHeaderSearch: state.loading.usersHeaderSearch,
        weekInterval: state.abonement.weekInterval,
        disciplinesList: state.abonement.disciplines,
        discCommunication: state.student.discCommunication,
        studentBalance: state.abonement.studentBalance,
        useFrozenTraining: state.student.useFrozenTraining,
        subsForDisc: state.abonement.subsForDisc,
        abonementIntervals: state.patients.abonementIntervals,
        currDiscipline: state.abonement.currDiscipline,
        notifications: state.training.notifications,

        from: state.chatWS.from,
        to: state.chatWS.to,
        idTraining: state.chatWS.idTraining,
        beginTime: state.chatWS.beginTime,
        trainingStarts: state.chatWS.trainingStarts,
        isCalling: state.chatWS.isCalling,
        isTrial: state.chatWS.isTrial,
        chatStory: state.chatWS.chatStory,
        conversationMode: state.chatWS.conversationMode,
        interlocutorName: state.chatWS.interlocutorName,
        timer: state.chatWS.timer,
        countTrainingDiscipline: state.training.countTrainingDiscipline,

        isTransferTrainPopupActive: state.student.isTransferTrainPopupActive
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onLogin: ({userName, password, remember}, history) => dispatch(actions.login(userName, password, remember, history)),
        onLogout: () => dispatch(actions.logout()),
        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        onGetSearchUsers: (name) => dispatch(actions.searchUsers(name)),
        onGetMasterList: (allInfo) => dispatch(actions.getMasterList(allInfo)),
        onGetAbonementsFilter: (idStudent, currDiscipline) => dispatch(actions.getAbonementsFilter(idStudent, currDiscipline)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),

        onSelectPatient: (id) => dispatch(actions.selectPatient(id)),
        getDocTodayInfo: () => dispatch(actions.getDocTodayInfo()),
        getNotifications: (id) => dispatch(actions.getNotifications(id)),
        readNotification: (id) => dispatch(actions.readNotification(id)),

        onSaveNotification: (data) => dispatch(actions.saveNotification(data)),


        setChatFromId: (id) => dispatch(actions.setChatFromId(id)),
        setChatToId: (id) => dispatch(actions.setChatToId(id)),
        setIsCallingStatus: (isCalling) => dispatch(actions.setIsCallingStatus(isCalling)),
        setReceptionStatus: (isStart) => dispatch(actions.setReceptionStatus(isStart)),
        setConversationMode: (mode) => dispatch(actions.setConversationMode(mode)),
        setChatStory: (chat) => dispatch(actions.setChatStory(chat)),
        setChatTrainingId: (id) => dispatch(actions.setChatTrainingId(id)),
        setNewTimer: (timer) => dispatch(actions.setNewTimer(timer)),
        onSaveMessage: (id, chatHistory) => dispatch(actions.uploadTrainingChatHistory(id, chatHistory)),
        setChatInterlocutorInfo: (interlocutorName, interlocutorAvatar) => dispatch(actions.setChatInterlocutorInfo(interlocutorName, interlocutorAvatar)),
        setBeginTime: (beginTime) => dispatch(actions.setBeginTime(beginTime)),
        setIsTrialStatus: (isTrial) => dispatch(actions.setIsTrialStatus(isTrial)),
        setIsCompleteStatus: (isComplete) => dispatch(actions.setIsCompleteStatus(isComplete)),

        hasNoReviewToFreeApp: ()=>dispatch(actions.hasNoReviewToFreeApp()),
        makeReview: (obj) => dispatch(actions.makeReview(obj)),
        onSetPushBtnTransferTraining: (type) => dispatch(actions.setPushBtnTransferTraining(type)),
        onSetPushBtnAddTraining: () => dispatch(actions.setPushBtnAddTraining()),
        onGetTheMasterInterval: (dateStart, dateEnd, idMaster, weekdays) => dispatch(actions.getTheMasterInterval(dateStart, dateEnd, idMaster, weekdays)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onGetTrainingsTrialStatus: (idStudent) => dispatch(actions.getTrainingsTrialStatus(idStudent)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline) => dispatch(actions.getAvailableInterval(dateStart, dateEnd, weekdays, discipline)),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
        onGetSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),
        onAddAmountTraining: (idSubscription, addAmount) => dispatch(actions.addAmountTraining(idSubscription, addAmount)),
        onEditUseFrozenTraining: (idStudent,amountTraining) => dispatch(actions.editUseFrozenTraining(idStudent,amountTraining)),
        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),

        onGetInfoLanding: () => dispatch(actions.getInfoLanding()),
        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onSetMasterTheDisicipline: (idMaster) => dispatch(actions.setMasterTheDisicipline(idMaster)),
        onGetStudentBalance: (idStudent) => dispatch(actions.getStudentBalance(idStudent)),
        onGetUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),
        onIsPushBtnUnfresh: () => dispatch(actions.isPushBtnUnfresh()),
        onTransferTrainPopupDisable: () => dispatch(actions.transferTrainPopupDisable()),
        onUnsetPushBtnTransferTraining: () => dispatch(actions.unsetPushBtnTransferTraining()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
