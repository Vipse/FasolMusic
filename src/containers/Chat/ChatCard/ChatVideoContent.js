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
		this.state = {
			isFullScreen: false
		};

		this.isSafari = browser ? browser.name === 'safari' || browser.os === 'iOS' : true;
		this.videoArea = null;
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
	}

	componentDidMount(){
		this.isSafari && this.startPlayVideo(this.videoOut, this.videoOutPlayInterval);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
    	if (prevProps.isCalling !== this.props.isCalling) this.setState({isFullScreen: this.isFullScreen()});
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
	};

	componentWillUnmount(){
		clearInterval(this.videoInPlayInterval);
		clearInterval(this.videoOutPlayInterval);
	}

    filesRender = () => {
        const files = [];
        return files.map((item, index) => {
        	if(item.data.length) {
                return (<ChatFiles {...item} key={index}/>)
			}
        });
    };

	setVideoOutRef = (video) => {
		this.isSafari && (this.videoOut = video);
		this.props.setVideoOut(video);
	};

	setVideoInRef = (video) => {
		this.isSafari && (
			this.videoIn = video,
			video && video.play()
		);
		this.props.setVideoIn(video);
    };

	renderVideos = () => (
		<Hoc>
			<video className='chat-card-video__box'
				   		poster=''
				   		autoPlay
						ref={this.setVideoOutRef}
			/>
			<video className='chat-card-video__mini'
						autoPlay
						ref={this.setVideoInRef}
						id='setVideoInRef'
			/>
		</Hoc>
	);

	renderSafariVideos = () => (
		<Hoc>
			<video className='chat-card-video__box'
				   poster=''
				   playsInline
				   ref={this.setVideoOutRef}
			></video>
			<video className='chat-card-video__mini'
				   playsInline
				   ref={this.setVideoInRef}
				   id='setVideoInRef'
			></video>
		</Hoc>
	);

	isFullScreen = () => !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen
		|| document.msFullscreenElement || document.fullscreenElement);

	handleFullScreen = () => {
		if (this.isFullScreen()) {
			if (document.exitFullscreen) document.exitFullscreen();
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
			else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
			else if (document.msExitFullscreen) document.msExitFullscreen();
			this.changeFullScreenState(false);
		}
		else {
			if (this.videoArea.requestFullscreen) this.videoArea.requestFullscreen();
			else if (this.videoArea.mozRequestFullScreen) this.videoArea.mozRequestFullScreen();
			else if (this.videoArea.webkitRequestFullScreen) this.videoArea.webkitRequestFullScreen();
			else if (this.videoArea.msRequestFullscreen) this.videoArea.msRequestFullscreen();
			this.changeFullScreenState(true);
		}
	};

	changeFullScreenState = (isActive) => {
		this.setState({isFullScreen: isActive});
	};

	renderCallArea = () => {
		const panelClass = cn('chat-card-video__panel', {'chat-card-video__panel-active': this.props.isActiveChat});

		let {s, m, h} = this.props.timer;

		return (<Hoc>
			<figure className='chat-card-video__area' ref={videoArea => this.videoArea = videoArea}>
				{this.isSafari ? this.renderSafariVideos() : this.renderVideos()}
                <div className={panelClass}>
                    {this.props.idTraining ? (
                        <ChatVideoPanel
                            onStop={() => {
                                this.props.onStop();
                            }}
                            onCall={() => {
                                !this.props.trainingStarts &&
                                this.props.onBegin();
                                this.props.onCall();
                            }}
                            onChat = {this.props.onChat}
							isFullScreen={this.state.isFullScreen}
							onFullScreen={this.handleFullScreen}
                            uploadFiles={this.props.uploadFile}
                            sec={s}
                            min={m}
							disabled={false /*replace on prod: this.props.isComplete || !this.props.trainingStarts*/}
                            hour={h}
                            isCalling={this.props.isCalling}/>) : null}

                </div>
			</figure>


		</Hoc>)
	};

    render() {
        const {isActiveFiles, isActiveChat, onVideoCallBegin, onVideoCallStop} = this.props;
		const dialogsClass = cn('chat-card-dialogs', 'chat-card-dialogs-row', {'chat-card-dialogs-active': isActiveFiles});
		const filesClass = cn('chat-card-files', {'chat-card-files-active': isActiveChat});
        const attachmentsClass = cn('chat-card-files', {'chat-card-files-active': isActiveFiles});

			let videoContent = /*this.props.isEnded ?
			this.renderPlayer() :*/ this.renderCallArea();

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
							isActiveFiles && <div className='chat-card-files__items'>
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
