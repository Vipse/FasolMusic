import React from 'react';
import {coachRoutes, studentRoutes, menuStudent, menuCoach} from '../../routes'
import {Route, Switch, Redirect} from 'react-router-dom'
import SideNav from '../../components/SideNav'
import Header from '../../components/Header';
import { Modal } from 'antd';
import Adapter from 'webrtc-adapter'

import {connect} from 'react-redux';


import * as actions from '../../store/actions'
import './styles.css';
import 'antd/dist/antd.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../styles/fonts.css';

import Icon from "../../components/Icon";

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

    /*import ab from '../../autobahn.js'*/
    /*componentWillUnmount(){
        closeSocket();
        this.props.setOnlineStatus(this.props.id, false)
    }*/
    /*import {createSocket, closeSocket, register} from './chatWs'*/
    /*runNotificationsWS = () => {
        let that = this;
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
    }*/
    /* runChatWS = () => {
        const {chatProps, setChatFromId, setChatToId, setReceptionStatus, setIsCallingStatus,
            setChatStory, onSelectReception, setNewTimer} = this.props;
        //'wss://appdoc.by:8443/one2one'
        //'wss://localhost:8443/one2one'
        createSocket(
            'wss://appdoc.by:8443/one2one',
            chatProps,
            {
                setChatFromId,
                setChatToId,
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
            get_shortDocInfo: () => this.props.shortDocInfo,
            get_visitInfo: () => this.props.visitInfo,
            get_timer: () => this.props.timer,
            get_history: () => this.props.history,
            }
        );
        register(''+this.props.id, ''/!*+this.props.user_id*!/, this.props.auth.mode);
    }*/

    /*componentDidMount() {
        if(this.props.id){
            this.runNotificationsWS();
            this.runChatWS();
        }
    }*/
    componentDidMount() {
        this.props.auth.mode === "student" ? 
            this.props.onGetInfoPatient(this.props.auth.id) :
            this.props.onGetInfoDoctor(this.props.auth.id);
    }

    componentWillMount() {
        const login = localStorage.getItem('_fasol-user'),
            pass = localStorage.getItem('_fasol-pass');
        (!this.props.id && !this.props.mode && login && pass) &&
        this.props.onLogin({
            userName: login,
            password: pass,
        }, this.props.history);

        this.props.id && (this.props.getDocShortInfo());
    }

    gotoHandler = (id) => {
        this.props.auth.mode === "student" ? this.props.history.push('/app/coach' + id) : this.props.history.push('/app/student' + id)
    };

    onLogoClick = () => {
        (this.props.history.location.pathname !== "/app") && this.props.history.push('/app');
    }

    render() {
        let name, avatar;

        if (this.props.auth.mode === "student" && this.props.profileStudent) {
            name = this.props.profileStudent.name;
            avatar = this.props.profileStudent.avatar;
        } 
        else if (this.props.profileCoach) {
            name = this.props.profileCoach.name;
            avatar = this.props.profileCoach.avatar;
        }

        const {collapsed} = this.state;
        const siderClass = collapsed ? 'main-sidebar collapsed' : 'main-sidebar';
        const wrapperClass = collapsed ? 'main-wrapper collapsed' : 'main-wrapper';
        const isStudent = (this.props.mode === "student");
        
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
                                    menuItems={isStudent ? menuStudent : menuCoach}
                                    isShort={this.state.collapsed}
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
                                    <Header data={this.props.usersHeaderSearch}
                                            notifications={this.state.notifications}
                                            onGoto={this.gotoHandler}
                                            isStudent={isStudent}
                                            findName={(name) => {
                                                this.props.onGetSearchUsers(name)
                                            }}
                                            logout={this.props.onLogout}
                                    />
                                </div>
                                <div className="main-content">
                                    <Switch>
                                        {isStudent ?
                                            studentRoutes.map(route => renderRoutes(route))
                                            :
                                            coachRoutes.map(route => renderRoutes(route))
                                        }
                                        <Route
                                            render={() => (
                                                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                                                    <h3>Страница не найдена</h3>
                                                    <p>Проверьте введённый адрес</p>
                                                </div>
                                            )}
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

        shortDocInfo: state.doctor.shortInfo,
        usersHeaderSearch: state.patients.usersHeaderSearch,
        isIn: state.doctor.isEx,
        isUserSet: state.doctor.isUserSetEx,
        isEmergRequsetConfirmed: state.loading.isConfirmed,
        emergVisitId: state.loading.visitId,
        isEmergRequsetReceived: state.loading.isReceived,
        from: state.chatWS.from,
        to: state.chatWS.to,
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
        getDocShortInfo: () => dispatch(actions.getDocShortInfo()),
        onGetSearchUsers: (name) => dispatch(actions.searchUsers(name)),
        onSelectPatient: (id) => dispatch(actions.selectPatient(id)),
        onAddUser: (id, name) => dispatch(actions.addOrDeleteUserFromSearch(id, name, "add")),
        onDeleteUser: (id, name) => dispatch(actions.addOrDeleteUserFromSearch(id, name, "delete")),
        getDocTodayInfo: () => dispatch(actions.getDocTodayInfo()),
        getNotifications: (id) => dispatch(actions.getNotifications(id)),
        readNotification: (id) => dispatch(actions.readNotification(id)),
        onMakeVisit: (info) => dispatch(actions.setReceptionByPatient(info)),
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

        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
