import React from 'react';
import {docRoutes, patientRoutes, adminRoutes, menuDoc, menuPatient} from '../../routes'
import {coachRoutes, studentRoutes, menuStudent, menuCoach, menuAdmin} from '../../routes'
import {Route, Switch, Redirect} from 'react-router-dom'
import SideNav from '../../components/SideNav'
import Header from '../../components/Header';
import {message, Modal} from 'antd';
import Adapter from 'webrtc-adapter'

import {connect} from 'react-redux';
import {createSocket, closeSocket, register} from './chatWs';
import ab from '../../autobahn.js'
import moment from 'moment'

import * as actions from '../../store/actions'
import './styles.css';
import 'antd/dist/antd.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../styles/fonts.css';

import Icon from "../../components/Icon";
import { freezeAbonement } from './../../store/actions/abonement';
import cookie from 'react-cookies'

const renderRoutes = ({path, component, exact}) => (
    <Route key={path} exact={exact} path={path} component={component}/>
);


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            notifications: []
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
        this.props.setOnlineStatus(this.props.id, false)
    }
    
    runNotificationsWS = () => {
        let that = this;
        debugger;
        let conn = new ab.Session('wss://appdoc.by/wss2/',
            function() {
                that.props.getNotifications(that.props.id);

                conn.subscribe(""+that.props.id, function(topic, data) {
                    that.props.setExInfo(data.exInterval);
                    that.setState({
                        notifications: JSON.parse(data.arr),
                        isExtrActual: data.isExtrActual,
                    });
                });
            },
            function() {
                console.warn('WebSocket connection closed');
            },
            {'skipSubprotocolCheck': true}
        );
    };

     runChatWS = () => {
        const {chatProps, setChatFromId, setChatToId, setChatTrainingId, setReceptionStatus, setIsCallingStatus,
            setChatStory, onSelectReception, setNewTimer} = this.props;
        
        //     let idReception = null;
        //     if(this.props.mode === 'student') {
        //         if(this.props.id === this.props.from){
        //             idReception += '' + this.props.id + this.props.to;
        //         }
        //         else{
        //             idReception += '' + this.props.id + this.props.from;
        //         }
        //     }
        //     if(this.props.mode === 'master') {
        //         if(this.props.id === this.props.from){
        //             idReception += '' + this.props.to + this.props.id  ;
        //         }
        //         else{
        //             idReception += '' + this.props.from + this.props.id;
        //         }
        //     }

        // let visit = {
        //     contactLevel: 'video',
        //     id: idReception, 
        // }
        
        let sock = createSocket(
           // 'wss://appdoc.by:8443/one2one',
            'wss://web.fasolonline.ru:8443/one2one',
            chatProps,
            {
                setChatFromId,
                setChatToId,
                setChatTrainingId,
                setReceptionStatus,
                setIsCallingStatus,
                setChatStory,
                onSelectReception,
                setNewTimer,

                get_from: () => this.props.from,
                get_to: () => this.props.to,
                get_receptionStarts: () => this.props.receptionStarts,
                get_isCalling: () => this.props.isCalling,
                get_user_mode: () => this.props.mode,
                get_chatStory: () => this.props.chatStory,
                get_visitInfo: () => {return {id: this.props.idTraining}},
                get_timer: () => this.props.timer,
                get_history: () => this.props.history,
            }
        );
        console.log('sock :', sock);
        register(''+this.props.id, ''/*+this.props.user_id*/, this.props.mode);
    };

    componentDidMount() {

        const {id, currDiscipline} = this.props;
        if (this.props.mode === "master"){
            this.props.onGetInfoDoctor(id);
        }
        else if (this.props.mode === "student") {
            //this.props.onGetAbonements(id, currDiscipline);
            this.props.onGetInfoPatient(id);
            this.props.onGetMasterList();
        }

        this.runChatWS();
        // this.runNotificationsWS();
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
        this.props.history.push('/app/schedule');
    };

    pushBtnTransfer = () => {
        const {weekInterval} = this.props;
        if(weekInterval){
            let idMaster = this.props.profileStudent.mainUser;
            let chooseWeekdays = [1,2,3,4,5,6,7];
 
            this.props.onGetTheMasterInterval(weekInterval.start, weekInterval.end, idMaster, chooseWeekdays)
             .then(() => this.props.onSetPushBtnTransferTraining())
        }
        // const start =  moment(Date.now()).startOf('week').format('X'); 
        // const end = moment(Date.now()).endOf('week').format('X');

    }

    pushBtnAdd = () => {
        const {weekInterval} = this.props;
        if(weekInterval){
            let idMaster = this.props.profileStudent.mainUser;
            let chooseWeekdays = [1,2,3,4,5,6,7];
     
            this.props.onGetTheMasterInterval(weekInterval.start, weekInterval.end, idMaster, chooseWeekdays)
             .then(() => this.props.onSetPushBtnAddTraining())
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
                                    <Header findName={this.props.onGetSearchUsers}
                                            authMode={this.props.mode}
                                            searchData={this.props.usersHeaderSearch}
                                            onGoto={this.gotoHandler}
                                            notifications={this.state.notifications}
                                            logout={this.props.onLogout}
                                            isPushBtnTransfer={this.pushBtnTransfer}
                                            isPushBtnAdd={this.pushBtnAdd}
                                            isStudent={(this.props.mode === 'student')}
                                            frozenTraining={this.props.frozenTraining}
                                            disciplinesList={this.props.disciplinesList}
                                            onGetAvailableInterval={this.props.onGetAvailableInterval}
                                            onSetPushTrialTraining={this.props.onSetPushTrialTraining}
                                            onChangeCurrDiscipline={this.props.onChangeCurrDiscipline}
                                            onGoToSchedule={this.onGoToSchedule}
                                            trialTrainingForDisciplines={this.props.trialTrainingForDisciplines}
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
                        </React.Fragment> :
                        <Redirect to='/login'/>
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
        frozenTraining: (state.profilePatient) ? state.profilePatient.frozenTraining : '-',
        usersHeaderSearch: state.loading.usersHeaderSearch,
        weekInterval: state.abonement.weekInterval,
        disciplinesList: state.abonement.disciplines,

        isIn: state.doctor.isEx,
        isUserSet: state.doctor.isUserSetEx,
        isEmergRequsetConfirmed: state.loading.isConfirmed,
        emergVisitId: state.loading.visitId,
        isEmergRequsetReceived: state.loading.isReceived,
        from: state.chatWS.from,
        to: state.chatWS.to,
        idTraining: state.chatWS.idTraining,
        receptionStarts: state.chatWS.receptionStarts,
        isCalling: state.chatWS.isCalling,
        chatStory: state.chatWS.chatStory,
        visitInfo: state.treatments.visitInfo,
        timer: state.chatWS.timer,

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
       
        onSelectPatient: (id) => dispatch(actions.selectPatient(id)),
        getDocTodayInfo: () => dispatch(actions.getDocTodayInfo()),
        getNotifications: (id) => dispatch(actions.getNotifications(id)),
        readNotification: (id) => dispatch(actions.readNotification(id)),
        setOnlineStatus: (id, isOnline) => dispatch(actions.setOnlineStatus(id, isOnline)),
        setChatFromId: (id) => dispatch(actions.setChatFromId(id)),
        setChatToId: (id) => dispatch(actions.setChatToId(id)),
        setIsCallingStatus: (isCalling) => dispatch(actions.setIsCallingStatus(isCalling)),
        setReceptionStatus: (isStart) => dispatch(actions.setReceptionStatus(isStart)),
        setChatStory: (chat) => dispatch(actions.setChatStory(chat)),
        onSelectReception: (id, callback) => dispatch(actions.seletVisit(id, callback)),
        setNewTimer: (timer) => dispatch(actions.setNewTimer(timer)),
        hasNoReviewToFreeApp: ()=>dispatch(actions.hasNoReviewToFreeApp()),
        makeReview: (obj) => dispatch(actions.makeReview(obj)),
        onSetPushBtnTransferTraining: (type) => dispatch(actions.setPushBtnTransferTraining(type)),
        onSetPushBtnAddTraining: () => dispatch(actions.setPushBtnAddTraining()),
        onGetTheMasterInterval: (dateStart, dateEnd, idMaster, weekdays) => dispatch(actions.getTheMasterInterval(dateStart, dateEnd, idMaster, weekdays)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onGetTrainingTrialStatusByDiscipline: (discipline, idStudent) => dispatch(actions.getTrainingTrialStatusByDiscipline(discipline, idStudent)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline) => dispatch(actions.getAvailableInterval(dateStart, dateEnd, weekdays, discipline)),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
