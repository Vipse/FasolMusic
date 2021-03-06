import React from 'react';
import PropTypes from 'prop-types'

import { Input, Upload, Modal } from 'antd';
import Button from '../Button'

import {previewFile} from '../../helpers/modifyFiles'

import './style.css'
import '../../icon/style.css'

class ChatSend extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: props.value,
            fileList: [],
            generatedList: [],
            isGenerated: true
        }
    }

    modifyFiles = (file, ) => {
        let that = this;
        this.setState({isGenerated: false});
            previewFile(file.originFileObj, function (previewDataUrl) {
                file.thumbUrl = previewDataUrl;

                that.setState({
                    isGenerated: true,
                });
                that.props.uploadFiles(file)
            });
    };

    pushFiles = (e) => {
        console.log(e);
        this.modifyFiles(e.file);
    };

    sendHandler = () => {
        this.inp.focus();
        this.state.value && (this.props.send({
            text: this.state.value,
            date: Math.floor(Date.now()/1000),
        }),
        this.setState({value: ''}));
    };

    componentDidMount(){
        this.inp.focus();
    }

    fileAddingHandler = (e) => {
        const {disable} = this.props;
        if(!disable) {
            this.pushFiles(e,false);
        }
        else {
            Modal.error({
                title: 'Не удалось прикрепить файл',
              });
        }
    };

    render(){
        const { TextArea } = Input;
        const {message, attachment, disable} = this.props;

        return (
            <div className='message__send'>
                <div className='message__send-area'>
                    <TextArea
                        ref={inp => this.inp = inp}
                        value = {this.state.value}
                        onChange={e => {
                            e.target.value.charCodeAt(e.target.value.length - 1) === 10
                                ? (this.sendHandler())
                                : this.setState({value: e.target.value})
                        }}
                        placeholder="Ваше сообщение..."
                        disabled={this.props.disable}
                        autosize/>
                </div>
                <div className='message__send-btns'>
                    {!this.props.isStudent && !this.props.disable ?
                        (<Button
                            btnText='Остановить тренировку'
                            size='small'
                            type='light-pink'
                            onClick={this.props.closeVisit}
                        />) : null}
                    <Upload
                        //multiple={true}
                        showUploadList={false}
                        fileList={this.state.fileList}
                        onChange={this.fileAddingHandler}>
                        <Button
                            btnText=''
                            size='small'
                            type='no-brd'
                            icon='clip'
                            title='Прикрепить файл'
                        />
                    </Upload>
                    {this.state.isGenerated && <Button
                        className='message__send-send'
                        btnText=''
                        title='Отправить сообщение'
                        onClick={this.sendHandler}
                    />}
                </div>
            </div>
        )
    }
}

ChatSend.propTypes = {
    value: PropTypes.string,
    attachment: PropTypes.string,
    disable: PropTypes.bool,
    send: PropTypes.func,
    closeVisit: PropTypes.func,
    isStudent: PropTypes.bool,
    isCurVisEnd: PropTypes.bool,
    makeReview: PropTypes.func,
};

ChatSend.defaultProps = {
    value: '',
    attachment: '',
    disable: true,
    send: () => {},
    closeVisit: () => {},
    isStudent: false,
    isCurVisEnd: false,
    makeReview: () => {},
};

export default ChatSend
