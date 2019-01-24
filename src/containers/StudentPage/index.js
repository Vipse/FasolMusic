import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";
import StudentProfile from "../../components/StudentProfile";
import StudentPagePerfectCoach from "../../components/StudentPagePerfectCoach";
import TrainsHistory from "../../components/TrainsHistory";
import RecordTrainCarousel from "../../components/RecordTrainCarousel";

import Hoc from '../../hoc'
import * as actions from '../../store/actions'

import './styles.css';
import Spinner from "../../components/Spinner";
import {getNameFromObjArr, getNamesFromObjArr} from "../../helpers/getSelectorsCustomData";

class StudentPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            selectorsValues: {}
        }
    }

    componentDidMount(){
        const {getSelectors} = this.props;
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
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({loading: true});
            this.props.onGetInfoPatient(nextProps.match.params.id)
                .then(res => this.setState({loading: false}));
        }
    }

    getDisciplinesList = () => {
        const {disciplines} = this.props.profileStudent;
        if (disciplines.length)
            return disciplines.map(item => getNameFromObjArr(item.discipline))
    };

    getLevelsList = () => {
        const {disciplines} = this.props.profileStudent;
        if (disciplines.length)
            return disciplines.map(item => item.level)
    };

    getSchedule = (dateStart, dateEnd) => {
        const idVisitor = this.props.auth.id;
        this.props.onGetOwnTrainings(idVisitor, dateStart, dateEnd);
    };

    render() {
        const { id, avatar, name } = this.props.profileStudent;
        const { bestsex, bestage, bestishomework, bestqualities, bestcomment } = this.props.profileStudent;
        const {trainerTrainings, match} = this.props;
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
                                    discipline={this.getDisciplinesList().join(', ')}
                                    level={this.getLevelsList().join(', ')}
                                    paidTrainingsCount={0}
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
                                />
                                <RecordTrainCarousel
                                    onGetIntervals={this.getSchedule}
                                    trainerTrainings={trainerTrainings}
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
        trainerTrainings: state.profileDoctor.trainerTrainings
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onGetOwnTrainings: (id, weekStart, weekEnd) => dispatch(actions.getTrainerTrainings(id, weekStart, weekEnd))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);
