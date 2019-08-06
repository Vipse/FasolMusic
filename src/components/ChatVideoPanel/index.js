import React from 'react';
import PropTypes from 'prop-types'

import Button from '../Button'
import Hoc from '../Hoc'

import './style.css'
import '../../icon/style.css'

class ChatVideoPanel extends React.Component{

    checkTimeFormat = (number) => {
        return (''+number).length < 2 ? '0'+number : number;
    };

    sendPushNotification = () => {
        const {calledID,callerName} = this.props;
        let type = 'call';

        if (this.props.user_mode=='student') type = "call_To_Master"
        else if (this.props.user_mode=='master') type = "call_To_Student"

		this.props.getPushNotificationsToken(calledID,false)
		.then(token => {
			if (token != false) this.props.sendPushNotification(token,type,callerName)
		})
		
	}

    render(){
        const {isCalling, sec, min, hour, disabled, isFullScreen, user_mode} = this.props;


        return (
            <div className='message__panel'>

                {isCalling ?
                <Hoc>
                    <div className="message__panel-duration">
                        {this.checkTimeFormat(hour)} : {this.checkTimeFormat(min)} : {this.checkTimeFormat(sec)}
                    </div>
                    <div className="message__panel-btns">
                        <Button
                            btnText=''
                            className='btn-endcall'
                            size='small'
                            type='no-brd'
                            icon='end-call-button'
                            iconSize={9}
                            title='Завершить звонок'
                            onClick={this.props.onStop}
                        />
                    </div>
                    <div className="message__panel-full">
                        <Button
                            btnText=''
                            size='small'
                            type='no-brd'
                            icon='chat1'
                            iconSize={16}
                            onClick={this.props.onChat}
                        />
                    </div>
                    <div className="message__panel-full">
                        <Button
                            btnText=''
                            size='small'
                            type='no-brd'
                            icon={isFullScreen ? 'exit_fullscreen' : 'fullscreen'}
                            iconSize={18}
                            title={isFullScreen ? 'Выйти из полноэкранного режима' : 'Во весь экран'}
                            onClick={this.props.onFullScreen}
                        />
                    </div>
                </Hoc>
                :
                <Hoc>
                    {!disabled && <div className="message__panel-btns startcall">
                        <Button
                            className='btn-call'
                            btnText=''
                            size='small'
                            type='no-brd'
                            icon='phone-call-outcoming'
                            iconSize={15}
                            title='Начать разговор'
                            onClick={()=>{
                                this.props.onCall()
                                this.sendPushNotification()
                            }}
                        />

                        {/*user_mode === 'student' ? 
                            <Button
                                id="connect"
                                className='btn-piano toggle-client'
                                btnText=''
                                size='small'
                                type='no-brd'
                                icon='team'
                                iconSize={15}
                                title='Пианино'
                                onClick={null}
                            /> :
                            <Button
                                id="connect"
                                className='btn-piano toggle-server'
                                btnText=''
                                size='small'
                                type='no-brd'
                                icon='team'
                                iconSize={15}
                                title='Пианино'
                                onClick={null}
                            /> 
                    
                */}
                        
                    </div>}
                    <div className="message__panel-full">
                        <Button
                            btnText=''
                            size='small'
                            type='no-brd'
                            icon='chat1'
                            iconSize={16}
                            onClick={this.props.onChat}
                        />
                    </div>
                </Hoc>
                }
            </div>
        )
    }
}

ChatVideoPanel.propTypes = {
    sec: PropTypes.number,
    min: PropTypes.number,
    hour: PropTypes.number,
    isCalling: PropTypes.bool,
    isStudent: PropTypes.bool,
    disabled: PropTypes.bool,
    onStop: PropTypes.func,
    onCall: PropTypes.func,
    uploadFiles: PropTypes.func,
    onChat: PropTypes.func,
    onFullScreen: PropTypes.func,
};

ChatVideoPanel.defaultProps = {
    sec: 0,
    min: 0,
    hour: 0,
    isCalling: false,
    isStudent: false,
    disabled: false,
    onStop: () => {},
    onCall: () => {},
    uploadFiles: () => {},
    onChat: () => {},
    onFullScreen: () => {},
};

export default ChatVideoPanel
