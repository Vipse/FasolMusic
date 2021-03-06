import React from 'react';
import PropTypes from 'prop-types'

import ProfileAvatar from '../ProfileAvatar'
import Card from '../Card'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'

class StudentProfile extends React.Component {
    state = {};

    render() {
        const {img, name, discipline, level, paidTrainingsCount, email, phones, isAdmin} = this.props;

        return (
            <Card title="Профиль студента">
                    <div className="profile-card-student">
                        <div className='profile-student'>
                            <div className="profile-student-avatar">
                                <ProfileAvatar
                                    img={img}
                                    size="large"
                                    //online={status}
                                />
                            </div>

                            <div className="profile-student-info">
                                <div className="profile-student-info-name">{name}</div>
                                <div className="profile-student-info-discipline">{discipline}</div>
                                <div className="profile-student-info-email"> <span>Email: </span> {email ? email : '-'} </div>

                                <div className="profile-student-info-phones"> <span>Телефон: </span> {phones ? phones : '-'} </div>
                                <div className="profile-student-info-level">{(level && level.length) ? level : ''}</div>
                                <div className="profile-student-info-count">Тренировок оплачено: <span className="profile-student-info-count-number">{paidTrainingsCount}</span></div>
                            </div>
                        </div>
                        {!isAdmin ? 
                            (<div className="profile-student-btn-row">
                                <Button onClick={() => this.props.onGoToChat()}
                                        btnText='Открыть чат'
                                        size='default'
                                        type='light-blue'
                                />
                            </div>) : 
                            (<div className="profile-student-btn-row">
                                <Button onClick={this.props.goToStudentSchedule}
                                        btnText='Открыть расписание'
                                        size='default'
                                        type='light-blue'
                                />
                            </div>)
                        }

                    </div>
            </Card>
        )
    }
}

StudentProfile.propTypes = {
    name: PropTypes.string,
    img: PropTypes.string,
    discipline: PropTypes.string,
    level: PropTypes.string,
    paidTrainingsCount: PropTypes.number

};

StudentProfile.defaultProps = {
    name: '',
    img: '',
    discipline: '',
    level: '',
    paidTrainingsCount: 0
};

export default StudentProfile
