import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";
import CoachProfile from "../../components/CoachProfile";
import CoachPagePerfectStudent from "../../components/CoachPagePerfectStudent";
import RecordTrainCarousel from "../../components/RecordTrainCarousel";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css';
import Spinner from "../../components/Spinner";

class CoachPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount(){
        this.props.onGetInfoDoctor(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.props.onGetInfoDoctor(nextProps.match.params.id);
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
        const { avatar, name, disciplines } = this.props.profileCoach;
        const { bestsex, bestage, bestishomework, bestqualities } = this.props.profileCoach;
        if (this.state.loading === true) {
            return <Spinner onBackground tip="Загрузка" size="large"/>;
        } else if (!this.props.profileCoach.name) {
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
                            <Col span={11} className='section'>
                                <CoachProfile
                                    img={avatar}
                                    name={name}
                                    discipline={disciplines.length ? disciplines[0].discipline : null}
                                    specialization={disciplines.length ? disciplines[0].specialization : null}
                                    rate={5}
                                    ratingsCount={19}
                                />
                            </Col>
                            <Col span={13}>
                                {/*<RecordTrainCarousel data={this.props.appsBetween}
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
                                />*/}
                                <CoachPagePerfectStudent
                                    sex={bestsex}
                                    age={bestage}
                                    homework={bestishomework}
                                    qualities={bestqualities}
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
        profileCoach: state.profileDoctor,
        //info: state.patients.selectedPatientInfo,
        intervals: state.patients.intervals,
        availableIntervals: state.profileDoctor.workIntervals,
        appsBetween: state.treatments.appsBetween,
        appsBetweenCount: state.treatments.appsBetweenCount
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
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

export default connect(mapStateToProps, mapDispatchToProps)(CoachPage);
