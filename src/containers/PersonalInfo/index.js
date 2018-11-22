import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";

import Hoc from '../../hoc'
import './styles.css'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import{compileToClientPatient, compileToServerPatient} from './compilerPatient'
import PatientAccardionContact from "../../components/PatientAccardionContact";
import PatientAccardionDisease from "../../components/PatientAccardionDisease";
import CoachPersonalProfile from "../../components/CoachPersonalProfile";
import PersonalContact from "../../components/PersonalContact";
import StudentPersonalProfile from "../../components/StudentPersonalProfile";

class PersonalInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    componentDidMount(){
        this.props.auth.mode === "student" ? this.props.onGetInfoPatient(this.props.auth.id) :
        this.props.onGetInfoDoctor(this.props.auth.id);
    };

    onVisible = () => {
      this.setState({visible:false}) ;
    };

    onSubmit = (submitData) => {
        this.props.onSendNewInfoDoctor(submitData);
        this.setState({visible:true});
    };

    onSubmitPatient = (profilePatient) => {
        profilePatient = compileToServerPatient(profilePatient, this.props.auth.id);
        return this.props.onSendNewInfoPatient(profilePatient);
    };

    onSubmitPasswordPatient = (oldPass, newPass) => {
        return this.props.onSendNewPasswordPatient(oldPass, newPass, this.props.auth.id);
    };

    render() {
        let isUser = this.props.auth.mode === "student";
        return (
            <Hoc>
                {isUser ? (
                    <StudentPersonalProfile
                        onSubmitPassword={this.onSubmitPasswordPatient}
                        profileStudent={this.props.profileStudent}
                        onSubmit={this.props.onSaveUserEdit}
                        onDeleteAvatar={this.props.onDeleteAvatar}
                        onUploadFile={this.props.uploadFile}
                    />) : (
                    <CoachPersonalProfile
                        onSubmitPassword={this.onSubmitPasswordPatient}
                        profileCoach={this.props.profileCoach}
                        onSubmit={this.props.onSaveUserEdit}
                        onDeleteAvatar={this.props.onDeleteAvatar}
                        onUploadFile={this.props.uploadFile}
                    />)}
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        profileCoach: state.profileDoctor,
        profileStudent: state.profilePatient,
        auth: state.auth,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
        onSendNewInfoDoctor: (info) => dispatch(actions.sendNewInfoDoctor(info)),
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        onSendNewInfoPatient: (info) => dispatch(actions.sendNewInfoPatient(info)),
        onSendNewPasswordPatient: (oldPass, newPass, id) => dispatch(actions.sendNewPasswordPatient(oldPass, newPass, id)),
        onDeleteAvatar: (id) => dispatch(actions.deleteAvatar(id)),
        uploadFile: (file) => dispatch(actions.uploadFile(file)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfo);
/*

export default PersonalInfo;*/
