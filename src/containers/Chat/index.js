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
    }

    componentDidMount(){
        this.props.onGetTodayVisits();
        console.log('chat version 1.0');
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
        const isUser = this.props.user_mode === "user";

        const chatProps = {
            //wsURL: 'wss://appdoc.by:8443/one2one',
            wsURL: 'wss://localhost:8443/one2one',
            callback: this.props.callback,
            clearCallback: this.props.clearCallback,
            timer: this.props.timer,
            chatStory: this.props.chatStory,
            receptionStarts: this.props.receptionStarts,
            isCalling: this.props.isCalling,
            receptionId: visitId,
            callerID: this.props.id,
            calledID: isUser ? id_doc : id_user,
            user_mode: this.props.user_mode,
            user_id: +id_user,
            patientName: isUser ? name_doc : name,
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
        }

        return (
            <Hoc>
                <Row>
                    {
                        !isUser && (<Col xs={24} xxl={7} className='section'>
                            <ChatDialogs  data={this.props.visits}
                                          onGotoChat={id =>
                                              {
                                                  this.props.onSelectReception(id);
                                                  this.setState({displayChat: true})
                                              }
                                          }
                            />
                        </Col>)
                    }
                    {this.state.displayChat && <Col xs={24} xxl={17} className='section'>
                        {
                            isUser ? (
                                <ChatCard {...chatProps}
                                          mode={contactLevel}
                                    //isEnded = {true}
                                          onSelectReception={this.props.onSelectReception}
                                          completeReception={this.props.completeReception}
                                          closeTreatm={this.props.closeTreatment}
                                          fromTR_VIS={2}
                                          isUser ={true}
                                />
                            ) : (
                                <ChatCard {...chatProps}
                                          mode={contactLevel}
                                    //isEnded = {true}
                                          onSelectReception={this.props.onSelectReception}
                                          changeReceptionStatus={this.props.changeReceptionStatus}
                                          completeReception={this.props.completeReception}
                                          closeTreatm={this.props.closeTreatment}
                                          uploadConclusion={this.props.uploadConclusion}
                                          fromTR_VIS={this.props.fromTR_VIS}/>
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

        schedules: state.schedules.schedules,
        visits: state.schedules.visits,
        visitInfo: state.treatments.visitInfo,
        treatInfo: state.treatments.treatInfo,
        treatmFiles: state.treatments.treatmFiles,
        fromTR_VIS: state.treatments.from,

        callback: state.treatments.callback,

        chatStory: state.chatWS.chatStory,
        receptionStarts: state.chatWS.receptionStarts,
        isCalling: state.chatWS.isCalling,
        timer: state.chatWS.timer,
    }
}

const mapDispatchToProps = dispatch => {
	return {
        completeReception: (obj) => dispatch(actions.completeReception(obj)),
        closeTreatment: (id) => dispatch(actions.closeTreatment(id)),
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
