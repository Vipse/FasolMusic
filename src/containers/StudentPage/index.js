import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";
import StudentProfile from "../../components/StudentProfile";
import StudentPagePerfectCoach from "../../components/StudentPagePerfectCoach";
import TrainsHistory from "../../components/TrainsHistory";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css';
import Spinner from "../../components/Spinner";

class StudentPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount(){
        this.props.onGetInfoPatient(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.props.getPatientInfo(nextProps.match.params.id);
            this.setState({
                loading: true
            });
        }
        else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const { avatar, name, disciplines } = this.props.profileStudent;
        const { bestsex, bestage, bestishomework, bestqualities } = this.props.profileStudent;
        if (this.state.loading === true) {
            return <Spinner onBackground tip="Загрузка" size="large"/>;
        } else if (!this.props.profileStudent.name) {
            return (
                <div style={{textAlign: 'center', padding: '40px 20px', color: '#fff'}}>
                    <h3 style={{color: '#fff'}}>Страница не найдена</h3>
                    <p>Проверьте введённый адрес</p>
                </div>
            )
        } else {
            return (
                <Hoc>
                    <div>
                        <Row type="flex" gutter={32}>
                            <Col span={10} className='section'>
                                <StudentProfile
                                    img={avatar}
                                    name={name}
                                    discipline={disciplines.length ? disciplines[0].discipline : null}
                                    level={disciplines.length ? disciplines[0].level : null}
                                    paidTrainingsCount={0}
                                />
                                <StudentPagePerfectCoach
                                    sex={bestsex}
                                    age={bestage}
                                    homework={bestishomework}
                                    qualities={bestqualities}
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
        profileStudent: state.profilePatient,
        //info: state.patients.selectedPatientInfo,
        intervals: state.patients.intervals,
        availableIntervals: state.profileDoctor.workIntervals,
        appsBetween: state.treatments.appsBetween,
        appsBetweenCount: state.treatments.appsBetweenCount
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        //getPatientInfo: (id) => dispatch(actions.getSelectedPatientInfo(id)),
        onAddFiles: (file, id) => dispatch(actions.addFileToApp(file, id)),
        addPatient: (id) => dispatch(actions.addPatient(id, '', true)),
        onGetIntervalForDate: (beginDay, endDay) => dispatch(actions.getDateIntervalWithoutMakingApp(beginDay, endDay)),
        onGetAllDocIntervals: (id) => dispatch(actions.getAllDocIntervals(id)),
        onSaveReception: (reception) => dispatch(actions.setReception(reception)),
        onGetAppointments: (obj) => dispatch(actions.getAppsBetweenDocAndUser(obj)),
        onSelectTretment: (id) => dispatch(actions.selectTreatment(id)),
        addConclusion:(id_zap, file) => dispatch(actions.uploadConclusion(id_zap, file)),
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);
