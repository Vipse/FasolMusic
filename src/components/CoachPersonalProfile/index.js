import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './style.css'
import '../../icon/style.css'

import Row from "../Row";
import Col from "../Col";
import CoachPersonalData from "../CoachPersonalData";

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
                    <Col className="personal-coach-items-data" xs={24} xxl={18}>
                        <CoachPersonalData
                            profileCoach={profile}
                            onSubmit={this.props.onSubmit}
                            onSocialConnect={this.props.onSocialConnect}
                            getSelectors={this.props.getSelectors}
                            uploadFile={this.props.uploadFile}
                        />
                    </Col>
                </Row>
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
