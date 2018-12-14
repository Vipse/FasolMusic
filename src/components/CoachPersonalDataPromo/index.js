import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './style.css'
import '../../icon/style.css'

import Dropzone from "react-dropzone";
import UploadVideoImage from "../../img/uploadVideo.png";

class CoachPersonalDataPromo extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            fileList: [],
            videoUrl: "",
            videoThumb: "",
        }
    }

    onDrop = (file) => {
        console.log(file);
        const reader = new FileReader();
        // this.props.uploadFile(info.file)
        //     .then((res) => {
        //         this.setState({videoUrl: res.data.file[0].url, videoName: res.data.file[0].name});
        //         message.success("Видео загружено")
        //     });
        reader.addEventListener('load', () => this.setState({
            //videoThumb: reader.result,
            loading: false
        }));
        reader.readAsDataURL(file[0]);
    };

    render() {
        const {promoLink} = this.props;
        const videoUrl = this.state.videoThumb ? this.state.videoThumb : promoLink ? promoLink : "";
        const rootClass = cn('coach-data-block');

        return (
            <div className={rootClass}>
                <div className='coach-data-promoVideo'>
                    <div className="add-video">
                        <Dropzone multiple={false} onDrop={this.onDrop} className="react-dropzone-video">
                            {videoUrl ?
                                <img src={videoUrl} alt="video" className="video-image"/> :
                                <img src={UploadVideoImage} alt="video" className="video-image"/>}
                        </Dropzone>
                        <span className="upload-video-photo-click">Нажми на значок, чтобы загрузить видео</span>
                    </div>
                </div>
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
