import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Radio from '../Radio'
import ChatFiles from '../ChatFiles'
import ChatSend from '../ChatSend'
import ChatMessage from '../ChatMessage'

import './style.css'
import '../../icon/style.css'

class ChatContent extends React.Component {

    render() {
        const dialogsClass = cn('chat-card-dialogs', {'chat-card-dialogs-active': this.props.isActive});

        return (

            <div className={dialogsClass}>
                <div className='chat-card-message__area'>
                    {/*<div className='chat-card-message__comments'>
                     <ChatComments
                     comments="Жалоба пациента или Комментарий. Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Вдали от всех живут они в буквенных домах."
                     />  
                     </div>*/}

                    <div className='chat-card-message__box'>
                        <div className='chat-card-message__overlay'>
                            <ChatMessage
                                img="https://www.proza.ru/pics/2017/06/03/1990.jpg"
                                message="Здарова!"
                                time={Date.now()}
                            />
                            <ChatMessage
                                isMy
                                message="Здоровей видали!!"
                                time={Date.now()}
                            />
                            <ChatMessage
                                img="https://www.proza.ru/pics/2017/06/03/1990.jpg"
                                message="Здарова!"
                                time={Date.now()}
                            />
                            <ChatMessage
                                img="https://www.proza.ru/pics/2017/06/03/1990.jpg"
                                message="Здарова!"
                                time={Date.now()}
                            />
                            <ChatMessage
                                isMy
                                message="Здоровей видали!!"
                                time={Date.now()}
                            />
                        </div>
                    </div>
                </div>
                <div className='chat-card-message__send'>
                    <ChatSend />
                </div>
            </div>

        )
    }
}

ChatContent.propTypes = {};

ChatContent.defaultProps = {};

export default ChatContent