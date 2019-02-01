import React from 'react'
import {connect} from 'react-redux';
import Row from '../../components/Row'
import Col from '../../components/Col'
import ChatDialogs from "../../components/ChatDialogs";
import Hoc from '../../hoc'

import ChatCard from './ChatCard'

import * as actions from '../../store/actions'

class Chat extends React.Component{
    state = {
        displayChat: true //TO DO make it false and just display for selected user
    };

    componentDidMount(){
        this.props.onGetTodayVisits();
        console.log('chat version 1.0');
        this.props.onGetChatHistory(this.props.idTraining);
    }

    componentWillMount(){
        //this.props.getTodayReceptions();
    }

    componentWillUnmount(){
        this.props.clearTodayReceptions();
        this.props.clearSelectionsTRandVIS();
    }

    render(){
        //console.log('visitInfo',this.props.visitInfo)
        //console.log('treatInfo',this.props.treatInfo)
        let  id_user, id_doc, name, name_doc, avatar, name_user, status, avatar_doc, chat, visitId, contactLevel, comment, id_treatment;

        this.props.fromTR_VIS === 1 ? (
            {id_user,name_user: name, avatar, name_doc, contactLevel, name_user, avatar_doc, status, chat, id_treatment} = this.props.treatInfo
        ) : (
            {id_user,id_doc,name, name_doc, id: visitId, contactLevel,comment, chat, avatar, avatar_doc, status, id_treatment} = this.props.visitInfo
        )
        const isUser = this.props.user_mode === "student";
        console.log();

      
      
        const chatProps = {
            wsURL: 'wss://web.fasolonline.ru:8443/one2one',
            callback: this.props.callback,
            clearCallback: this.props.clearCallback,
            timer: this.props.timer,
            chatStory: this.props.chatStory,
            receptionStarts: this.props.trainingStarts,
            isCalling: this.props.isCalling,
            receptionId: this.props.idTraining,
            callerID: this.props.id,
            calledID: this.props.idTo,
            user_mode: this.props.user_mode,
            user_id: +id_user,
            patientName: this.props.interlocutorName,
            id_treatment,
            online: +status,
            avatar: isUser? avatar_doc: avatar,
            chat,
            comment,
            uploadFile: this.props.uploadFile,
            setReceptionStatus: this.props.setReceptionStatus,
            setChatToId: this.props.setChatToId,
            uploadConclusion: this.props.uploadConclusion,
            getAllFilesTreatment: this.props.getAllFilesTreatment,
            treatmFiles: this.props.treatmFiles,
            appShouldStartAt: this.props.visitInfo.date
        };

        console.log('chatProps', chatProps);
        return (
            <Hoc>
                <Row>
                    {this.state.displayChat && <Col xs={24} xxl={24} className='section'>
                        {
                            isUser ? (
                                <ChatCard {...chatProps}
                                          mode={this.props.conversationMode}
                                        //isEnded = {true}
                                          onSelectReception={this.props.onSelectReception}
                                          completeReception={this.props.completeReception}
                                          closeTreatm={this.props.closeTreatment}
                                          fromTR_VIS={2}
                                          isUser={true}
                                />
                            ) : (
                                <ChatCard {...chatProps}
                                          mode={this.props.conversationMode}
                                        //isEnded = {true}
                                          onSelectReception={this.props.onSelectReception}
                                          changeReceptionStatus={this.props.changeReceptionStatus}
                                          completeReception={this.props.completeReception}
                                          closeTreatm={this.props.closeTreatment}
                                          onUploadChatHistory={this.props.onUploadChatHistory}
                                          uploadConclusion={this.props.uploadConclusion}
                                          fromTR_VIS={2}/>
                            )
                        }
                    </Col>
                    }
                </Row>
            </Hoc>
        )
    }
}

const mapStateToProps = state =>{
    return {
        id: state.auth.id,
        user_mode: state.auth.mode,
        abonement: state.abonement,
        profileStudent: state.profileStudent,

        schedules: state.schedules.schedules,
        visits: state.schedules.visits,
        visitInfo: state.treatments.visitInfo,
        treatInfo: state.treatments.treatInfo,
        treatmFiles: state.treatments.treatmFiles,
        fromTR_VIS: state.treatments.from,
        callback: state.treatments.callback,

        chatStory: state.chatWS.chatStory,
        trainingStarts: state.chatWS.trainingStarts,
        isCalling: state.chatWS.isCalling,
        timer: state.chatWS.timer,
        idTo: state.chatWS.to,
        idTraining: state.chatWS.idTraining,
        conversationMode: state.chatWS.conversationMode,
        interlocutorName: state.chatWS.interlocutorName
    }
}

const mapDispatchToProps = dispatch => {
	return {
        completeReception: (obj) => dispatch(actions.completeReception(obj)),
        closeTreatment: (id) => dispatch(actions.closeTreatment(id)),
        onUploadChatHistory: (id, chatHistory) => dispatch(actions.uploadTrainingChatHistory(id, chatHistory)),
        onGetChatHistory: (id, chatHistory) => dispatch(actions.getTrainingChatHistory(id, chatHistory)),
        //getTodayReceptions: () => dispatch(),
        onSelectReception: (id) => dispatch(actions.seletVisit(id)),
        clearTodayReceptions: () => dispatch(actions.clearIntervals()),
        onGetTodayVisits: (start, end) => dispatch(actions.getTodayVisits(start, end)),
        clearSelectionsTRandVIS: () => dispatch(actions.clearSelections()),
        uploadFile: (id_zap, id_user, file, callback) => dispatch(actions.uploadChatFile(id_zap,id_user, file,callback)),
        uploadConclusion: (id_zap, file, callback) => dispatch(actions.uploadConclusion(id_zap,file,callback)),
        getAllFilesTreatment: (treatmId) => dispatch(actions.getAllFilesTreatment(treatmId)),
        changeReceptionStatus: (id, key) => dispatch(actions.changeReceptionStatus(id,key)),
        getReceptionDuration: (id) => dispatch(actions.getReceptionDuration(id)),

        setReceptionStatus: (isStart) => dispatch(actions.setReceptionStatus(isStart)),
        setChatToId: (id) => dispatch(actions.setChatToId(id)),
        clearCallback: () => dispatch(actions.clearCallback()),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
