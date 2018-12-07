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
import CoachPersonalData from "../CoachPersonalData";
import PersonalSuggestions from "../PersonalSuggestions";
import PersonalChangePassword from "../PersonalChangePassword";
import PersonalNotifications from "../PersonalNotifications";

class CoachPersonalProfile extends React.Component{

    constructor() {
        super();
        this.state = {};
    }

    render() {
        const profile = this.props.profileCoach;
        return (
            <div className="personal-coach-items">
                <Row type="flex" gutter={32}>
                    <Col className="personal-coach-items-data" span={14}>
                        <CoachPersonalData
                            profileCoach={profile}
                            onSubmit={this.props.onSubmit}
                            onDeleteAvatar={this.props.onDeleteAvatar}
                        />
                    </Col>
                    <Col span={7}>
                            <PersonalSuggestions
                                profile={profile}
                                onSubmit={this.props.onSubmit}
                            />
                            <PersonalChangePassword
                                profile={profile}
                                onSubmit={this.props.onSubmit}
                            />
                            <PersonalNotifications
                                profile={profile}
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

CoachPersonalProfile.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

CoachPersonalProfile.defaultProps = {
    profileCoach: {},
    onSubmit: () => {}
};

export default CoachPersonalProfile
