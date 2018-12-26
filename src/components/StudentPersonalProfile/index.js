import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './style.css'
import '../../icon/style.css'

import Row from "../Row";
import Col from "../Col";
//import WarningModal from "../WarningModal";
//import PersonalChangePassword from "../PersonalChangePassword";
//import PersonalNotifications from "../PersonalNotifications";
import StudentPersonalData from "../StudentPersonalData";

class StudentPersonalProfile extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

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
                        />
                    </Col>
                    {/*<Col span={7}>
                        <PersonalNotifications
                            profile={profile}
                            onSubmit={this.props.onSubmit}
                        />
                        <PersonalChangePassword
                            profile={profile}
                            onSubmit={this.props.onSubmit}
                        />
                    </Col>*/}
                </Row>
                {/*<WarningModal visible={this.state.visible} onClick={this.onVisible}
                              message="Изменения всупят в силу после проверки администратором"/>*/}
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