import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './style.css'
import '../../icon/style.css'

import Row from "../Row";
import Col from "../Col";
//import WarningModal from "../WarningModal";
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
        const rootClass = cn('personal-coach-items');
        return (
            <div className={rootClass}>
                <Row type="flex" gutter={32}>
                    <Col className="personal-coach-items-data" span={14}>
                        <CoachPersonalData
                            profileCoach={profile}
                            onSubmit={this.props.onSubmit}
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
                {/*<WarningModal visible={this.state.visible} onClick={this.onVisible}
                              message="Изменения всупят в силу после проверки администратором"/>*/}
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
