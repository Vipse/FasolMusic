import React from 'react'

import Hoc from '../../hoc'
import './styles.css'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPersonalProfile from "../../components/CoachPersonalProfile";
import StudentPersonalProfile from "../../components/StudentPersonalProfile";

class PersonalInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.props.auth.mode === "student" ? this.props.onGetInfoPatient(this.props.auth.id) :
        this.props.onGetInfoDoctor(this.props.auth.id);
    };

    render() {
        let isUser = this.props.auth.mode === "student";
        return (
            <Hoc>
                {isUser ? (
                    <StudentPersonalProfile
                        profileStudent={this.props.profileStudent}
                        onSubmit={this.props.onSaveUserEdit}
                        onDeleteAvatar={this.props.onDeleteAvatar}
                        onUploadFile={this.props.uploadFile}
                    />) : (
                    <CoachPersonalProfile
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
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        onDeleteAvatar: (id) => dispatch(actions.deleteAvatar(id)),
        uploadFile: (file) => dispatch(actions.uploadFile(file)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfo);
