import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";
import ProfilePatient from "../../components/ProfilePatient";
import DiseasesTable from "../../components/DiseasesTable";
import HistoryReceptions from "../../components/HistoryReceptions";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css';
import Spinner from "../../components/Spinner";
import HomeworkList from "../../components/HomeworkList";

class PatientsPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount(){
        this.props.getPatientInfo(this.props.match.params.id);
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

    render(){
        const {diseases = [], treatments = [], infoUser = {}} = this.props.info;
        const info = this.props.info.infoUser;
        if (this.state.loading === true) {
            return <Spinner/>;
        }
        else if (info === null) {
            return(
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <h3>Страница не найдена</h3>
                    <p>Проверьте введённый адрес</p>
                </div>
            )
        }
        else {
        return (
            <Hoc>
                <div>
                    <Row>
                        <Col span={24}>
                            <h1 className='page-title'>Профиль пациента</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} xxl={16} className='section'>
                            <ProfilePatient
                                {...infoUser}
                                onAdd={(id) => this.props.addPatient(id)}
                                id={+this.props.match.params.id}
                                intervals={this.props.intervals}
                                onGetIntervalForDate={this.props.onGetIntervalForDate}
                                availableIntervals={this.props.availableIntervals}
                                onSaveReception={this.props.onSaveReception}
                                onGetAllDocIntervals={this.props.onGetAllDocIntervals}
                            />
                        </Col>
                        <Col xs={24} xxl={8} className='section'>
                            <DiseasesTable data={diseases}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <HistoryReceptions data={this.props.appsBetween}
                                               appsBetweenCount = {this.props.appsBetweenCount}
                                               onGotoChat={(id) => {
                                                   this.props.onSelectTretment(id);
                                                   this.props.history.push('/app/chat')
                                               }}
                                               getApps={this.props.onGetAppointments}
                                               id_user={this.props.match.params.id}
                                               personalPage = {true}
                                               isUser = {this.props.mode === "user"}
                                               onAddFiles = {this.props.onAddFiles}
                                               addConclusion = {this.props.addConclusion}
                                               makeArchiveOfFiles = {this.props.makeArchiveOfFiles}

                            />
                        </Col>
                    </Row>
                </div>
            </Hoc>
        )}
    }
}



const mapStateToProps = state => {
    return {
        info: state.patients.selectedPatientInfo,
        intervals: state.patients.intervals,
        availableIntervals: state.profileDoctor.workIntervals,
        appsBetween: state.treatments.appsBetween,
        appsBetweenCount: state.treatments.appsBetweenCount

    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPatientInfo: (id) => dispatch(actions.getSelectedPatientInfo(id)),
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

export default connect(mapStateToProps, mapDispatchToProps)(PatientsPage);
