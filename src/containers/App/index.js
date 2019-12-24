import React from 'react';
import {Modal, message, Spin} from "antd";
import {docRoutes, patientRoutes, adminRoutes, menuDoc, menuPatient} from '../../routes'
import {coachRoutes, studentRoutes, menuStudent, menuCoach, menuAdmin} from '../../routes'
import {Route, Switch, Redirect} from 'react-router-dom'
import SideNav from '../../components/SideNav'
import Header from '../../components/Header';
import Spinner from '../../components/Spinner'

import {connect} from 'react-redux';
import {createSocket, closeSocket, register, sendMessage} from './chatWs';
import ab from '../../autobahn.js'

import Icon from "../../components/Icon";

import * as actions from '../../store/actions'
import './styles.css';
import 'antd/dist/antd.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../styles/fonts.css';
import VKApp from '../../components/VKApp';
import { detect } from 'detect-browser';
import firebase, { messaging } from 'firebase'
import WarningModal from '../../components/WarningModal';

const browser = detect();

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
            widget: null,
            id: null,
            mustLeaveReview: false,
            isWarningModal: false
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

    componentDidUpdate(prevProps){
        this.state.scheduleSpinner && this.setState({scheduleSpinner: false});
    }
    runFirebase = () => {
        if (!firebase.apps.length){
            console.log("Initialize firebase app")
            firebase.initializeApp({
            messagingSenderId: '913021465205'
            })
        };
    }

    setupPushNotificationsToken = (id) => {
        this.props.onGetPushNotificationsToken(id,true)
            .then(token => {
                if (token) this.props.onRefreshPushNotificationsToken(id,token);
        })
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
                setTimeout(() => this.runNotificationsWS(), 5000)
                console.warn('WebSocket connection closed');
            },
            {'skipSubprotocolCheck': true, id : this.props.id}
        );
    };

     runChatWS = () => {
        const {chatProps, setChatFromId, setChatToId, setReceptionStatus, setIsCallingStatus,
            setConversationMode, setChatStory, setChatTrainingId, setNewTimer, onSaveMessage,
            setChatInterlocutorInfo, setBeginTime, setIsTrialStatus, setIsCompleteStatus,
            setWebSocketStatus} = this.props;

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
                setWebSocketStatus,

                get_from: () => this.props.from,
                get_to: () => this.props.to,
                get_receptionStarts: () => this.props.trainingStarts,
                get_isCalling: () => this.props.isCalling,
                get_user_mode: () => this.props.mode,
                get_interlocutorName: () => this.props.interlocutorName,
                get_interlocutorAvatar: () => this.props.interlocutorAvatar,

                get_chatStory: () => this.props.chatStory,
                get_visitInfo: () => this.getChatInfo(),
                get_timer: () => this.props.timer,
                get_history: () => this.props.history,
                show_error: () => this.setState({isWarningModal: true}),
                show_error_from_server: () => this.setState({isServerWarningModal: true})
            })
            .onerror = () => {
                console.log("onerror")
                setTimeout(() => this.runChatWS(), 5000)
            }
        
            sendMessage('sdf')

        register(''+this.props.id, '', this.props.mode)
        setInterval(() => register(''+this.props.id, '', this.props.mode), 30000);
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
         if (browser && /iOS|Android OS|BlackBerry OS|Windows Mobile|Amazon OS/i.test(browser.os))
             Modal.warning({
                 title: 'Мобильное устройство',
                 width: '500px',
                 className: 'quick-modal',
                 content: 'Для более удобной работы с платформой зайдите с компьютера! ' +
                     'Но вы всегда можете записаться на тренировку и с телефона, ' +
                     'здесь для вас также доступен весь функционал! Браузер: '
                     + browser.name + ' ' + browser.version + ', OS: ' + browser.os,
                 zIndex: 1050
             });
     };

    componentWillReceiveProps(nextProps) {
    }

    fetchStudentInfo = (id) => {
        this.props.onGetInfoPatient(id);
        this.props.onGetMasterList();
        this.props.onGetStudentBalance(id);
        this.props.onGetUseFrozenTraining(id);
        this.props.onGetSubscriptionsByStudentId(id);
        this.props.onGetDisciplineCommunication(id);
        this.warnIfMobileDevice();
    }

    componentDidMount() {
        const {id, mode} = this.props;
        const {pathname} = this.props.history.location;

        this.runFirebase();
        
        this.props.getSelectors('discipline')
            .then(() => (mode === 'student' ||  this.isStudentSchedule()) && this.props.onGetTrainingsTrialStatus(this.props.id));

        if (mode === "master") {
            this.props.onGetInfoDoctor(id)
                .then((data) => {

                            data && data.discipline && data.disciplines.forEach((el) =>
                                el.discipline.forEach((elem) => {
                                    elem && this.props.onChangeCurrDiscipline({...elem, code: elem.id})
                                })
                            )
                })
            this.setupPushNotificationsToken(id);
        }
        else if (mode === "student") {
           this.fetchStudentInfo(id)
           this.setupPushNotificationsToken(id)
        }
        else if (mode === 'admin'){         
            if(this.isStudentSchedule()){
                let id = +pathname.replace('/app/schedule', '');
                Number.isInteger(id) && this.fetchStudentInfo(id)
            }
        }

        if (id) {
            this.runChatWS();
            this.runNotificationsWS();
        }
        
    }

    isStudentSchedule = () => { 
        // const {match} = this.props;

        // let forAdmin;
        // if(Object.keys(match.params).length && match.params.id){
        //     forAdmin = true
        // }
        // else {
        //     forAdmin = false
        // }
        // this.props.setParamsId({renderStudentScheduleForAdmin: forAdmin})
        // return forAdmin


        const {pathname} = this.props.history.location;
        return pathname.includes('/app/schedule') && pathname.length !== ('/app/schedule'.length) ? true : false
    }

    componentWillMount() {
        const login = localStorage.getItem('_fasol-user'),
            pass = localStorage.getItem('_fasol-pass');

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
        const {pathname} =  this.props.history.location;
        if(!pathname.includes('/app/schedule')) this.props.history.push('/app/schedule')
    };

    showTransferInterval = () => {
        const {weekInterval, discCommunication, startDate, endDate, currDiscipline, isAdmin} = this.props;
        const idMaster = discCommunication.hasOwnProperty(currDiscipline.code) ? discCommunication[currDiscipline.code].idMaster : null

        if(weekInterval && idMaster){

            let chooseWeekdays = [0,1,2,3,4,5,6];
            this.setState({scheduleSpinner: true})

            
            this.onGoToSchedule();
            this.props.onGetTheMasterInterval(startDate, endDate, idMaster, chooseWeekdays, isAdmin)
        }
    }


    renderVKApp = () => {
		return (
			<VKApp
				apiId={120172845}
				onMount={(widget, id) => {
					this.setState({ widget, id });
				}}
			/>
		)
    }

    render() {
        const {isLoading} = this.props;
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


        console.log("isLoading", isLoading)
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
                                            getNotifId={id => this.props.readNotification(id)}
                                            getNotifications={() => this.props.getNotifications(this.props.id)}
                                            logout={this.props.onLogout}
                                            showTransferInterval={this.showTransferInterval}

                                            isOnMainPage={this.props.location.pathname === '/app'}

                                            isTransferTrainPopupActive={this.props.isTransferTrainPopupActive}
                                            onTransferTrainPopupClose={this.props.onTransferTrainPopupDisable}
                                            isStudentSchedule={this.isStudentSchedule()}
                                            notifications = {this.props.notifications}
                                            pushNotificationsToken = {this.props.pushNotificationsToken}
                                            askForPermissionToReceiveNotifications = {this.props.onAskForPermissionToReceiveNotifications}
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
                                {/*this.renderVKApp()*/}
                            </div>
                            {isLoading &&
                                <div className = "schedule-spinner">
                                  <Spinner isInline={true} size='large'/>
                                </div>
                            }

                            <React.Fragment>
                                    <WarningModal 
                                        onClick={() => this.setState({isWarningModal: false})}
                                        visible={this.state.isWarningModal} 
                                        message={'Пользователь недоступен'}
                                    />

                                    <WarningModal 
                                        onClick={() => this.setState({isServerWarningModal: false})}
                                        visible={this.state.isServerWarningModal} 
                                        message={'Вы отключены от видеосервера. Выйдите и зайдите в систему снова'}
                                    />
                            </React.Fragment> 

                        </React.Fragment> :
                        <Redirect to='/signin'/>
                }
                
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        startDate: state.training.startDate,
        endDate: state.training.endDate,

        isLoading: state.loading.isLoading,

        auth: state.auth,
        id: state.auth.id,
        mode: state.auth.mode,
        pushNotificationsToken:state.auth.pushNotificationsToken,
        profileCoach: state.profileCoach,
        profileStudent: state.profileStudent,
        selectors: state.loading.selectors,


        frozenTraining: (state.profileStudent) ? state.profileStudent.frozenTraining : '-',
        usersHeaderSearch: state.loading.usersHeaderSearch,
        weekInterval: state.abonement.weekInterval,

        discCommunication: state.student.discCommunication,


        currDiscipline: state.abonement.currDiscipline,
        notifications: state.training.notifications,
        isAdmin:  state.auth.mode === "admin",
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
        interlocutorAvatar: state.chatWS.interlocutorAvatar,
        timer: state.chatWS.timer,


        isTransferTrainPopupActive: state.student.isTransferTrainPopupActive
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setParamsId: (params) => dispatch(actions.setParamsId(params)),


//

        onLogin: ({userName, password, remember}, history) => dispatch(actions.login(userName, password, remember, history)),
        onLogout: () => dispatch(actions.logout()),
        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        onGetSearchUsers: (name) => dispatch(actions.searchUsers(name)),
        onGetMasterList: (allInfo) => dispatch(actions.getMasterList(allInfo)),
        onGetAbonementsFilter: (idStudent, currDiscipline) => dispatch(actions.getAbonementsFilter(idStudent, currDiscipline)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),

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
        setWebSocketStatus: (status) => dispatch(actions.setWebSocketStatus(status)),

        onSetPushBtnTransferTraining: (type) => dispatch(actions.setPushBtnTransferTraining(type)),
        onSetPushBtnAddTraining: (type) => dispatch(actions.setPushBtnAddTraining(type)),
        onGetTheMasterInterval:(dateStart,dateEnd,idMaster,weekdays,isCallAdmin)=>dispatch(actions.getTheMasterInterval(dateStart,dateEnd,idMaster,weekdays,isCallAdmin)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onGetTrainingsTrialStatus: (idStudent) => dispatch(actions.getTrainingsTrialStatus(idStudent)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline,isCallAdmin)=>dispatch(actions.getAvailableInterval(dateStart,dateEnd,weekdays,discipline,isCallAdmin)),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
        onGetSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),
        onAddAmountTraining: (idSubscription, addAmount) => dispatch(actions.addAmountTraining(idSubscription, addAmount)),
        onEditUseFrozenTraining: (idStudent,amountTraining) => dispatch(actions.editUseFrozenTraining(idStudent,amountTraining)),
        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
        onChangeBtnBack: (status) => dispatch(actions.changeBtnBack(status)),
        onChangeBtnTransfer: (status) => dispatch(actions.changeBtnTransfer(status)),

        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onSetMasterTheDisicipline: (idMaster) => dispatch(actions.setMasterTheDisicipline(idMaster)),
        onGetStudentBalance: (idStudent) => dispatch(actions.getStudentBalance(idStudent)),
        onGetUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),
        
        onTransferTrainPopupDisable: () => dispatch(actions.transferTrainPopupDisable()),
        onUnsetPushBtnTransferTraining: () => dispatch(actions.unsetPushBtnTransferTraining()),

        onAskForPermissionToReceiveNotifications: (id) => dispatch(actions.askForPermissionToReceiveNotifications(id)),
        onGetPushNotificationsToken : (id,changeStatus) => dispatch(actions.getPushNotificationsToken(id,changeStatus)),
        onRefreshPushNotificationsToken : (id,token) => dispatch(actions.refreshPushNotificationsToken(id,token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
