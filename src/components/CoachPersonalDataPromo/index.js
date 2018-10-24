import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'
import Button from '../Button'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'


import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import SelectNew from "../SelectNew";
import TextArea from "../TextArea";
import DatePickerNew from "../DatePickerNew";
import avatarDefault from "../../img/avatarDefault.png";
import Dropzone from "react-dropzone";
import UploadVideoImage from "../../img/uploadVideo.png";

const FormItem = Form.Item;

class CoachPersonalDataPromoForm extends React.Component{
    constructor() {
        super();
        this.state  = {
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
            videoThumb: reader.result,
            loading: false
        }));
        reader.readAsDataURL(file[0]);
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const videoUrl = this.state.videoThumb ? this.state.videoThumb : this.props.profileStudent.videoThumb ? this.props.profileStudent.videoThumb : "";
        const rootClass = cn('coach-data-form');

        return (
            <Form className={rootClass}>
                <div className='coach-data-title'>Проморолик</div>
                <div className='coach-data-block'>
                    <div className='coach-data-promoVideo'>
                        <div className="add-video">
                            <Dropzone multiple = {false} onDrop = {this.onDrop} className="react-dropzone-video">
                                {videoUrl ?
                                    <img src={videoUrl} alt="video" className="video-image"/> :
                                    <img src={UploadVideoImage} alt="video" className="video-image"/>}
                            </Dropzone>
                            <span className="upload-video-photo-click">Нажми на значок, чтобы загрузить видео</span>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

const CoachPersonalDataPromo  = Form.create()(CoachPersonalDataPromoForm);

CoachPersonalDataPromo.propTypes = {
    profileStudent: PropTypes.object
};

CoachPersonalDataPromo.defaultProps = {
    profileStudent: {}
};

export default CoachPersonalDataPromo
