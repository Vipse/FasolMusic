import React from 'react';

import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from "moment"


import Button from '../../../components/Button'
import CompletionTrainingModal from "../../../components/CompletionTrainingModal";
import ChatTextContent from './ChatTextContent'
import ChatVideoContent from './ChatVideoContent'
import ChatAudioContent from './ChatAudioContent'
import Hoc from '../../../hoc'


import { detect } from 'detect-browser';

import {
	startReception, call, stop, messAboutStop, messForCloseReception, fileUploadCallback,
	sendMessage, setVideoIn, setVideoOut
} from '../../App/chatWs'

import './style.css'
import {Modal as PopupModal, Modal} from "antd";
import ProfileAvatar from "../../../components/ProfileAvatar";

const browser = detect();

class ChatCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	chat: [],
            isActiveFiles: false,
			isActiveChat: true,
			isCurTrainingEnd: true,
			completionModalVisible: false,
			showEndDescriptionModal: false
		}
	}

	componentDidMount() {
		const {idTraining, user_mode, isComplete, isTrial, beginTime, trainingStarts} = this.props;

		if (idTraining) {
			if (user_mode === "student") {
				!isComplete && isTrial && this.trialInfoModal();
				if (!isComplete && !trainingStarts && moment() < moment(beginTime)) this.notBeganModal();
			}

			if (!isComplete) {
				this.props.changeTrainingStatus(true);
				this.setState({isCurTrainingEnd: false});
				startReception();
			}
			else {
				this.props.changeTrainingStatus(false);
				this.setState({isCurTrainingEnd: true});
			}
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
    	if (prevProps.trainingStarts !== this.props.trainingStarts && !this.props.trainingStarts
		&& this.props.isStudent) {
			if (this.props.isTrial) this.finishedTrialModal();
			else this.setState({showEndDescriptionModal: true});
		}
	}

	componentWillUnmount() {
		this.onStop();
	}

	finishedTrialModal = () => {
		Modal.warning({
			title: 'Отлично потренировались! :)',
			width: '500px',
			className: 'fast-modal',
			content: 'Вы конечно хотите продолжать и специально для вас, ' +
				'если вы произведете оплату в течении 24 часов, ' +
				'мы вам подарим еще 1 бесплатную тренировку!',
			maskClosable: true,
			okText: 'Оплатить',
			onOk: () => this.props.goToPayment()
		});
	};

	notBeganModal = () => {
		Modal.confirm({
			title: 'Тренировка еще не началась',
			width: '500px',
			className: 'fast-modal',
			content: 'Тренировка пока еще не началась, нужно подождать до ' +
				moment(this.props.beginTime).format('HH:mm DD MMM') + ' Как только начнется тренировка ' +
				'коуч сам вам позвонит и не забудьте принять вызов! :) Но вы всегда можете написать ему в чат :)',
			maskClosable: false,
			okText: 'Хорошо',
			cancelText: 'Вернуться к списку',
			onCancel: this.props.onExitTraining
		});
	};

	trialInfoModal = () => {
		PopupModal.info({
			title: 'Что нужно для пробного!',
			width: '500px',
			className: 'fast-modal',
			content: 'Подготовьте камеру и микрофон, проверьте интернет-соединение ' +
				'и подготовьте инструмент если вы гитарист, а все остальное сделаем мы! ' +
				'Только не пропустите наш звонок!) P.S. Лучше зайти на платформу за 10 минут :)',
			okText: 'Ясно :)',
			zIndex: 1025
		});
	};

	startTrainingHandler = () => {
		startReception();
	};

	onCall = () => {
		call();
	};

	onStop = () => {
		messAboutStop();
		stop();
	};

	beforeCloseTraining = () => {
		this.setState({completionModalVisible: true});
	};

	onCloseTraining = (markAs) => {
		const {idTraining} = this.props;

		messAboutStop();
		stop();

		(markAs === 'complete' ? this.props.completeTraining({idTraining}) : this.props.tailTraining({idTraining}))
			.then(res => {
				console.log(res);
				messForCloseReception(idTraining, markAs);
				this.props.changeTrainingStatus(false);
				this.setState({isCurTrainingEnd: true});
			});

		this.setState({completionModalVisible: false});
	};

	/*uploadOnlyFile = (id_zap, id_user, callback) => {
		return (file, isConclusion) => {
			isConclusion ? (
				this.props.uploadConclusion(id_zap,file, callback)
			)

				: this.props.uploadFile(id_zap,id_user, file,callback);
			this.state.isActiveFiles && this.props.getAllFilesTreatment(this.props.id_treatment);
		}
	};*/

	toggleFilesArea = () => {
		this.setState(prev => ({isActiveFiles: !prev.isActiveFiles}));
	};

	handleChangeType = () => {
		const {mode, isCalling} = this.props;
		const types = ['chat', 'video'];

		if (!isCalling) {
			const prevTypeIndex = types.indexOf(mode);
			const nextTypeIndex = prevTypeIndex === types.length - 1 ? 0 : prevTypeIndex + 1;

			this.props.setConversationMode(types[nextTypeIndex]);
		}
	};

    getIconByType = () => {
    	const {mode} = this.props;
		let icon;

        switch (mode) {
            case 'chat':
                icon = "chat1";
                break;
            case 'voice':
                icon =  "telephone";
                break;
            case "video":
                icon =  "video-camera";
                break;
			default:
				icon =  "chat1";
        }
        return icon;
    };

    render() {
		const {interlocutorName, interlocutorAvatar, online} = this.props;
		const iconType = this.getIconByType();
        const statusClass = cn('chat-card-status', `chat-card-${online}`);
        const dialogsClass = cn('chat-card-dialogs', {'chat-card-dialogs-active': this.state.isActiveFiles});

		let content;
		const chatProps = {
			from: this.props.callerID,
			to: this.props.calledID,
			online: this.props.online,
			chatStory: [...this.state.chat, ...this.props.chatStory],
			loadingChatStory: this.props.loadingChatStory,
			sendMessage: sendMessage,
			onEnd: this.beforeCloseTraining,
			onBegin: this.startTrainingHandler,
			trainingStarts: this.props.trainingStarts,
			user_mode: this.props.user_mode,
			interlocutorAvatar: this.props.interlocutorAvatar,
			//uploadFile: this.uploadOnlyFile(this.props.idTraining, this.props.isUser ? this.props.callerID: this.props.calledID, fileUploadCallback),
			idTraining: this.props.idTraining,
			isCurTrainingEnd: this.props.isCurTrainingEnd,
			showEndDescription: this.state.showEndDescriptionModal,
			isActiveFiles: this.state.isActiveFiles,
			isStudent: this.props.isStudent,
			isComplete: this.props.isComplete
		};
		const chatAdditionalProps = {
			setVideoOut: (video) => setVideoOut(video),
			setVideoIn: (video) => setVideoIn(video),
			onStop: this.onStop,
			onCall: this.onCall,
			onChat: () => this.setState(prev => ({isActiveChat: !prev.isActiveChat})),
			timer: this.props.timer,
			isCalling: this.props.isCalling,
			isActiveChat: this.state.isActiveChat
        };

		switch (this.props.mode) {
			case 'chat':
				content = <ChatTextContent
					{...chatProps}
					{...chatAdditionalProps}
				/>;
                break;
            case 'voice':
                content = <ChatAudioContent
                    {...chatProps}
                    {...chatAdditionalProps}
                />;
                break;
            case "video":
                content = <ChatVideoContent
                    {...chatProps}
                    {...chatAdditionalProps}
                />;
                break;
        }

		if (browser && browser.os === 'iOS') return (
			<div className='chat-card-incompatible'>
				<p>Чат не поддерживается на данном устройстве.</p>
			</div>
		);
		else return (
			<Hoc>
				<div className='chat-card'>
					<div className='chat-card-head'>
						<div className='chat-card-title'>
							<Button
								icon={iconType}
								title='Тип связи'
								type='go'
								onClick={this.handleChangeType}
							/>
							<div className='chat-card-title-avatar'><ProfileAvatar img={interlocutorAvatar}
																					size='small'/></div>
							<div className='chat-card-title-name'>{interlocutorName}</div>
							{/*<div className={statusClass}>{online}</div>*/}
						</div>
						<div className='chat-card-btns'>
							<div className='chat-card-archive'>
								<Button
									btnText=''
									size='small'
									type='upload'
									icon='file'
									title='Открыть прикреплённые файлы'
									style={{width: 30}}
									onClick={this.toggleFilesArea}
								/>
								<Button
									btnText=''
									size='small'
									type='upload'
									icon='exit'
									title='Выйти из чата'
									onClick={() => {
										this.onStop();
										this.props.onExitTraining();
									}}
								/>
							</div>
						</div>
					</div>
					<div className='chat-card-body'>
						<div className={dialogsClass}>
							{content}
						</div>
					</div>
				</div>
				<CompletionTrainingModal
					visible={this.state.completionModalVisible}
					onComplete={() => this.onCloseTraining('complete')}
					onTail={() => this.onCloseTraining('transfer')}
					onCancel={() => this.setState({completionModalVisible: false})}
				/>
			</Hoc>
        )
    }
}

ChatCard.propTypes = {
	interlocutorName: PropTypes.string,
    online: PropTypes.bool,
	mode: PropTypes.oneOf(['chat', 'voice', "video"]),
	isEnded: PropTypes.bool,
	completeTraining: PropTypes.func,
	changeTrainingStatus: PropTypes.func,
	tailTraining: PropTypes.func,
	goToPayment: PropTypes.func,
	onExitTraining: PropTypes.func
};

ChatCard.defaultProps = {
	interlocutorName: '',
    online: false,
	mode: 'chat',
	isEnded: false,
	completeTraining: () => {},
	changeTrainingStatus: () => {},
	tailTraining: () => {},
	goToPayment: () => {},
	onExitTraining: () => {}
};

export default ChatCard
