import React from 'react'

import './styles.css'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPersonalProfile from "../../components/CoachPersonalProfile";
import StudentPersonalProfile from "../../components/StudentPersonalProfile";
import {message} from "antd";
import Spinner from "../../components/Spinner";

class PersonalInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingData: true
        }
    }

    componentDidMount() {
        (this.props.auth.mode === "student" ? this.props.onGetInfoPatient :
            this.props.onGetInfoDoctor)(this.props.auth.id)
            .then(res => {
                this.setState({loadingData: false});
                if (res && res.data.error)
                    message.error("Произошла ошибка при загрузке данных, попробуйте ещё раз");
            });
    };

    render() {
        const isStudent = this.props.auth.mode === "student";
        const {loadingData} = this.state;
        return (
            loadingData ? <Spinner tip="Загрузка" size="large"/> :
                <Hoc>
                    {isStudent ? (
                        <StudentPersonalProfile
                            profileStudent={this.props.profileStudent}
                            onSubmit={this.props.onSaveUserEdit}
                            onSocialConnect={this.props.connectionToSocialNetwork}
                            getMultipleSelectors={this.props.getMultipleSelectors}
                            selectors={this.props.selectors}
                            uploadFile={this.props.uploadFile}
                            onChangePassword={this.props.onChangePassword}
                        />) : (
                        <CoachPersonalProfile
                            profileCoach={this.props.profileCoach}
                            onSubmit={this.props.onSaveUserEdit}
                            onSocialConnect={this.props.connectionToSocialNetwork}
                            getMultipleSelectors={this.props.getMultipleSelectors}
                            selectors={this.props.selectors}
                            uploadFile={this.props.uploadFile}
                            onChangePassword={this.props.onChangePassword}
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
        selectors: state.loading.selectors,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data)),
        connectionToSocialNetwork: (idProfile, idSocial, networkName) => dispatch(actions.connectionToSocialNetwork(idProfile, idSocial, networkName)),
        getMultipleSelectors: (name) => dispatch(actions.getMultipleSelectors(name)),
        onChangePassword: (id, newPass) => dispatch(actions.changePassword(id, newPass)),
        uploadFile: (file) => dispatch(actions.uploadFile(file))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfo);
