import React from 'react';
import PropTypes from 'prop-types'

import ProfileAvatar from '../ProfileAvatar'
import Card from '../Card'
import Button from '../Button'
import ScrollArea from 'react-scrollbar'
import './style.css'
import '../../icon/style.css'
import CoachPersonalDataPromo from "../CoachPersonalDataPromo";

class CoachProfile extends React.Component {
    state = {};

    render() {
        const {img, name, discipline, specialization, rate, ratingsCount} = this.props;

        return (
            <Card title="Профиль преподавателя">
                <ScrollArea
                    speed={0.5}
                    contentClassName="flex-div"
                    smoothScrolling={true}
                >
                    <div className="profile">
                        <div className='profile-coach'>
                            <div className="profile-coach-avatar">
                                <ProfileAvatar
                                    img={img}
                                    size="large"
                                    //online={status}
                                />
                            </div>

                            <div className="profile-coach-info">
                                <div className="profile-coach-info-name">{name}</div>
                                <div className="profile-coach-info-discipline">{discipline}{specialization ? (", " + specialization) : ""}</div>
                                <div className="profile-coach-btn-row">
                                    <Button onClick={() => console.log('openDialog')}
                                            btnText='Открыть диалог'
                                            size='default'
                                            type='light-blue'
                                    />
                                </div>
                            </div>

                            <div className="profile-coach-rate">
                                <div className="profile-coach-info-count">Rate: <span className="profile-coach-info-count-number">{rate} ({ratingsCount})</span></div>
                                <div className="profile-coach-rate-info">
                                    Comment
                                </div>
                            </div>
                        </div>
                        <div className="profile-coach-comment">
                            Comment
                        </div>
                        <div className="profile-coach-promo">
                            <CoachPersonalDataPromo/>
                        </div>
                    </div>
                </ScrollArea>

            </Card>
        )
    }
}

CoachProfile.propTypes = {
    name: PropTypes.string,
    img: PropTypes.string,
    discipline: PropTypes.string,
    specialization: PropTypes.string,
    paidTrainingsCount: PropTypes.number

};

CoachProfile.defaultProps = {
    name: '',
    img: '',
    discipline: '',
    specialization: '',
    paidTrainingsCount: 0
};

export default CoachProfile
