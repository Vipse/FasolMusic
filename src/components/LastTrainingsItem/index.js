import React from 'react';
import PropTypes from 'prop-types'

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import {message} from 'antd';
import Button from "../Button";
import moment from "moment";
import PopoverFile from "../PopoverFile";
import Icon from "../Icon";
import TextArea from "../TextArea";

class LastTrainingsItem extends React.Component{
    state = {
        homeworkText: '',
        savedHomework: ''
    };

    homeworkEdit = () => {
        const {idTraining} = this.props;
        const {homeworkText} = this.state;

        this.props.onSetHomeworkEdit(idTraining, homeworkText)
            .then(res => {
                console.log(res);
                if (res && res.data && !res.data.error) {
                    this.setState({savedHomework: homeworkText});
                    message.success("Домашнее задание сохранено");
                }
                else message.error("Ошибка при сохранении домашнего задания. Повторите попытку");
            })
            .catch(err => console.log(err));
    };

    render(){
        const {
            discipline,
            name,
            homework,
            videofile,
            attachments,
            avatar,
            date,
            idProfile,
            onGoto,
            isStudent
        } = this.props;

        const {savedHomework, homeworkText} = this.state;

        
        return (
            <div className='lastTraining'>
                <div className="lastTraining-contactInfo">
                    <div className="lastTraining-contactInfo-avatar" onClick={() => onGoto(idProfile)}>
                        <ProfileAvatar
                            img={avatar}
                            size='small'
                        />
                    </div>
                    <div className="lastTraining-contactInfo-nameAndDate">
                        <span className='lastTraining-contactInfo-name' onClick={() => onGoto(idProfile)}>{name}</span>
                        <span className='lastTraining-contactInfo-date' onClick={() => onGoto(idProfile)}>{moment(date).format("DD.MM.YYYY")}</span>
                    </div>
                    <span className='lastTraining-contactInfo-discipline'>{discipline}</span>
                </div>
                <div className='lastTraining-homework'>
                    {homework ? homework : savedHomework ? savedHomework : isStudent ? <span className="homeworkEmpty">Нет домашнего задания</span> :
                        <div className="sendHomework">
                            <TextArea className="sendHomework-textArea"
                                      placeholder='Домашнее задание...'
                                      onChange={(text) => this.setState({homeworkText: text})}
                                      value={homeworkText}
                            />
                            <button className="sendHomework-btn" onClick={this.homeworkEdit}>
                                <Icon type="message" size={25}/>
                            </button>
                        </div>}
                </div>
                <div className='lastTraining-materials'>
                    <div className="trainingRecord">
                        <span className='trainingRecord-title'>ЗАПИСЬ ТРЕНИРОВКИ</span>
                        {videofile ? <Button
                            btnText="Загрузить"
                            type="border-pink"
                            link={videofile}
                        /> : <span>&mdash;</span>}
                    </div>
                    <div className='files'>
                        <span className='files-title'>Материалы</span>
                        <PopoverFile
                            data={attachments ? attachments : []}
                        >
                        </PopoverFile>
                    </div>
                </div>
            </div>
        )
    }
}

LastTrainingsItem.propTypes = {

};

LastTrainingsItem.defaultProps = {

};

export default LastTrainingsItem