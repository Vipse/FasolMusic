import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import ScrollArea from "react-scrollbar"
import PerfectScrollbar from 'react-perfect-scrollbar'
import Button from "../../../components/Button";
import ChatSend from "../../../components/ChatSend";
import ChatMessage from "../../../components/ChatMessage";
import ChatComments from "../../../components/ChatComments";

import './style.css'

class ChatContent extends React.Component {
    constructor(props) {
        super(props);
        this.scrollarea;
    }
    shouldComponentUpdate(nextProps) {
        return this.props.data.length !== nextProps.data.length
            || this.props.receptionStarts !== nextProps.receptionStarts
            || this.props.fromTR_VIS !== nextProps.fromTR_VIS
            || (this.props.isActiveChat !== nextProps.isActiveChat && this.props.isActiveChat === false);
    }


    scrollToBottom = () => {
        this.scrollarea.scrollTop = this.scrollarea.scrollHeight - this.scrollarea.clientHeight ;
    };

    componentDidMount() {
      this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }


    render() {
        const dialogsClass = cn('chat-card-dialogs', {'chat-card-dialogs-active': this.props.isActive});

        let scrlClname = this.props.fromTR_VIS === 1 ? "" : this.props.chatMode == "chat" ? "text_mode" : "media_mode";

        //let scrlClname = this.props.chatMode == "chat" ? "text_mode" : this.props.fromTR_VIS === 1 ? "" : "media_mode";
        scrlClname = scrlClname + " chat-card-message__overlay";
        const ref = this.scrollarea
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
                        //className="chat-card-message__box"
                        className={scrlClname}
                        containerRef={(ref)=> this.scrollarea=ref}
                    >
                        {/*<div className='chat-card-message__overlay'>*/}


                        {
                            this.props.data.map((e, i) => {
                                const messProps = +e.from === +this.props.from
                                    ? {isMy: true,}
                                    : {
                                        img: this.props.avatar,
                                        online: this.props.online,
                                    }
                                return (<ChatMessage
                                    {...e}
                                    {...messProps}
                                    //isMy={e.from === this.props.from}
                                    key={i}
                                />)
                            })
                        }
                        {this.props.fromTR_VIS === 2 && !this.props.receptionStarts && this.props.user_mode !== "user"
                        && <div className='btn-start'>
                            <Button
                                btnText='Начать приём'
                                size='small'
                                type='yellow'
                                onClick={this.props.onBegin}
                            />
                        </div>}
                        {/*<div ref={(ref) => { this.scrollRef = ref }}></div>*/}

                    </PerfectScrollbar>
                </div>
                {
                    this.props.fromTR_VIS === 2 &&
                    (<div className='chat-card-message__send'>
                        <ChatSend
                            disable={!this.props.receptionStarts}
                            isCurVisEnd={this.props.isCurVisEnd}
                            isUser={this.props.user_mode === "user"}
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
