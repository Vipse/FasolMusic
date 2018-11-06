import React from 'react';

import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from "moment"
import {message} from "antd"


import Button from '../../../components/Button'
import CompletionReceptionModal from "../../../components/CompletionReceptionModal";
import CompleteAppeal from '../../../components/CompleteAppeal'
import NewVisitModalPage from "../../../components/NewVisitModalPage";
import ChatTextContent from './ChatTextContent'
import ChatVideoContent from './ChatVideoContent'
import ChatAudioContent from './ChatAudioContent'
import Hoc from '../../../hoc'

import {
	startReception, call, stop, messAboutStop, messForCloseReception, fileUploadCallback,
	sendMessage, setVideoIn, setVideoOut
} from '../../App/chatWs'

import './style.css'


class ChatCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
			isActiveChat: true,
			mode: this.props.mode,
			isCurVisEnd: false,

			duration: 0,


			reception_vis: false,
			treatment_vis: false,
			visit_vis: false,
		}
    }





	componentWillReceiveProps(nextProps){
		// ---- TO FIX (chack)
		((''+this.props.receptionId != ''+nextProps.receptionId) && nextProps.user_mode === "doc")
				&& (
					this.props.setReceptionStatus(false),
					this.setState({isCurVisEnd: false}),
					this.props.setChatToId(nextProps.calledID)
				);


		//---------
		''+this.state.mode != ''+nextProps.mode
			&& this.setState({mode: nextProps.mode})
	}

	componentDidUpdate(prevProps){
		(this.props.callback !== prevProps.callback) && this.props.callback instanceof Function ?
				(this.props.callback(), this.props.clearCallback()) : null;
	}

	startReceptionHandler = () => {
    	// if(this.props.appShouldStartAt > +moment().format("X")+300) {
    	// 	message.error("Приём можно начать за 5 минут до указанного времени")
    	// 	return;
		// }

		startReception();
		this.props.changeReceptionStatus(this.props.receptionId, "begin")
	}

	onCall = () => {
        // if(this.props.appShouldStartAt > +moment().format("X")+300) {
        //     return;
        // }
		call();
	}

	onStop = () => {
		messAboutStop();
		stop();
	}

	beforeCloseReseption = () => {
		/* НЕ ДЕЛАЕМ завершение чата, обнуление истории на сервере*/
		this.setState({reception_vis: true});
	}

	onCloseReception = (obj) => {
		/* завершение чата, обнуление истории на сервере */
		console.log("Завершение приёма и чата", this.props.receptionId)
		messAboutStop();
		stop();
		messForCloseReception(this.props.receptionId);
		let new_obj = {
			...obj,
			id: this.props.receptionId,
			chat: this.props.chatStory,
		}
		this.props.completeReception(new_obj);
		this.props.setReceptionStatus(false);
		this.props.changeReceptionStatus(this.props.receptionId, "finish");

		this.setState({reception_vis: false,treatment_vis: true, isCurVisEnd: true});
		this.props.extr ?
			this.setState({reception_vis: false})
			: this.setState({reception_vis: false,treatment_vis: true});
	}

	onCloseTreatment = () => {
		this.props.closeTreatm(this.props.id_treatment);
		this.setState({treatment_vis: false});
	}

	onAddVisit = (obj) => {
		this.setState({reception_vis: false,treatment_vis: true});
	}

	uploadOnlyFile = (id_zap, id_user, callback) => {
		return (file, isConclusion) => {
			isConclusion ? (
				this.props.uploadConclusion(id_zap,file, callback)
			)

				: this.props.uploadFile(id_zap,id_user, file,callback);
			this.state.isActive && this.props.getAllFilesTreatment(this.props.id_treatment);
		}
	}

	toggleFilesArea = () => {
		(!this.state.isActive) && this.props.getAllFilesTreatment(this.props.id_treatment);
		this.setState(prev => ({isActive: !prev.isActive}));
	}
    getIconByType = () => {
		let icon;
        switch (this.state.mode) {
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
        return icon
    };
    render() {
		const {patientName, user_id, online: onl} = this.props;
		const online = +onl ?'online' :  'offline';
		const iconType = this.getIconByType();
        const statusClass = cn('chat-card-status', `chat-card-${online}`);

        const dialogsClass = cn('chat-card-dialogs', {'chat-card-dialogs-active': this.state.isActive});

		let content;
		const chatProps= {
			from: this.props.callerID,
			to: this.props.calledID,
			avatar: this.props.avatar,
			online: this.props.online,
			chatStory: [...this.props.chat, ...this.props.chatStory],
			sendMessage: sendMessage,
			onEnd: this.beforeCloseReseption,
			onBegin: this.startReceptionHandler,
			receptionStarts: this.props.receptionStarts,
			fromTR_VIS: this.props.fromTR_VIS,
			user_mode: this.props.user_mode,
			uploadFile: this.uploadOnlyFile(this.props.receptionId, this.props.isUser ? this.props.callerID: this.props.calledID, fileUploadCallback),
			receptionId: this.props.receptionId,
			isCurVisEnd: this.state.isCurVisEnd,
			treatmFiles: this.props.treatmFiles,
			id_treatment: this.props.id_treatment,
			getAllFilesTreatment: this.props.getAllFilesTreatment,
			filesActive: this.state.isActive,
            isUser: this.props.isUser
		};
		const chatAdditionalProps = {
			setVideoOut: (video)=>setVideoOut(video),
			setVideoIn: (video)=>setVideoIn(video),
			onStop: this.onStop,
			onCall: this.onCall,
			onChat: () => this.setState(prev => ({isActiveChat: !prev.isActiveChat})),
			timer: this.props.timer,
			isCalling: this.props.isCalling,
			isActiveChat: this.state.isActiveChat,
			isEnded: this.props.isEnded,
        }

        switch (this.state.mode) {
            case 'chat':
                content = <ChatTextContent isActive={this.state.isActive}
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



        return (
			<Hoc>
            <div className='chat-card'>
                <div className='chat-card-head'>
                    <div className='chat-card-title'>
                        <Button
                            icon={iconType}
                            title='Тип приёма'
                            style={{color: "white", padding: 0, width: "auto"}}
                        />

                        <div className='chat-card-namePatient'>{patientName}</div>
                        <div className={statusClass}>{online}</div>
                    </div>
                    <div className='chat-card-btns'>

                        <div className='chat-card-archive'>
                            <Button
                                btnText=''
                                size='small'
                                type='no-brd'
                                icon='file'
                                svg
                                title='Открыть прикреплённые файлы'
                                style={{width: 30}}
                                onClick={this.toggleFilesArea}
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
			<CompletionReceptionModal
				visible={this.state.reception_vis}
				onComplete={this.onCloseReception}
				onCancel={() => this.setState({reception_vis: false})}
			/>
			<CompleteAppeal
				visible={this.state.treatment_vis}
				onCancel={() =>  this.setState({treatment_vis: false})}
				onAdd={() => this.setState({treatment_vis: false, visit_vis: true})}
				onComplete={this.onCloseTreatment}
			/>
			<NewVisitModalPage
				visible={this.state.visit_vis}
				onCancel={() => this.setState({visit_vis: false, treatment_vis: true})}
				userName={patientName}
				id={user_id}
				onSave={e=> console.log('[NewVisitModal]', e)}
			/>
			</Hoc>
        )
    }
}

ChatCard.propTypes = {
	chat: PropTypes.array,
	patientName: PropTypes.string,
	user_id: PropTypes.number,
    online: PropTypes.number,//oneOf(['offline', 'online']),
    isActive: PropTypes.bool,
	mode: PropTypes.oneOf(['chat', 'voice', "video"]),
	isEnded: PropTypes.bool,
	treatmFiles: PropTypes.array,
	changeReceptionStatus: PropTypes.func,
	uploadFile: PropTypes.func,
	getAllFilesTreatment: PropTypes.func,
	setChatToId: PropTypes.func,

    videoContent: PropTypes.node,
};

ChatCard.defaultProps = {
    treatmFiles: [],
	patientName: '',
	user_id: 0,
    online: 0,
    isActive: false,
	mode: 'chat',
	chat: [],
	changeReceptionStatus: () => {},
	uploadFile: () => {},
	getAllFilesTreatment: () => {},
	setChatToId: () => {},
};

export default ChatCard
