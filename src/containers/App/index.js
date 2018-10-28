import React  from 'react';
import {docRoutes, patientRoutes, menuDoc, menuPatient} from '../../routes'
import { Route, Switch, Redirect } from 'react-router-dom'
import Hoc from '../../hoc'
import SideNav from '../../components/SideNav'
import Header from "../../components/Header";
import { Modal } from 'antd';

import {connect} from 'react-redux';
import {createSocket, closeSocket,register} from './chatWs'

import * as actions from '../../store/actions'
import './styles.css';
import 'antd/dist/antd.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../styles/fonts.css';
import ab from '../../autobahn.js'
import Icon from "../../components/Icon";
import ReportBugModal from "../../components/ReportBugModal";
import ReviewsModal from "../../components/ReviewsModal";

const renderRoutes = ({ path, component, exact }) => (
    <Route key={path} exact={exact} path={path} component={component} />
);


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: true,
            notifications: [],
            bugfixVisible: false,
            mustLeaveReview: false
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    componentWillUnmount(){
        closeSocket();
        this.props.setOnlineStatus(this.props.id, false)
    }

    runNotificationsWS = () => {
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
    }

    runChatWS = () => {
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
        register(''+this.props.id, ''/*+this.props.user_id*/, this.props.auth.mode);
    }

    componentDidMount() {
        if(this.props.id){
            this.runNotificationsWS();
            this.runChatWS();
            this.props.getEmergencyAvailability();
            if(this.props.auth.mode === "user") {
                this.props.hasNoReviewToFreeApp().then(res=>{
                    if(res.result.length) {
                        this.setState({mustLeaveReview: true, infoForReview:{
                                id_doc: res.result[0].id_doc,
                                id_zap: res.result[0].idMA
                            }})
                    }
                })
            }
        }

    }

    componentWillMount(){
        const login = localStorage.getItem('_appdoc-user'),
                pass = localStorage.getItem('_appdoc-pass');
        (!this.props.id && !this.props.mode && login && pass) &&
        this.props.onLogin({
            userName: login,
            password: pass,
        }, this.props.history);

        this.props.id && (this.props.getDocShortInfo());
    }

    makeReview = (obj) => {
        return this.props.makeReview(obj).then( res =>  res)
    }

    gotoHandler = (id) => {
        this.props.auth.mode !== "user" ? this.props.history.push('/app/patient'+id) : this.props.history.push('/app/doctor'+id)
    };

    logoClick = () => {
        (this.props.history.location.pathname !== "/app") && this.props.history.push('/app');
    }

    render() {
        const {collapsed} = this.state;
        const  siderClass = collapsed ? 'main-sidebar collapsed' : 'main-sidebar';
        const  wrapperClass = collapsed ? 'main-wrapper collapsed' : 'main-wrapper';
        const isUser = (this.props.mode === "user");
        if (this.state.mustLeaveReview) {
            return <ReviewsModal
                visible={this.state.mustLeaveReview}
                info={this.state.infoForReview}
                onSubmit={this.makeReview}
                mustLeave={this.state.mustLeaveReview}
                refresh={()=>this.setState({mustLeaveReview: false})}
            />
        }
        return (
            <div className="main">
            {
                this.props.id ?

                (<Hoc>
                    <div className={siderClass}>

                    <SideNav {...this.props.shortDocInfo}
                            rateValue={+(this.props.shortDocInfo.rateValue)}
                            onClick={this.toggle}
                            onLogoClick={this.logoClick}
                            menuItems={isUser ? menuPatient : menuDoc}
                            isUser={isUser}
                            isShort={this.state.collapsed}/>

                </div>
                <div className={wrapperClass}>
                <div style={{position: 'absolute', zIndex: 999}}></div>
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
                                isUser={isUser}
                                onAdd={(id, name) => {
                                    this.props.onAddUser(id, name);
                                }}
                                onDelete={(id, name) => {
                                    this.props.onDeleteUser(id, name);
                                }}
                                findName={(name) => {
                                    this.props.onGetSearchUsers(name)
                                }}
                                getNotifId = {id => this.props.readNotification(id)}
                                getNotifications={() =>  this.props.getNotifications(this.props.id)}
                                onChange={(flag) => this.props.switchExInterval(flag)}
                                checked={this.props.isIn}
                                disabled={this.props.isIn && !this.props.isUserSet}
                                logout={this.props.onLogout}
                                getFreeVisitIntervals = {(spec) => this.props.onGetFreeVisitsBySpeciality(spec)}
                                freeVisitsIntervals = {this.props.freeVisitsIntervals ? this.props.freeVisitsIntervals : []}
                                onMakeVisit = {(obj)=>this.props.onMakeVisit(obj)}
                                emergencyAvailable={this.props.emergencyAvailable}

                        />
                    </div>
                    <div className="main-content">
                        <Switch>
                            {isUser ?
                                patientRoutes.map(route => renderRoutes(route)) : docRoutes.map(route => renderRoutes(route))
                            }
                            <Route
                                render ={() => (
                                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                        <h3>Страница не найдена</h3>
                                        <p>Проверьте введённый адрес</p>
                                    </div>
                                )}
                            />
                        </Switch>
                    </div>
                </div>
           
                    { this.state.isExtrActual && this.props.isIn
                        && <button className='emergencyCall' onClick={this.props.docEmergancyCallSend}>
                            Запрос на экстренный вызов</button> }
                    {
                        (this.props.isEmergRequsetReceived)
                            && (this.props.isEmergRequsetConfirmed ?
                                (
                                    this.props.docEmergancyCallReceivedMark(),
                                    this.props.onSelectReception(this.props.emergVisitId),
                                    this.props.history.push('/app/chat')
                                ) :
                                Modal.error({
                                    title: 'Запись не осуществлена',
                                    content: 'Экстренный вызов не найден',
                                    onOk: this.props.docEmergancyCallReceivedMark,
                                }))
                    }
                    <ReportBugModal
                        visible={this.state.bugfixVisible}
                        onCancel={()=>this.setState({bugfixVisible: false})}
                        onSend={this.props.reportBug}
                    />
                </Hoc>)
            : (
                <Redirect to='/login'/>
            )
            }
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        auth: state.auth,
        id: state.auth.id,
        mode: state.auth.mode,
        shortDocInfo: state.doctor.shortInfo,
        usersHeaderSearch: state.patients.usersHeaderSearch,
        isIn: state.doctor.isEx,
        emergencyAvailable: state.doctor.emergencyAvailable,
        isUserSet: state.doctor.isUserSetEx,
        freeVisitsIntervals: state.schedules.freeVisitsIntervals,

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
        setExInfo: ({isIn, isUserSet}) => dispatch(actions.setExIntervalInfo(isIn, isUserSet)),
        switchExInterval: (flag) => dispatch(actions.switchExInterval(flag)),
        onGetFreeVisitsBySpeciality: (spec) => dispatch(actions.getFreeVisitsBySpec(spec)),
        onMakeVisit: (info)=> dispatch(actions.setReceptionByPatient(info)),
        setOnlineStatus: (id,isOnline) => dispatch(actions.setOnlineStatus(id,isOnline)),
        getEmergencyAvailability: () => dispatch(actions.getEmergencyAvailability()),

        docEmergancyCallSend: () => dispatch(actions.docEmergancyCallSend()),
        docEmergancyCallReceivedMark: () => dispatch(actions.docEmergancyCallReceivedMark()),

        setChatFromId: (id) => dispatch(actions.setChatFromId(id)),
        setChatToId: (id) => dispatch(actions.setChatToId(id)),
        setIsCallingStatus: (isCalling) => dispatch(actions.setIsCallingStatus(isCalling)),
        setReceptionStatus: (isStart) => dispatch(actions.setReceptionStatus(isStart)),
        setChatStory: (chat) => dispatch(actions.setChatStory(chat)),
        onSelectReception: (id, callback) => dispatch(actions.seletVisit(id, callback)),
        setNewTimer: (timer) => dispatch(actions.setNewTimer(timer)),
        reportBug: (message, href) => dispatch(actions.reportBug(message, href)),
        hasNoReviewToFreeApp: ()=>dispatch(actions.hasNoReviewToFreeApp()),
        makeReview: (obj) => dispatch(actions.makeReview(obj)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
