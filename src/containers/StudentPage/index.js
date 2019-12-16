import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";
import StudentProfile from "../../components/StudentProfile";
import StudentPagePerfectCoach from "../../components/StudentPagePerfectCoach";
import FrozenTrainingChanger from "../../components/FrozenTrainingChanger";
import TrainsHistory from "../../components/TrainsHistory";
import RecordTrainCarousel from "../../components/RecordTrainCarousel";
import BookingClearButton from "../../components/ClearBooking";


import * as actions from '../../store/actions'

import './styles.css';
import Spinner from "../../components/Spinner";
import {getNameFromObjArr, getNamesFromObjArr} from "../../helpers/getSelectorsCustomData";
import moment from "moment";
import {Modal} from "antd";

class StudentPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            selectorsValues: {},
            currentWeekTrainings: {}
        }
    }

    componentDidMount(){
        const {getSelectors, id} = this.props;
        const selectorsNames = ['interests', 'goal', 'discipline', 'qualities', 'styles', 'professions', 'day'];

        selectorsNames.forEach((name) => {
            getSelectors(name)
                .then(res => this.setState({
                    selectorsValues: {
                        ...this.state.selectorsValues,
                        [name + "List"]: res.data
                    }}))
                .catch(err => console.log(err))
        });
        this.props.onGetStudentBalance(this.props.match.params.id);
        this.props.onGetInfoPatient(this.props.match.params.id)
            .then(res => this.setState({loading: false}));

        const start = null;
        const end = moment().format('X');

        this.props.onGetPostTrainerTraining(id, start, end);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({loading: true});
            this.props.onGetStudentBalance(nextProps.match.params.id);
            this.props.onGetInfoPatient(nextProps.match.params.id)
                .then(res => this.setState({loading: false}));
        }

        if (nextProps.trainerTrainings !== this.props.trainerTrainings && !this.props.trainerTrainings) {
            this.setState({currentWeekTrainings: nextProps.trainerTrainings})
        }
    }

    goToChat = (idTo, idTraining, interlocutorName, interlocutorAvatar, beginTime, isComplete, isTrial = false) => {
        this.props.onSetChatToId(idTo);
        this.props.onSetChatInterlocutorInfo(interlocutorName, interlocutorAvatar);
        this.props.onSetChatTrainingId(idTraining);
        this.props.onSetBeginTime(beginTime);
        this.props.onSetIsCompleteStatus(isComplete);
        this.props.onSetIsTrialStatus(isTrial);
        this.props.history.push('/app/chat');
    };

    getNearestTrain = () => {
        const {id} = this.props;
        const {currentWeekTrainings} = this.state;

        for (let day in currentWeekTrainings)
            if (moment(+day).date() >= moment().date()) {
                for (let train in currentWeekTrainings[day]) {
                    let trainInfo = currentWeekTrainings[day][train].allInfo;
                    if (trainInfo && +trainInfo.idMaster === +id
                        && moment(+trainInfo.date * 1000).hours() >= moment().hours()) {
                        return trainInfo;
                    }
                }
            }
        return null;
    };

    goToNearestChat = () => {
        const {profileStudent: {id, name, avatar}} = this.props;
        let nearestTrain = this.getNearestTrain();

        if (nearestTrain) {
            const {idTraining, date, isComplete, trial} = nearestTrain;
            this.goToChat(id, idTraining, name, avatar, +date * 1000, isComplete, trial);
        }
        else Modal.warning({
            title: 'Нет занятий',
            width: '500px',
            className: 'quick-modal',
            content: 'На текущей неделе нет занятий с этим студентом',
            maskClosable: true
        });
    };

    goToCoachProfile = (idCoach) => {
        let link = "/app/coach";
        this.props.history.push(link + idCoach);
    };

    fetchStudentInfo = (id) => {
        this.props.onGetInfoPatient(id);
        this.props.onGetMasterList();
        this.props.onGetStudentBalance(id);
        this.props.onGetUseFrozenTraining(id);
        this.props.onGetSubscriptionsByStudentId(id);
        this.props.onGetDisciplineCommunication(id);
    }

    goToStudentSchedule = () => {
        const {id} = this.props.profileStudent;
        if(id){
            this.props.onGetInfoScheduleStudent(id).then(() => this.props.history.push('/app/schedule'+id))
            this.fetchStudentInfo(id)
        } 
    }

    handleTrainModal = (e, redirectable, isAdmin, item) => {
        e.preventDefault();
        if (redirectable && isAdmin) this.goToCoachProfile(item.idMaster);
        else Modal.warning({
            title: 'Изменение расписания',
            width: '500px',
            className: 'quick-modal',
            content: 'Вы находитесь в профиле студента! Изменения вашего расписания осуществляется в разделе “График работы”.',
            maskClosable: true,
            okText: 'Перейти в график работы',
            onOk: () => this.props.history.push('/app/schedule')
        });
    };

    prepareStudentOwnTrains = (trains) => {
        let obj = {};

        if (trains) {
            trains.forEach((train) => {
                let dateStart = moment(+train.start * 1000).startOf('day').format('X');
                let hourStart = moment(+train.start * 1000).startOf('hour').format('X');
                let allInfo = {
                    date: train.start,
                    idStudent: train.idStudent,
                    idMaster: train.idMaster,
                    idTraining: train.id,
                    isBooking: train.isBooking,
                    isComplete: train.isComplete,
                    idSubscription: train.idSubscription,
                    fio: train.fioMaster
                };

                if (obj.hasOwnProperty(dateStart)) obj[dateStart][hourStart] = {allInfo};
                else {
                    obj[dateStart] = {};
                    obj[dateStart][hourStart] = {allInfo};
                }
            });
        }
        obj.dateStart = trains.dateStart;

        return obj;
    };

    changeFrozenBalance = (frozenTrainingCount) => {
        return this.props.onSaveUserEdit({
            id: this.props.match.params.id,
            frozenTraining: frozenTrainingCount
        });
    };

    getDisciplinesString = () => {
        const {disciplines} = this.props.profileStudent;
        if (disciplines && disciplines.length)
            return disciplines.map(item => getNameFromObjArr(item.discipline)).join(', ');
        else return '';
    };

    getLevelsString = () => {
        const {disciplines} = this.props.profileStudent;
        if (disciplines && disciplines.length)
            return disciplines.map(item => item.level).join(', ');
        else return '';
    };

    getSchedule = (dateStart, dateEnd) => {
        const {id: idAuth, match, mode} = this.props;
        const {id: idProfile} = match.params;
        this.props.onGetAllTrainingStudent(idProfile, dateStart, dateEnd);
    };

    clearAllBookingTrainings = (id) => {  
       return this.props.onClearAllBookingTrainings(id);    
    }

    render() {
        const { id, avatar, name, frozenTraining,email, phones } = this.props.profileStudent;
        const { bestsex, bestage, bestishomework, bestqualities, bestcomment } = this.props.profileStudent;
        const {startDate, studentTrainings, match,
            trainings, loadingPastTrainsList, isRequestFailed, endAchieved, studentBalance} = this.props;
        const isAdmin = this.props.mode === 'admin';

        if (this.state.loading === true) {
            return <Spinner tip="Загрузка" size="large"/>;
        } else if (id !== this.props.match.params.id) {
            return (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                    <h3>Страница студента не найдена</h3>
                    <p>Проверьте введённый адрес</p>
                </div>
            )
        } else {
            return (
                <React.Fragment>
                    <div className="student-page">
                        <Row type="flex" gutter={32}>
                            {isAdmin && <Col span={24}>
                                <RecordTrainCarousel
                                    onGetIntervals={this.getSchedule} 
                                    trainerTrainings = {this.prepareStudentOwnTrains(studentTrainings)}
                                    studentID={match.params.id}
                                    handleTrainModal={this.handleTrainModal}
                                    isAdmin={isAdmin}
                                    isStudentPage={true}
                                    startDate={startDate}
                                />
                            </Col>}
                            <Col span={10} className='section'>
                                <StudentProfile
                                    img={avatar}
                                    name={name}
                                    email={email}
                                    phones={phones}
                                    discipline={this.getDisciplinesString()}
                                    level={this.getLevelsString()}
                                    paidTrainingsCount={studentBalance}
                                    isAdmin={isAdmin}
                                    onGoToChat={this.goToNearestChat}
                                    goToStudentSchedule={this.goToStudentSchedule}
                                />
                                <StudentPagePerfectCoach
                                    sex={bestsex}
                                    age={bestage}
                                    homework={bestishomework}
                                    qualities={getNamesFromObjArr(bestqualities)}
                                    comment={bestcomment}
                                />
                                
                            </Col>
                            <Col span={14}>
                                <TrainsHistory onGotoChat={this.goToChat}
                                               goToProfile={this.goToCoachProfile}
                                               id={id}
                                               trainings={trainings}
                                               loading={loadingPastTrainsList}
                                               isRequestFailed={isRequestFailed}
                                               endAchieved={endAchieved}
                                               selectors={this.state.selectorsValues}
                                               isUser={this.props.mode === "student"}
                                               onSetHomeworkEdit={this.props.onSetHomeworkEdit}
                                               onGetTrainingHistoryList={this.props.onGetTrainingHistoryList}
                                               onResetTrainingHistoryList={this.props.onResetTrainingHistoryList}
                                               onChangeRequestMaxAmount={this.props.onChangeRequestMaxAmount}
                                />
                                {!isAdmin && <RecordTrainCarousel
                                    onGetIntervals={this.getSchedule} 
                                    trainerTrainings = {this.prepareStudentOwnTrains(studentTrainings)}
                                    studentID={match.params.id}
                                    handleTrainModal={this.handleTrainModal}
                                    isAdmin={isAdmin}
                                    isStudentPage={true}
                                    startDate={startDate}
                                />}
                                {isAdmin && <FrozenTrainingChanger
                                    frozenCount={frozenTraining}
                                    onSaveFrozenBalance={this.changeFrozenBalance}
                                />}
                                {isAdmin && <BookingClearButton
                                    id={id}
                                    clearAllBookingTrainings={this.clearAllBookingTrainings}
                                    getSchedule={this.getSchedule}
                                />}
                            </Col>
                        </Row>
                    </div>
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        id: state.auth.id,
        mode: state.auth.mode,
        startDate: state.training.startDate,

        trainings: state.homework.trainings,
        loadingPastTrainsList: state.homework.loading,
        isRequestFailed: state.homework.isRequestFailed,
        endAchieved: state.homework.endAchieved,
        profileStudent: state.profileStudent,
        trainerTrainings: state.profileCoach.trainerTrainings,
        masterPostTrainings: state.trainer.postTraining,
        studentTrainings: state.training.studentTrainings,
        studentBalance: state.abonement.studentBalance
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onGetPostTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getPostTrainerTraining(idMaster, dateMin, dateMax)),
        onGetAllTrainingStudent: (idStudent, dateMin, dateMax) => dispatch(actions.getAllTrainingStudent(idStudent, dateMin, dateMax)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data, 'student')),
        onSetHomeworkEdit: (idTraining, homework) => dispatch(actions.setHomeworkEdit(idTraining, homework)),
        onGetTrainingHistoryList: (idUser, search) => dispatch(actions.getTrainingHistoryList(idUser, search)),
        onChangeRequestMaxAmount: (amount) => dispatch(actions.changeRequestMaxAmount(amount)),
        onResetTrainingHistoryList: () => dispatch(actions.resetTrainingHistoryList()),
        onGetStudentBalance: (idStudent) => dispatch(actions.getStudentBalance(idStudent)),

        onSetChatToId: (id) => dispatch(actions.setChatToId(id)),
        onSetChatTrainingId: (id) => dispatch(actions.setChatTrainingId(id)),
        onSetChatInterlocutorInfo: (interlocutorName, interlocutorAvatar) => dispatch(actions.setChatInterlocutorInfo(interlocutorName, interlocutorAvatar)),
        onSetBeginTime: (beginTime) => dispatch(actions.setBeginTime(beginTime)),
        onSetIsCompleteStatus: (isComplete) => dispatch(actions.setIsCompleteStatus(isComplete)),
        onSetIsTrialStatus: (isTrial) => dispatch(actions.setIsTrialStatus(isTrial)),
        onGetInfoScheduleStudent: (id) => dispatch(actions.getInfoScheduleStudent(id)),
        onGetMasterList: (allInfo) => dispatch(actions.getMasterList(allInfo)),
        onGetUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),
        onGetSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),
        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
        onClearAllBookingTrainings: (idStudent) => dispatch(actions.clearAllBookingTrainings(idStudent)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);
