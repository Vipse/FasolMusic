import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import PerfectScrollbar from 'react-perfect-scrollbar'
import Spinner from "../../../components/Spinner";
import ChatSend from "../../../components/ChatSend";
import ChatMessage from "../../../components/ChatMessage";
import ChatComments from "../../../components/ChatComments";

import './style.css'
import {Modal} from "antd";

class ChatContent extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.data.length !== nextProps.data.length
            || this.props.trainingStarts !== nextProps.trainingStarts
            || (this.props.isActiveChat !== nextProps.isActiveChat && this.props.isActiveChat === false)
            || (this.props.loadingChatStory !== nextProps.loadingChatStory);
    }


    scrollToBottom = () => {
        this.scrollarea.scrollTop = this.scrollarea.scrollHeight - this.scrollarea.clientHeight;
    };

    componentDidMount() {
      this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {data, showEndDescription} = this.props;
        this.scrollToBottom();

        if (showEndDescription && prevProps.data !== data && data.length) {
            const lastMsg = data[data.length - 1];

            if (lastMsg && lastMsg.isVisEnd)
                this.showEndDescriptionModal(lastMsg.endType);
        }
    }

    showEndDescriptionModal = (endType) => {
        Modal.info({
            title: 'Тренировка ' + (endType === 'transfer' ? 'перенесена' : 'завершена'),
            width: '500px',
            className: 'fast-modal'
        });
    };

    render() {
        const {loadingChatStory} = this.props;
        const dialogsClass = cn('chat-card-dialogs', {'chat-card-dialogs-active': this.props.isActive});

        let scrlClname = this.props.chatMode ==="chat" ? "text_mode" : "media_mode";
        scrlClname = scrlClname + " chat-card-message__overlay";

        return (

            <div className={dialogsClass}>
                <div className='chat-card-message__area'>
                    <div className='chat-card-message__comments'>
                        <ChatComments {...this.props.comment}/>
                    </div>

                    <PerfectScrollbar
                        speed={1}
                        contentClassName="content"
                        horizontal={false}
                        className={scrlClname}
                        containerRef={(ref)=> this.scrollarea=ref}
                    >
                        {loadingChatStory ? <Spinner/> :
                            this.props.data.map((e, i) => {
                                const messProps = (e && +e.from === +this.props.from)
                                    ? {isMy: true,}
                                    : {
                                        img: this.props.interlocutorAvatar,
                                        online: this.props.online,
                                    };
                                return (<ChatMessage
                                    {...e}
                                    {...messProps}
                                    key={i}
                                />)
                            })
                        }
                        {/*!this.props.trainingStarts && !this.props.isStudent
                        && <div className='btn-start'>
                            <Button
                                btnText='Начать тренировку'
                                size='small'
                                type='yellow'
                                onClick={this.props.onBegin}
                            />
                        </div>*/}
                    </PerfectScrollbar>
                </div>
                {
                    (<div className='chat-card-message__send'>
                        <ChatSend
                            disable={this.props.isComplete || !this.props.trainingStarts}
                            isCurTrainingEnd={this.props.isCurTrainingEnd}
                            isStudent={this.props.isStudent}
                            closeVisit={this.props.onEnd}
                            uploadFiles={this.props.uploadFile}
                            send={message => this.props.onSend(message)}/>
                    </div>)
                }
            </div>

        )
    }
}


ChatContent.propTypes = {
    onSend: PropTypes.func,
    data: PropTypes.array,
    onBegin: PropTypes.func,
    receptionStarts: PropTypes.bool,
    onEnd: PropTypes.func,
    comment: PropTypes.shape({
        comments: PropTypes.string,
        files: PropTypes.array,
    }),
    uploadFile: PropTypes.func,
};

ChatContent.defaultProps = {
    onSend: () => {
    },
    data: [],
    onBegin: () => {
    },
    receptionStarts: false,
    onEnd: () => {
    },
    comment: {
        comments: "",
        files: [],
    },
    uploadFile: () => {
    },
};

export default ChatContent
