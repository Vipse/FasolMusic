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
        nearTrainings: [],
        loadingChatStory: false
    };

    componentDidMount() {
        this.props.getSelectors('discipline')
            .then((res) => {
                this.loadTrainingsList();
            });
        this.props.onCheckInterlocutorOnlineStatus(this.props.idTo);
        this.props.idTraining && this.loadChatHistory(this.props.idTraining);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.studentNearTrainings !== this.props.studentNearTrainings)
            this.setState({nearTrainings: this.prepareNearTrainings()});

        if (prevProps.masterNearTrainings !== this.props.masterNearTrainings)
            this.setState({nearTrainings: this.prepareNearTrainings()});

        if (prevProps.idTraining !== this.props.idTraining) {
            if (this.props.idTraining) {
                this.props.onCheckInterlocutorOnlineStatus(this.props.idTo);
                this.loadChatHistory(this.props.idTraining);
            } else this.loadTrainingsList();
        }
    }

    loadChatHistory = (idTraining) => {
        this.setState({loadingChatStory: true});
        this.props.onGetChatHistory(idTraining)
            .then(res => {this.setState({loadingChatStory: false})})
            .catch(err => console.log(err));
    };

    loadTrainingsList = () => {
        const {user_mode, id} = this.props;

        if (user_mode === 'student')
            this.props.onGetTrainingNotFinished(id, moment().add(1, 'weeks').format('X'), 10);
        else {
            let start = moment().utcOffset("+03:00").startOf('week').format('X');
            let end = moment().add(1, 'weeks').format('X');
            this.props.onGetFutureTrainerTraining(id, start, end);
        }
    };

    goToChat = (idTo, idTraining, interlocutorName, interlocutorAvatar, beginTime, isComplete, isTrial) => {
        this.props.onSetChatToId(idTo);
        this.props.onSetChatInterlocutorInfo(interlocutorName, interlocutorAvatar);
        this.props.onSetChatTrainingId(idTraining);
        this.props.onSetBeginTime(beginTime);
        isComplete !== undefined && this.props.onSetIsCompleteStatus(isComplete);
        isTrial !== undefined && this.props.onSetIsTrialStatus(isTrial);
    };

    onGoToPayment = () => {
        this.props.history.push('/app/payment');
    };

    gotoHandler = (id) => {
        const {user_mode, history} = this.props;
        history.push('/app/' + user_mode === 'student' ? 'coach' : 'student' + id);
    };

    prepareNearTrainings = () => {
        const {studentNearTrainings, masterNearTrainings, user_mode, selectors} = this.props;

        if (selectors.discipline) {
            if (user_mode === 'student') {
                return studentNearTrainings.map((item) => {
                    return {
                        name: item.fioMaster,
                        avatar: item.avatarMaster,
                        start: +item.start * 1000,
                        end: +item.start * 1000 + 3600000,
                        discipline: item.disciplineSubscription.length ?
                            selectors.discipline.find(discipline => discipline.id === +item.disciplineSubscription[0]).nameRus : null,
                        idProfile: item.idMaster,
                        idTraining: item.id,
                        isTrial: item.trial,
                        isComplete: item.isComplete
                    }
                });
            } else {
                let arrData = [];
                for (let dayItem in masterNearTrainings)
                    for (let trainItem in masterNearTrainings[dayItem]) {
                        let train = masterNearTrainings[dayItem][trainItem].allInfo;
                        arrData.push({
                            name: train.fio,
                            avatar: train.avatar,
                            start: +train.date * 1000,
                            end: +train.date * 1000 + 3600000,
                            discipline: train.disciplines.length ?
                                selectors.discipline.find(discipline => discipline.id === +train.disciplines[0]).nameRus : null,
                            idProfile: train.idStudent,
                            idTraining: train.idTraining,
                            isComplete: train.isComplete
                        });
                    }

                return arrData;
            }
        }
    };

    render(){
        const isStudent = this.props.user_mode === "student";

        const chatProps = {
            wsURL: 'wss://web.fasolonline.ru:8443/one2one',
            timer: this.props.timer,
            chatStory: this.props.chatStory,
            loadingChatStory: this.state.loadingChatStory,
            trainingStarts: this.props.trainingStarts,
            isCalling: this.props.isCalling,
            isTrial: this.props.isTrial,
            isComplete: this.props.isComplete,
            idTraining: this.props.idTraining,
            callerID: this.props.id,
            calledID: this.props.idTo,
            user_mode: this.props.user_mode,
            interlocutorName: this.props.interlocutorName,
            interlocutorAvatar: this.props.interlocutorAvatar,
            online: this.props.interlocutorStatus,
            setConversationMode: this.props.onSetConversationMode,
            beginTime: this.props.beginTime,
            webSockedStatus: this.props.webSockedStatus
        };

        console.log('chatProps', chatProps);

        return (
            <Hoc>
                <Row>
                    <Col xs={24} xxl={24} className='section'>
                        {
                            this.props.idTraining ?
                                isStudent ? (
                                    <ChatCard {...chatProps}
                                              mode={this.props.conversationMode}
                                              onExitTraining={() => this.goToChat(0, 0, '', 0)}
                                              goToPayment={this.onGoToPayment}
                                              isStudent={true}
                                              onCheckOnlineStatus={this.props.onCheckOnlineStatus}
                                    />
                                ) : (
                                    <ChatCard {...chatProps}
                                              mode={this.props.conversationMode}
                                              onExitTraining={() => this.goToChat(0, 0, '', 0)}
                                              completeTraining={this.props.onCompleteTraining}
                                              tailTraining={this.props.onTransferTraininingToEnd}
                                              changeTrainingStatus={this.props.onSetTrainingStatus}
                                              onCheckOnlineStatus={this.props.onCheckOnlineStatus}
                                    />
                                ) :
                                <ChatTrainingsList
                                    onGoto={(val) => this.gotoHandler(val)}
                                    goToChat={this.goToChat}
                                    openNearTrains={() => this.props.history.push('/app/schedule')}
                                    data={this.state.nearTrainings}
                                />
                        }
                    </Col>
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

        chatStory: state.chatWS.chatStory,
        trainingStarts: state.chatWS.trainingStarts,
        isCalling: state.chatWS.isCalling,
        beginTime: state.chatWS.beginTime,
        isComplete: state.chatWS.isComplete,
        isTrial: state.chatWS.isTrial,
        timer: state.chatWS.timer,
        idTo: state.chatWS.to,
        idTraining: state.chatWS.idTraining,
        conversationMode: state.chatWS.conversationMode,
        interlocutorName: state.chatWS.interlocutorName,
        interlocutorAvatar: state.chatWS.interlocutorAvatar,
        interlocutorStatus: state.chatWS.interlocutorStatus,
        webSockedStatus: state.chatWS.webSockedStatus
    }
}

const mapDispatchToProps = dispatch => {
	return {
        onCompleteTraining: (obj) => dispatch(actions.completeReception(obj)),
        onTransferTraininingToEnd: (value) => dispatch(actions.transferTraininingToEnd(value)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onGetTrainingNotFinished:(idStudent, dateMax, max) => dispatch(actions.getTrainingNotFinished(idStudent, dateMax, max)),
        onGetFutureTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getFutureTrainerTraining(idMaster, dateMin, dateMax)),
        onGetChatHistory: (id) => dispatch(actions.getTrainingChatHistory(id)),
        onSetConversationMode: (mode) => dispatch(actions.setConversationMode(mode)),
        onSetChatToId: (id) => dispatch(actions.setChatToId(id)),
        onSetChatTrainingId: (id) => dispatch(actions.setChatTrainingId(id)),
        onSetChatInterlocutorInfo: (interlocutorName, interlocutorAvatar) => dispatch(actions.setChatInterlocutorInfo(interlocutorName, interlocutorAvatar)),
        onSetTrainingStatus: (isStart) => dispatch(actions.setReceptionStatus(isStart)),
        onSetBeginTime: (beginTime) => dispatch(actions.setBeginTime(beginTime)),
        onSetIsCompleteStatus: (isComplete) => dispatch(actions.setIsCompleteStatus(isComplete)),
        onSetIsTrialStatus: (isTrial) => dispatch(actions.setIsTrialStatus(isTrial)),
        onCheckInterlocutorOnlineStatus: (id) => dispatch(actions.checkInterlocutorOnlineStatus(id))

        //uploadFile: (id_zap, id_user, file, callback) => dispatch(actions.uploadChatFile(id_zap,id_user, file,callback)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
