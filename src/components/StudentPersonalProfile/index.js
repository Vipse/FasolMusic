import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './style.css'
import '../../icon/style.css'

import Row from "../Row";
import Col from "../Col";
import StudentPersonalData from "../StudentPersonalData";
import CoachPersonalProfile from "../../containers/PersonalInfo";

class StudentPersonalProfile extends React.Component {
    render() {
        const profile = this.props.profileStudent;
        const rootClass = cn('personal-student-items');
        return (
            <div className={rootClass}>
                <Row type="flex" gutter={32}>
                    <Col className="personal-student-items-data" xs={24} xxl={18}>
                        <StudentPersonalData
                            profileStudent={profile}
                            onSubmit={this.props.onSubmit}
                            onSocialConnect={this.props.onSocialConnect}
                            getSelectors={this.props.getSelectors}
                            onChangePassword={this.props.onChangePassword}
                            uploadFile={this.props.uploadFile}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

StudentPersonalProfile.propTypes = {
    profileStudent: PropTypes.object,
    onSubmit: PropTypes.func,
    onChangePassword: PropTypes.func
};

StudentPersonalProfile.defaultProps = {
    profileStudent: {},
    onSubmit: () => {},
    onChangePassword: () => {}
};

export default StudentPersonalProfile
