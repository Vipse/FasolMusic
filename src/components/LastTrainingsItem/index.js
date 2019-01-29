import React from 'react';
import PropTypes from 'prop-types'

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import Button from "../Button";
import moment from "moment";
import PopoverFile from "../PopoverFile";
import Icon from "../Icon";

class LastTrainingsItem extends React.Component{
    render(){
        const {
            discipline,
            name,
            homework,
            avatar,
            date,
            idProfile,
            onGoto
        } = this.props;

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
                    {homework ? homework :
                        <div className="sendHomework">
                            <textarea className="sendHomework-area" name="homework" rows="10" placeholder='Домашнее задание...'>{homework ? homework.info : ''}</textarea>
                            <button className="sendHomework-btn">
                                <Icon type="message" size={25}/>
                            </button>
                        </div>}
                </div>
                <div className='lastTraining-materials'>
                    <div className="trainingRecord">
                        <span className='trainingRecord-title'>ЗАПИСЬ ТРЕНИРОВКИ</span>
                        <Button
                            btnText="Загрузить"
                            type="border-pink"
                            link={homework ? homework.recordlink : ''}
                        />
                    </div>
                    <div className='files'>
                        <span className='files-title'>Материалы</span>
                        <PopoverFile
                            data={homework ? homework.attachments : []}
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