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
        const {getSelectors, auth} = this.props;
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

        this.props.onGetPostTrainerTraining(auth.id, start, end);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({loading: true});
            this.props.onGetInfoPatient(nextProps.match.params.id)
                .then(res => this.setState({loading: false}));
        }
    }

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
        const {auth, match} = this.props;
        const {id: idAuth, mode} = auth;
        const {id: idProfile} = match.params;

        if (mode === 'master') this.props.onGetOwnTrainings(idAuth, dateStart, dateEnd);
        else this.props.onGetAllTrainingStudent(idProfile, dateStart, dateEnd);
    };

    render() {
        const { id, avatar, name, frozenTraining,email, phones } = this.props.profileStudent;
        const { bestsex, bestage, bestishomework, bestqualities, bestcomment } = this.props.profileStudent;
        const {trainerTrainings, masterPostTrainings, studentTrainings, match} = this.props;
        const isAdmin = this.props.auth.mode === 'admin';

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
                                <TrainsHistory data={this.props.appsBetween}
                                               appsBetweenCount={this.props.appsBetweenCount}
                                               onGotoChat={(id) => {
                                                   this.props.onSelectTretment(id);
                                                   this.props.history.push('/app/chat')
                                               }}
                                               getApps={this.props.onGetAppointments}
                                               id_user={this.props.match.params.id}
                                               personalPage={true}
                                               isUser={this.props.mode === "student"}
                                               onAddFiles={this.props.onAddFiles}
                                               addConclusion={this.props.addConclusion}
                                               makeArchiveOfFiles={this.props.makeArchiveOfFiles}
                                               selectors={this.state.selectorsValues}
                                               masterTrainings={masterPostTrainings}
                                               onSetHomeworkEdit={this.props.onSetHomeworkEdit}
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
        auth: state.auth,
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
        onSetHomeworkEdit: (idTraining, homework) => dispatch(actions.setHomeworkEdit(idTraining, homework))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);
