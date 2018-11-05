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
            onGoto,
            profileAvatar,
            date
        } = this.props;

        return (
            <div className='lastTraining'>
                <div className="lastTraining-contactInfo">
                    <ProfileAvatar
                        img={profileAvatar}
                        size='small'
                    />
                    <div className="lastTraining-contactInfo-nameAndDate">
                        <span className='lastTraining-contactInfo-name'>{name}</span>
                        <span className='lastTraining-contactInfo-date'>{moment(date).format("DD.MM.YYYY")}</span>
                    </div>
                    <span className='lastTraining-contactInfo-discipline'>{discipline}</span>
                </div>
                <div className='lastTraining-homework'>
                    {homework ? homework:
                        <div className="sendHomework">
                            <textarea className="sendHomework-area" name="homework" rows="10" placeholder='Домашнее задание...'></textarea>
                            <button className="sendHomework-btn">
                                <Icon type="message" size={25}></Icon>
                            </button>
                        </div>}
                </div>
                <div className='lastTraining-materials'>
                    <div className="trainingRecord">
                        <span className='trainingRecord-title'>ЗАПИСЬ ТРЕНИРОВКИ</span>
                        <Button
                            btnText="Загрузить"
                            type="border-pink"
                        />
                    </div>
                    <div className='files'>
                        <span className='files-title'>Материалы</span>
                        <PopoverFile
                            data={[]}
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