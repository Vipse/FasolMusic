import React, {Component} from 'react';
import PropTypes from 'prop-types'
import ChatContent from './ChatContent'

import './style.css'
import PerfectScrollbar from "react-perfect-scrollbar";
import cn from "classnames";
import ChatFiles from "../../../components/ChatFiles";



class ChatTextContent extends Component {
    constructor(props) {
        super(props);
    }

    filesRender = () => {
        const files = this.props.treatmFiles;
        return files.map((item, index) => {
            if(item.data.length) {
                return (<ChatFiles {...item} key={index}/>)
            }
        });
    };

    render() {
        const {filesActive, isActiveChat} = this.props;
        const dialogsClass = cn('chat-card-dialogs', 'chat-card-dialogs-row', {'chat-card-dialogs-active': filesActive});
        const filesClass = cn('chat-card-files only-chat', {'chat-card-files-active': isActiveChat});
        const attachmentsClass = cn('chat-card-files', {'chat-card-files-active': filesActive});
        return (

            <div className={dialogsClass}>
                <div className={filesClass}>
                    <ChatContent
                        {...this.props}
                        onSend={mes => this.props.sendMessage({
                            id: 'chat',
                            from: this.props.from,
                            to: this.props.to,
                            ...mes,
                        })}
                        chatMode="chat"
                        uploadFile={this.props.uploadFile}
                        data={this.props.chatStory}
                    />
                </div>
                <div className={attachmentsClass}>
                    <PerfectScrollbar>
                        {
                            filesActive && <div className='chat-card-files__items'>
                                {this.filesRender()}
                            </div>
                        }
                    </PerfectScrollbar>
                </div>
            </div>
        );
    }
}

ChatTextContent.propTypes = {
	sendMessage: PropTypes.func,
	uploadFile: PropTypes.func,
};

ChatTextContent.defaultProps = {
	sendMessage: () => {},
	uploadFile: () => {},
};

export default ChatTextContent
