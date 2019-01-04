import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'

import Button from "../Button";
import Rate from '../Rate'
import Icon from '../Icon'
import PopoverFile from '../PopoverFile'
import Hoc from '../Hoc'

import './style.css'
import '../../icon/style.css'
import {message} from "antd";

class HomeworkListItem extends React.Component {

    handleClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }


    refactorFiles = (file) => {
        if (file.length) {
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
            files,
            onGoto,
            isUser,
            date,
            name,
            discipline,
            trainingRecord,
            homework,
        } = this.props;

        return (
            <div className="homework-list-item">
                <div className="flex-col">
                    <div className="date">{date ?
                        <div className="training-date">
                            <div className="date">{moment(date*1000).format("D.MM.YYYY")}</div>
                            <div className="time">{moment(date*1000).format("H:mm")}</div>
                        </div>
                        : <span>&mdash;</span>}</div>
                </div>
                
                <div className="flex-col">
                    <div className="name">{name ? name : <span>&mdash;</span>}</div>
                </div>
                <div className="flex-col">
                    <div className="discipline">{Array.isArray(discipline) ? discipline.map((el) => el.name) : <span>&mdash;</span>}</div>
                    </div> 
                <div className="flex-col">
                    <div className="patient-price">{trainingRecord ?
                        <a target='_blank' href={trainingRecord}>
                            <Button btnText="Просмотр" type="border-pink"/>
                        </a>
                        : <span>&mdash;</span>}</div>
                </div>
                <div className="flex-col">
                    <div className="patient-price">{homework ? homework:
                        <div className="sendHomework">
                            <textarea className="sendHomework-area" name="homework" rows="10" placeholder='Домашнее задание...'></textarea>
                            <button className="sendHomework-btn">
                                <Icon type="message" size={25}></Icon>
                            </button>
                        </div>}</div>
                </div>
                <div className="flex-col"
                     onClick={this.handleClick}>
                    <PopoverFile data={this.refactorFiles(files)}
                                 onAddFiles={this.props.onAddFiles}
                                 refresh={this.props.refresh}
                                 makeArchiveOfFiles={this.props.makeArchiveOfFiles}

                    >
                    </PopoverFile>
                </div>
            </div>
        )
    }
}

HomeworkListItem.propTypes = {};

HomeworkListItem.defaultProps = {};

export default HomeworkListItem
