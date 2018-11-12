import React from 'react';

import PropTypes from 'prop-types'
import cn from 'classnames'

import ChatVideoPanel from "../../../components/ChatVideoPanel";

import ChatContent from './ChatContent'

import './style.css'


import Hoc from '../../../hoc'
import PerfectScrollbar from "react-perfect-scrollbar";
import ChatFiles from "../../../components/ChatFiles";
import { detect } from 'detect-browser';
const browser = detect();

class ChatAudioContent extends React.Component {
	constructor(props){
		super(props);
		this.timerInterval;
        this.state = {
            isActive: false
        }
        this.isSafari = browser ? browser.name == 'safari' : true;
	}
    toggleFilesArea = () => {
        (!this.state.isActive) && this.props.getAllFilesTreatment(this.props.id_treatment);
        this.setState(prev => ({isActive: !prev.isActive}));
    }
    filesRender = () => {
        const files = this.props.treatmFiles;
        return files.map((item, index) => {
            if(item.data.length) {
                return (<ChatFiles {...item} key={index}/>)
            }

        });
    };
    componentDidMount(){
        this.isSafari && this.startPlayVideo(this.videoOut, this.videoOutPlayInterval);
    }
    componentWillReceiveProps(nextProps) {
        const { id_treatment: next_id_treatment, 
			receptionId: nextReceptionId, 
			isCalling: nextIsCalling } = nextProps;
		const { id_treatment, receptionId, isCalling } = this.props;
		this.isSafari && 
			(next_id_treatment !== id_treatment || nextReceptionId !== receptionId || nextIsCalling !== isCalling)
				&& (
					this.startPlayVideo(this.videoOut, this.videoOutPlayInterval)
				);
        this.setState({isActive: nextProps.filesActive})
    }
    componentWillUnmount(){
		clearInterval(this.videoInPlayInterval);
		clearInterval(this.videoOutPlayInterval);
	}
    startPlayVideo = (video, intervalVar) =>{
		let promise;
		this.videoOut && (promise = this.videoOut.play());
		promise && promise.then(() => {
			console.log('Automatic playback started!');
			clearInterval(intervalVar);
		})
		.catch(() => {
			console.log('Automatic playback was prevented!');
			!intervalVar && (intervalVar = setInterval(this.startPlayVideo(video), 300))
		})
	}
    setVideoOutRef = (video) => {
        this.videoOut = video;
        this.props.setVideoOut(video);
    }
	renderCallArea = () => {
		const panelClass = cn('chat-card-video__panel', {'chat-card-video__panel-active': this.props.isActiveChat});
		const avatar = this.props.avatar;
        let {s, m, h} = this.props.timer;
		return (<Hoc>
			<div className='chat-card-video__area'>
				{this.isSafari ? (
                    <video className='chat-card-video__box'
                    ref={this.setVideoOutRef}
                    playsInline
                    poster={avatar}
                    ></video>
                ) : (
                    <video className='chat-card-video__box'
						ref={this.setVideoOutRef}
                        autoPlay
						poster={avatar}
						></video>
                )}
                
                <div className={panelClass}>
                    <ChatVideoPanel
                        onStop={() => {
                            this.props.onStop();
                        }}
                        onCall={() => {
                            !this.props.receptionStarts &&
                            this.props.onBegin();
                            this.props.onCall();
                        }}
                        onChat = {this.props.onChat}
                        uploadFiles={this.props.uploadFile}
                        isUser={this.props.isUser}
                        sec= {s}
                        min={m}
                        hour={h}
                        isCalling={this.props.isCalling}/>

                </div>
			</div>

		</Hoc>)
	}


    render() {
        const {isActive,isActiveChat} = this.props;
		const dialogsClass = cn('chat-card-dialogs', 'chat-card-dialogs-row', {'chat-card-dialogs-active': isActive});
		const filesClass = cn('chat-card-files', {'chat-card-files-active': isActiveChat});
        const attachmentsClass = cn('chat-card-files', {'chat-card-files-active': this.state.isActive});

		let audioContent = this.renderCallArea()

        return (

            <div className={dialogsClass}>
				{audioContent}
				<div className={filesClass}>
					 <ChatContent
						{...this.props}
						onSend={mes => this.props.sendMessage({
							id: 'chat',
							from: this.props.from,
							to: this.props.to,
							...mes,
						})}
						uploadFile={this.props.uploadFile}
						 data={this.props.chatStory}
					/>
                </div>
                <div className={attachmentsClass}>
                    <PerfectScrollbar>
                        {
                            this.state.isActive && <div className='chat-card-files__items'>
                                {this.filesRender()}
                            </div>
                        }
                    </PerfectScrollbar>
                </div>
			</div>

        )
    }
}

ChatAudioContent.propTypes = {
	videoCalling: PropTypes.bool,
	wsURL: PropTypes.string.isRequired,
};

ChatAudioContent.defaultProps = {
	videoCalling: false,
	wsURL: '',
};

export default ChatAudioContent
