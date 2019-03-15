import React from 'react';
import PropTypes from 'prop-types'

import ProfileAvatar from '../ProfileAvatar'
import Card from '../Card'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import YouTube from "react-youtube";
import Spinner from "../Spinner";
import Rate from "../Rate";
import {message} from "antd";
import RateCoachModal from "../RateCoachModal";

class CoachProfile extends React.Component {
    state = {
        youtubeLoading: true,
        rateModalVisible: false
    };

    convertLink = (link) => {
        let videoID = link.split('v=')[1];
        if (videoID) {
            let ampersandPosition = videoID.indexOf('&');
            if (ampersandPosition !== -1) {
                videoID = videoID.substring(0, ampersandPosition);
            }
        }

        return videoID;
    };

    youtubeReadyHandler = () => {
        this.setState({youtubeLoading: false})
    };

    handleRateMaster = (rate, feedback) => {
        this.props.onRateMaster(rate, feedback)
            .then((res) => {
                if (res && res.process) {
                    message.success('Отзыв отправлен');
                    this.setState({rateModalVisible: false});
                }
                else message.error('Ошибка при отправке отзыва', 5);
            })
            .catch(err => console.log(err));
    };

    render() {
        const {img, name, discipline, specialization, aboutMe, rate, ratingsCount, promoLink, email, phones, mode} = this.props;
        const {youtubeLoading, rateModalVisible} = this.state;
        const isAdmin = mode === 'admin';
        const youtubeOpts = {
            height: '360',
            width: '640',
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
                                <div className="profile-coach-info-discipline">{discipline ? discipline.join(', ') : ''}
                                {specialization ? ('; ' + specialization.join(', ')) : ""}</div>

                                {isAdmin ?
                                <div>
                                    <div className="profile-coach-info-email"> <span>Email: </span> {email ? email : '-'} </div>
                                    <div className="profile-coach-info-phones"> <span>Телефон: </span> {phones ? phones : '-'} </div>
                                </div> : null}

                                {!isAdmin ?
                                    <div className="profile-coach-info-btn">
                                        <Button onClick={() => this.props.onGoToChat()}
                                                btnText='Открыть чат'
                                                size='default'
                                                type='light-blue'
                                        />
                                    </div> : null}
                            </div>

                            <div className="profile-coach-rate">
                                <div className="profile-coach-rate-count">
                                    <Rate disabled defaultValue={rate}/>
                                <span className="profile-coach-rate-count-amount">({ratingsCount} оценок)</span></div>
                                <div className="profile-coach-rate-info">
                                    <p>Предложение оценить препода в несколько строк</p>
                                </div>
                                <Button className="profile-coach-rate-btn"
                                        onClick={() => this.setState({rateModalVisible: true})}
                                        btnText='Оценить'
                                        size='small'
                                        type='yellow'
                                />
                            </div>
                        </div>
                        <div className="profile-coach-comment">
                            <p>{aboutMe}</p>
                        </div>
                        {promoLink && <div className="profile-coach-promo">
                            {youtubeLoading && <Spinner size='large'/>}
                            <YouTube
                                videoId={this.convertLink(promoLink)}
                                opts={youtubeOpts}
                                onReady={this.youtubeReadyHandler}
                            />
                        </div>}
                        <RateCoachModal
                            visible={rateModalVisible}
                            prevRate={3}
                            onCancel={() => this.setState({rateModalVisible: false})}
                            onSave={this.handleRateMaster}
                        />
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
    paidTrainingsCount: PropTypes.number,
    mode: PropTypes.string,

};

CoachProfile.defaultProps = {
    name: '',
    img: '',
    discipline: '',
    specialization: '',
    paidTrainingsCount: 0
};

export default CoachProfile
