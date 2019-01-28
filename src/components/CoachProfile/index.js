import React from 'react';
import PropTypes from 'prop-types'

import ProfileAvatar from '../ProfileAvatar'
import Card from '../Card'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import YouTube from "react-youtube";

class CoachProfile extends React.Component {
    state = {};

    convertLink = (link) => {
        let videoID = link.split('v=')[1];
        let ampersandPosition = videoID.indexOf('&');
        if(ampersandPosition !== -1) {
            videoID = videoID.substring(0, ampersandPosition);
        }

        return videoID;
    };

    render() {
        const {img, name, discipline, specialization, aboutMe, rate, ratingsCount, promoLink} = this.props;
        const youtubeOpts = {
            height: '320',
            width: '568',
            playerVars: {autoplay: 0}
        };

        return (
            <Card title="Профиль преподавателя">
                    <div className="profile-card-coach">
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
                                <div className="profile-coach-info-discipline">{discipline.join(', ')}{specialization ? ('; ' + specialization.join(', ')) : ""}</div>
                                <div className="profile-coach-info-btn">
                                    <Button onClick={() => console.log('openDialog')}
                                            btnText='Открыть диалог'
                                            size='default'
                                            type='light-blue'
                                    />
                                </div>
                            </div>

                            <div className="profile-coach-rate">
                                <div className="profile-coach-rate-count">★★★★★{/*rate*/} <span className="profile-coach-rate-count-amount">({ratingsCount} оценок)</span></div>
                                <div className="profile-coach-rate-info">
                                    <p>Предложение оценить препода в несколько строк</p>
                                </div>
                            </div>
                        </div>
                        <div className="profile-coach-comment">
                            <p>{aboutMe}</p>
                        </div>
                        {promoLink && <div className="profile-coach-promo">
                            <YouTube
                                videoId={this.convertLink(promoLink)}
                                opts={youtubeOpts}
                            />
                        </div>}
                    </div>
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
