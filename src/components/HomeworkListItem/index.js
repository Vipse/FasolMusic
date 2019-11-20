import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'

import Button from "../Button";
import Rate from '../Rate'
import Icon from '../Icon'
import PopoverFile from '../PopoverFile'


import './style.css'
import '../../icon/style.css'
import {message} from "antd";
import TextArea from "../TextArea";

class HomeworkListItem extends React.Component {
    state = {
        homeworkText: '',
        savedHomework: ''
    };

    homeworkEdit = () => {
        const {idTraining} = this.props;
        const {homeworkText} = this.state;

        this.props.onSetHomeworkEdit(idTraining, homeworkText)
            .then(res => {
                if (res && res.data && !res.data.error) {
                    this.setState({savedHomework: homeworkText});
                    message.success("Домашнее задание сохранено");
                }
                else message.error("Ошибка при сохранении домашнего задания. Повторите попытку");
            })
            .catch(err => console.log(err));
    };

    handleClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    refactorFiles = (file) => {
        if (file && file.length) {
            let files = [];
            file.forEach((item) => {
                if (item.data.length) {
                    item.data.forEach((eachFile) => {
                        files.push(eachFile)
                    })
                }
            });
            return files
        } else return file
    };

    render() {
        const {
            onGoToProfile,
            onGoToChat,
            idTraining,
            isStudent,
            onStudentPage,
            date,
            name,
            discipline,
            trainingRecord,
            homework,
            idProfile,
            avatar,
            isTrial
        } = this.props;

        const {savedHomework, homeworkText} = this.state;

        return (
            <div className="homework-list-item" onClick={() =>
                onGoToChat(isStudent, idTraining, name, avatar, date, true, isTrial)}>
                <div className="flex-col date">
                    <div className="date">{date ?
                        <div className="training-date">
                            <div className="date">{moment(date * 1000).format("D.MM.YYYY")}</div>
                            <div className="time">{moment(date * 1000).format("H:mm")}</div>
                        </div>
                        : <span>&mdash;</span>}</div>
                </div>

                {!onStudentPage && <div className="flex-col name">
                    <div
                        className="name"
                        onClick={(e) => {
                            e.stopPropagation();
                            onGoToProfile(idProfile)
                        }}>{name ? name : <span>&mdash;</span>}</div>
                </div>}
                <div className="flex-col discipline">
                    <div className="discipline">{discipline ? discipline : <span>&mdash;</span>}</div>
                </div>
                <div className="flex-col record">
                    <div className="record">{trainingRecord ?
                        <a target='_blank' href={trainingRecord}>
                            <Button btnText="Просмотр" type="border-pink" size='small'/>
                        </a>
                        : <span>&mdash;</span>}</div>
                </div>
                <div className="flex-col homework">
                    <div className="homework">{homework ? homework : savedHomework ? savedHomework : isStudent ? <span className="homeworkEmpty">&mdash;</span> :
                        <div className="sendHomework" onClick={(e) => {e.stopPropagation()}}>
                            <TextArea className="sendHomework-textArea"
                                      placeholder='Домашнее задание...'
                                      onChange={(text) => this.setState({homeworkText: text})}
                                      value={homeworkText}
                            />
                            <button className="sendHomework-btn" onClick={this.homeworkEdit}>
                                <Icon type="message" size={25}/>
                            </button>
                        </div>}</div>
                </div>

            </div>
        )
    }
}

HomeworkListItem.propTypes = {};

HomeworkListItem.defaultProps = {};

export default HomeworkListItem
