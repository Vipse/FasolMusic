import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import {Form, message} from "antd";
import TextArea from "../TextArea";
import Row from "../Row";
import Col from "../Col";
import WarningModal from "../WarningModal";
import CoachPersonalChangePassword from "../CoachPersonalChangePassword";
import CoachPersonalNotifications from "../CoachPersonalNotifications";
import StudentPersonalData from "../StudentPersonalData";

class StudentPersonalProfile extends React.Component{

    constructor() {
        super();
        this.state = {};
    }

    render() {
        const profile = this.props.profileStudent;
        return (
            <div className="personal-student-items">
                <Row type="flex" gutter={32}>
                    <Col className="personal-student-items-data" span={14}>
                        <StudentPersonalData
                            profileStudent={profile}
                            onSubmit={this.props.onSubmit}
                            onDeleteAvatar={this.props.onDeleteAvatar}
                        />
                    </Col>
                    <Col span={7}>
                        <CoachPersonalNotifications
                            profileCoach={profile}
                            onSubmit={this.props.onSubmit}
                        />
                        <CoachPersonalChangePassword
                            profileCoach={profile}
                            onSubmit={this.props.onSubmit}
                        />
                    </Col>
                </Row>
                <WarningModal visible={this.state.visible} onClick={this.onVisible}
                              message="Изменения всупят в силу после проверки администратором"/>
            </div>
        )
    }
}

StudentPersonalProfile.propTypes = {
    profileStudent: PropTypes.object,
    onSubmit: PropTypes.func
};

StudentPersonalProfile.defaultProps = {
    profileStudent: {},
    onSubmit: () => {}
};

export default StudentPersonalProfile
