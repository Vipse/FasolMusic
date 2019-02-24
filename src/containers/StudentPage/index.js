import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";
import StudentProfile from "../../components/StudentProfile";
import StudentPagePerfectCoach from "../../components/StudentPagePerfectCoach";
import FrozenTrainingChanger from "../../components/FrozenTrainingChanger";
import TrainsHistory from "../../components/TrainsHistory";
import RecordTrainCarousel from "../../components/RecordTrainCarousel";

import Hoc from '../../hoc'
import * as actions from '../../store/actions'

import './styles.css';
import Spinner from "../../components/Spinner";
import {getNameFromObjArr, getNamesFromObjArr} from "../../helpers/getSelectorsCustomData";
import moment from "moment";

class StudentPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            selectorsValues: {}
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

        this.props.onGetInfoPatient(this.props.match.params.id)
            .then(res => this.setState({loading: false}));

        const start = null;
        const end = moment().format('X');

        this.props.onGetPostTrainerTraining(id, start, end);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({loading: true});
            this.props.onGetInfoPatient(nextProps.match.params.id)
                .then(res => this.setState({loading: false}));
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

    goToHandler = (id) => {
        let link = this.props.mode === "student" ? "/app/coach" : "/app/student";
        this.props.history.push(link + id);
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
                    idTraining: train.id,
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

        if (mode === 'master') this.props.onGetOwnTrainings(idAuth, dateStart, dateEnd);
        else this.props.onGetAllTrainingStudent(idProfile, dateStart, dateEnd);
    };

    render() {
        const { id, avatar, name, frozenTraining,email, phones } = this.props.profileStudent;
        const { bestsex, bestage, bestishomework, bestqualities, bestcomment } = this.props.profileStudent;
        const {trainerTrainings, studentTrainings, match,
            trainings, loadingPastTrainsList, isRequestFailed, endAchieved} = this.props;
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
                <Hoc>
                    <div className="student-page">
                        <Row type="flex" gutter={32}>
                            <Col span={10} className='section'>
                                <StudentProfile
                                    img={avatar}
                                    name={name}
                                    email={email}
                                    phones={phones}
                                    discipline={this.getDisciplinesString()}
                                    level={this.getLevelsString()}
                                    paidTrainingsCount={0}
                                />
                                <StudentPagePerfectCoach
                                    sex={bestsex}
                                    age={bestage}
                                    homework={bestishomework}
                                    qualities={getNamesFromObjArr(bestqualities)}
                                    comment={bestcomment}
                                />
                                {isAdmin && <FrozenTrainingChanger
                                    frozenCount={frozenTraining}
                                    onSaveFrozenBalance={this.changeFrozenBalance}
                                />}
                            </Col>
                            <Col span={14}>
                                <TrainsHistory onGotoChat={this.goToChat}
                                               goToProfile={this.goToHandler}
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
                                <RecordTrainCarousel
                                    onGetIntervals={this.getSchedule}
                                    trainerTrainings={isAdmin ? this.prepareStudentOwnTrains(studentTrainings) : trainerTrainings}
                                    studentID={match.params.id}
                                    isAdmin={isAdmin}
                                    isStudentPage={true}
                                />
                            </Col>
                        </Row>
                    </div>
                </Hoc>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        id: state.auth.id,
        mode: state.auth.mode,
        trainings: state.homework.trainings,
        loadingPastTrainsList: state.homework.loading,
        isRequestFailed: state.homework.isRequestFailed,
        endAchieved: state.homework.endAchieved,
        profileStudent: state.profilePatient,
        trainerTrainings: state.profileDoctor.trainerTrainings,
        masterPostTrainings: state.trainer.postTraining,
        studentTrainings: state.training.studentTrainings
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onGetOwnTrainings: (id, weekStart, weekEnd) => dispatch(actions.getTrainerTrainings(id, weekStart, weekEnd)),
        onGetPostTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getPostTrainerTraining(idMaster, dateMin, dateMax)),
        onGetAllTrainingStudent: (idStudent, dateMin, dateMax) => dispatch(actions.getAllTrainingStudent(idStudent, dateMin, dateMax)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data, 'student')),
        onSetHomeworkEdit: (idTraining, homework) => dispatch(actions.setHomeworkEdit(idTraining, homework)),
        onGetTrainingHistoryList: (idUser, search) => dispatch(actions.getTrainingHistoryList(idUser, search)),
        onChangeRequestMaxAmount: (amount) => dispatch(actions.changeRequestMaxAmount(amount)),
        onResetTrainingHistoryList: () => dispatch(actions.resetTrainingHistoryList()),

        onSetChatToId: (id) => dispatch(actions.setChatToId(id)),
        onSetChatTrainingId: (id) => dispatch(actions.setChatTrainingId(id)),
        onSetChatInterlocutorInfo: (interlocutorName, interlocutorAvatar) => dispatch(actions.setChatInterlocutorInfo(interlocutorName, interlocutorAvatar)),
        onSetBeginTime: (beginTime) => dispatch(actions.setBeginTime(beginTime)),
        onSetIsCompleteStatus: (isComplete) => dispatch(actions.setIsCompleteStatus(isComplete)),
        onSetIsTrialStatus: (isTrial) => dispatch(actions.setIsTrialStatus(isTrial)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);
