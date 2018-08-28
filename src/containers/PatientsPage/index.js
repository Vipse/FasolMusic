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

class PatientsPage extends React.Component{

    componentDidMount(){
        this.props.getPatientInfo(this.props.match.params.id);
    }

    render(){
        const {diseases = [], treatments = [], infoUser = {}} = this.props.info;
        const info = this.props.info.infoUser;
        if(!info) {
            return(
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <h3>Страница не найдена</h3>
                    <p>Проверьте введённый адрес</p>
                </div>
            )
        } else {
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
                                id={this.props.match.params.id}
                            />
                        </Col>
                        <Col xs={24} xxl={8} className='section'>
                            <DiseasesTable data={diseases}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <HistoryReceptions data={this.props.treatments}
                                               appsBetweenCount = {this.props.appsBetweenCount}
                                               onGotoChat={(id) => this.props.history.push('/chat')}
                                               getApps={this.props.onGetAppointments}
                                               id_user={this.props.match.params.id}
                                               personalPage = {true}
                                               isUser = {this.props.mode === "user"}
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
        appsBetween: state.treatments.appsBetween,
        appsBetweenCount: state.treatments.appsBetweenCount
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPatientInfo: (id) => dispatch(actions.getSelectedPatientInfo(id)),
        addPatient: (id) => dispatch(actions.addPatient(id, '', true)),
        onGetAppointments: (obj) => dispatch(actions.getAppsBetweenDocAndUser(obj)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientsPage);