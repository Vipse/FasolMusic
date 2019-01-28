import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './style.css'
import '../../icon/style.css'

import UploadVideoImage from "../../img/uploadVideo.png";
import Button from "../Button";
import PromoVideoModal from "../PromoVideoModal";
import YouTube from 'react-youtube';

class CoachPersonalDataPromo extends React.Component {
    constructor() {
        super();
        this.state = {
            videoModalVisible: false
        }
    }

    convertLink = (link) => {
        let videoID = link.split('v=')[1];
        let ampersandPosition = videoID.indexOf('&');
        if(ampersandPosition !== -1) {
            videoID = videoID.substring(0, ampersandPosition);
        }

        return videoID;
    };

    render() {
        const {profile} = this.props;
        const videoUrl = profile.promovideo ? profile.promovideo : "";
        const rootClass = cn('coach-data-block');
        const youtubeOpts = {
            height: '360',
            width: '640',
            playerVars: {autoplay: 0}
        };

        return (
            <div className={rootClass}>
                <div className='coach-data-promoVideo'>
                    {!videoUrl ?
                        <div>
                            <div onClick={() => this.setState({videoModalVisible: true})}
                                 className="dropzone-video">
                                <img src={UploadVideoImage} alt="video" className="video-image"/>
                            </div>
                            <span className="upload-video-photo-click">Нажми на значок, чтобы добавить видео</span>
                        </div> :
                        <div className="video">
                            <YouTube
                                videoId={this.convertLink(videoUrl)}
                                opts={youtubeOpts}
                            />
                            <Button btnText='Изменить ролик'
                                    onClick={() => this.setState({videoModalVisible: true})}
                                    type='light-blue'/>
                        </div>}
                </div>

                <PromoVideoModal
                    profile={profile}
                    visible={this.state.videoModalVisible}
                    onSubmit={this.props.onChangePromo}
                    onCancel={() => this.setState({videoModalVisible: false})}
                />
            </div>
        )
    }
}

CoachPersonalDataPromo.propTypes = {
    promoLink: PropTypes.string
};

CoachPersonalDataPromo.defaultProps = {
    profileCoach: ""
};

export default CoachPersonalDataPromo
