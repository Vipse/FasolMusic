import React from 'react';
import cn from 'classnames'

import ChatVideoPanel from "../../../components/ChatVideoPanel";

import ChatContent from './ChatContent'

import './style.css'
import Hoc from '../../../hoc'
import PerfectScrollbar from 'react-perfect-scrollbar'

import ChatFiles from "../../../components/ChatFiles";
import { detect } from 'detect-browser';
const browser = detect();

class ChatVideoContent extends React.Component {
	constructor(props){
		super(props);
		this.timerInterval;
		this.state = {
			isActive: false,
		}
		this.isSafari = browser ? browser.name == 'safari' : true;
	}

	/*renderPlayer = () => {
		console.log('renderPlayer',this.props.fileURL)
		return (<Hoc>
			<div className='chat-card-message__area'>
				<video className='chat-card-video__box'
						 preload="auto"
						 controls
						>
					<source src={webm} />

					<p>Ваш браузер не поддерживает просмотр</p>
					<a href={webm}>Скачать видео</a>
				</video>
			</div>
		</Hoc>)
	}*/
    componentWillReceiveProps(nextProps) {
		const { id_treatment: next_id_treatment, 
			receptionId: nextReceptionId, 
			isCalling: nextIsCalling } = nextProps;
		const { id_treatment, receptionId, isCalling } = this.props;
		this.isSafari && 
			(next_id_treatment !== id_treatment || nextReceptionId !== receptionId || nextIsCalling !== isCalling)
				&& (
					this.startPlayVideo(this.videoOut, this.videoOutPlayInterval),
					this.videoIn && this.videoIn.play()
				);
        this.setState({isActive: nextProps.filesActive})
	}
	componentDidMount(){
		this.isSafari && this.startPlayVideo(this.videoOut, this.videoOutPlayInterval);
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
	componentWillUnmount(){
		clearInterval(this.videoInPlayInterval);
		clearInterval(this.videoOutPlayInterval);
	}

    filesRender = () => {
        const files = this.props.treatmFiles;
        return files.map((item, index) => {
        	if(item.data.length) {
                return (<ChatFiles {...item} key={index}/>)
			}

        });
    };
    toggleFilesArea = () => {
        (!this.state.isActive) && this.props.getAllFilesTreatment(this.props.id_treatment);
        this.setState(prev => ({isActive: !prev.isActive}));
	}
	setVideoOutRef = (video) => {
		this.isSafari && (this.videoOut = video); 
        this.props.setVideoOut(video);
	}
	setVideoInRef = (video) => {
		this.isSafari && (
			this.videoIn = video,
			video && video.play()
		);
        this.props.setVideoIn(video);
    }

	renderVideos = () => (
		<Hoc>
			<video className='chat-card-video__box'
						poster={this.props.avatar}
						autoPlay
						ref={this.setVideoOutRef}
						></video>
			<video className='chat-card-video__mini'
						autoPlay
						ref={this.setVideoInRef}
						id='setVideoInRef'
						></video>
		</Hoc>
	)
	renderSafariVideos = () => (
		<Hoc>
			<video className='chat-card-video__box'
						poster={this.props.avatar}
						playsInline
						ref={this.setVideoOutRef}
						></video>
			<video className='chat-card-video__mini'
						playsInline
						ref={this.setVideoInRef}
						id='setVideoInRef'
						></video>
		</Hoc>
	)
	renderCallArea = () => {
		const panelClass = cn('chat-card-video__panel', {'chat-card-video__panel-active': this.props.isActiveChat});

		let {s, m, h} = this.props.timer;
		return (<Hoc>
			<div className='chat-card-video__area'>
				{this.isSafari ? this.renderSafariVideos() : this.renderVideos()}
                <div className={panelClass}>
                    {this.props.receptionId &&(
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
                            sec= {s}
                            min={m}
							isUser={this.props.isUser}
                            hour={h}
                            isCalling={this.props.isCalling}/>)}

                </div>
			</div>


		</Hoc>)
	}


    render() {
        const {isActive,isActiveChat, onVideoCallBegin, onVideoCallStop} = this.props;
		const dialogsClass = cn('chat-card-dialogs', 'chat-card-dialogs-row', {'chat-card-dialogs-active': isActive});
		const filesClass = cn('chat-card-files', {'chat-card-files-active': isActiveChat});
        const attachmentsClass = cn('chat-card-files', {'chat-card-files-active': this.state.isActive});

			let videoContent = /*this.props.isEnded ?
			this.renderPlayer() :*/ this.renderCallArea()

        return (

            <div className={dialogsClass}>
				{videoContent}
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

export default ChatVideoContent
