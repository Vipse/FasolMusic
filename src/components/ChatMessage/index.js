import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'

import ProfileAvatar from '../ProfileAvatar'
import Hoc from "../Hoc"
import Icon from "../Icon"
import DownloadLink from "../DownloadLink"

import './style.css'
import '../../icon/style.css'

const ChatMessage = props => {
    const {
        text, size, date, online, img, isMy, isDate, isVisEnd, endType, type, callTime, name} = props;
    const rootClass = isMy ? 'message__out' : 'message__in';

    const callInfoMessage = (text1, name, text2, iconType, isRed = false) => {
        return (
            <div className={`${rootClass}-item`}>
                <div className={`${rootClass}-time-InCallInfo`}>
                    {moment(date * 1000).format('HH:mm')}
                </div>
                <div className="call-info-content">
                    <Icon svg
                        type={iconType}
                        size={iconType === "end-call-button" ? 10 : 18}
                        style={{color: isRed ? "#ef5350" : "#204d8d", marginRight: 20}}/>
                    {text1} {
                        name ? (<span style={{fontWeight: "bold"}}>{name}</span>) : null
                    } {text2}
                </div>
            </div>
        )
    }



        let content;
        switch (type){
            case "stop":
            // phone-call-outcoming
                content = callInfoMessage(
                    "Звонок завершен. Продолжительность: " + callTime,
                    "", "",
                    "end-call-button"
                );
                break;
            case "begin":
                content = callInfoMessage(
                    "Звонок",
                    name,
                    "",
                    "phone-call-outcoming"
                );
                break;
            case "notBegin":
                content = callInfoMessage(
                    "Абонент",
                    name,
                    "не отвечает",
                    "phone-call-outcoming",
                    true
                );
                break;
            case "default":
            default:
                content = (
                    <div className={`${rootClass}-item`}>
                                {!isMy && <ProfileAvatar owner="patient"
                                                        online={online}
                                                        img={img}
                                                        size={size}/>}
                                <div className={`${rootClass}-area`}>
                                    {
                                        date && <div className={`${rootClass}-time`}>
                                            {moment(date * 1000).format('HH:mm')}
                                        </div>
                                    }
                                    <div className={`${rootClass}-box`}>
                                        <div className={`${rootClass}-attached`}>
                                            {text ?
                                                text : <DownloadLink
                                                            btnText={props.name}
                                                            href={props.link}
                                                            size="default"
                                                            type="link"
                                                            download
                                                            svg
                                                            icon={"file"}
                                                            iconSize={16}/> }
                                        </div>
                                    </div>
                                </div>
                            </div>
                )
        }
    return (
        <Hoc>
            {
                isDate ?
                    (<div className='message-today'>{moment(date * 1000).format("D MMMM YYYY")}</div>)
                    : isVisEnd ?
                    (<div
                        className='message-visit-end'>Тренировка {endType === 'transfer' ?
                        'перенесена' : 'завершена'}</div>)
                    : (content)
            }
        </Hoc>
    )
}

ChatMessage.propTypes = {
    img: PropTypes.string,
    text: PropTypes.string,
    link: PropTypes.string,
    name: PropTypes.string,
    isMy: PropTypes.bool,
    date: PropTypes.number,
    isDate: PropTypes.bool,
    isVisEnd: PropTypes.bool,
    type: PropTypes.oneOf(["default", "stop", "begin", "notBegin"]),
    callTime: PropTypes.string,
};

ChatMessage.defaultProps = {
    img: '',
    text: '',
    link: '',
    name: '',
    isMy: false,
    size: 'small',
    date: 0,
    isDate: false,
    isVisEnd: false,
    type: "default",
    callTime: "",
};

export default ChatMessage
