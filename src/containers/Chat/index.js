import React from 'react'
import {connect} from 'react-redux';
import Row from '../../components/Row'
import Col from '../../components/Col'
import ChatDialogs from "../../components/ChatDialogs";
import Hoc from '../../hoc'

import ChatCard from './ChatCard'

import * as actions from '../../store/actions'
import ChatTrainingsList from "../../components/ChatTrainingsList";
import moment from "moment";

class Chat extends React.Component{
    state = {
        displayChat: true, //TO DO make it false and just display for selected user
        nearTrainings: []
    };

    componentDidMount(){
        this.props.getSelectors('discipline');
        this.props.onGetTrainingNotFinished(this.props.id, moment().add(1, 'weeks').format('X'), 10);
        let start = moment().format('X');
        let end = moment().add(1, 'weeks').format('X');
        this.props.onGetFutureTrainerTraining(this.props.id, start, end);

        console.log('chat version 1.0');
        this.props.idTraining && this.props.onGetChatHistory(this.props.idTraining);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.studentNearTrainings !== this.props.studentNearTrainings)
            this.setState({nearTrainings: this.prepareNearTrainings()});

        if (prevProps.masterNearTrainings !== this.props.masterNearTrainings)
            this.setState({nearTrainings: this.prepareNearTrainings()});

        if (this.props.idTraining && prevProps.idTraining !== this.props.idTraining)
            this.props.onGetChatHistory(this.props.idTraining);
    }

    componentWillUnmount(){
        this.props.clearTodayReceptions();
        this.props.clearSelectionsTRandVIS();
    }

    goToChat = (idTo, idTraining, interlocutorName) => {
        this.props.onSetChatToId(idTo);
        this.props.onSetChatInterlocutorInfo(interlocutorName);
        this.props.onSetChatTrainingId(idTraining);
    };

    gotoHandler = (id) => {
        const {user_mode} = this.props;
        this.props.onSelectPatient(id);
        this.props.history.push('/app/' + user_mode === 'student' ? 'coach' : 'student' + id);
    };

    prepareNearTrainings = () => {
        const {studentNearTrainings, masterNearTrainings, user_mode, selectors} = this.props;

        if (selectors.discipline) {
            if (user_mode === 'student') {
                return studentNearTrainings.map((item) => {
                    return {
                        name: item.fioMaster,
                        start: +item.start * 1000,
                        end: +item.start * 1000 + 3600000,
                        discipline: item.disciplineSubscription.length ?
                            selectors.discipline.find(discipline => discipline.id === +item.disciplineSubscription[0]).nameRus : null,
                        idProfile: item.idMaster,
                        idTraining: item.id
                    }
                });
            } else {
                let arrData = [];
                for (let dayItem in masterNearTrainings)
                    for (let trainItem in masterNearTrainings[dayItem]) {
                        let train = masterNearTrainings[dayItem][trainItem].allInfo;
                        arrData.push({
                            name: train.fio,
                            start: +train.date * 1000,
                            end: +train.date * 1000 + 3600000,
                            discipline: train.disciplines.length ?
                                selectors.discipline.find(discipline => discipline.id === +train.disciplines[0]).nameRus : null,
                            idProfile: train.idStudent,
                            idTraining: train.idTraining
                        });
                    }

                return arrData;
            }
        }
    };

    render(){
        let  id_user, id_doc, name, name_doc, avatar, name_user, status, avatar_doc, chat, visitId, contactLevel, comment, id_treatment;

        this.props.fromTR_VIS === 1 ? (
            {id_user,name_user: name, avatar, name_doc, contactLevel, name_user, avatar_doc, status, chat, id_treatment} = this.props.treatInfo
        ) : (
            {id_user,id_doc,name, name_doc, id: visitId, contactLevel,comment, chat, avatar, avatar_doc, status, id_treatment} = this.props.visitInfo
        );

        const isStudent = this.props.user_mode === "student";
      
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
            avatar: isStudent ? avatar_doc: avatar,
            chat,
            comment,
            uploadFile: this.props.uploadFile,
            setReceptionStatus: this.props.setReceptionStatus,
            setChatToId: this.props.setChatToId,
            setConversationMode: this.props.setConversationMode,
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
                            this.props.idTraining ?
                            isStudent ? (
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
                                          tailReception={this.props.onTransferTraininingToEnd}
                                          closeTreatm={this.props.closeTreatment}
                                          uploadConclusion={this.props.uploadConclusion}
                                          fromTR_VIS={2}/>
                            ) :
                                <ChatTrainingsList
                                    onGoto={(val) => this.gotoHandler(val)}
                                    goToChat = {this.goToChat}
                                    openNearTrains={() => this.props.history.push('/app/schedule')}
                                    data={this.state.nearTrainings}
                                />
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
        studentNearTrainings: state.training.nearTraining,
        masterNearTrainings: state.trainer.futureTraining,
        selectors: state.loading.selectors,

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
        onGetChatHistory: (id) => dispatch(actions.getTrainingChatHistory(id)),
        onTransferTraininingToEnd: (value) => dispatch(actions.transferTraininingToEnd(value)),
        setConversationMode: (mode) => dispatch(actions.setConversationMode(mode)),
        onGetTrainingNotFinished:(idStudent, dateMax, max) => dispatch(actions.getTrainingNotFinished(idStudent, dateMax, max)),
        onGetFutureTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getFutureTrainerTraining(idMaster, dateMin, dateMax)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onSetChatToId: (id) => dispatch(actions.setChatToId(id)),
        onSetChatTrainingId: (id) => dispatch(actions.setChatTrainingId(id)),
        onSetChatInterlocutorInfo: (interlocutorName) => dispatch(actions.setChatInterlocutorInfo(interlocutorName)),

        onSelectReception: (id) => dispatch(actions.seletVisit(id)),
        clearTodayReceptions: () => dispatch(actions.clearIntervals()),
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
