import React from 'react'
import {connect} from 'react-redux';

import Row from "../../components/Row";
import Col from "../../components/Col";
import HomeworkList from "../../components/HomeworkList";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css'

class Homework extends React.Component {

    componentDidMount() {
        const { id } = this.props;

        this.props.getSelectors('discipline');
        this.props.onGetTrainingHistoryList(id);
    }

    componentWillUnmount() {
        this.props.onResetTrainingHistoryList();
    }

    goToHandler = (id) => {
        let link = this.props.mode === "student" ? "/app/coach" : "/app/student";
        this.props.history.push(link + id);
    };

    goToChat = (idTo, idTraining, interlocutorName, interlocutorAvatar, beginTime, isComplete, isTrial = false) => {
        this.props.onSetChatToId(idTo);
        this.props.onSetChatInterlocutorInfo(interlocutorName, interlocutorAvatar);
        this.props.onSetChatTrainingId(idTraining);
        this.props.onSetBeginTime(beginTime);
        this.props.onSetIsCompleteStatus(isComplete);
        this.props.onSetIsTrialStatus(isTrial);
        this.props.history.push('/app/chat');
    };

    loadMoreTrainingsHandler = (search) => {
        const { id } = this.props;

        this.props.onGetTrainingHistoryList(id, search);
    };

    prepareTrainingsArr = () => {
        const {mode, selectors, trainings} = this.props;
        const isStudent = mode === 'student';
        let trainingsArr = [];

        if (selectors.discipline)
            trainingsArr = trainings.map((train) => {
                return {
                    date: train.date,
                    name: isStudent ? train.nameMaster : train.nameStudent,
                    avatar: isStudent ? train.avatarMaster : train.avatarStudent,
                    discipline: train.disciplineSubscription.length ? selectors.discipline.find(discipline => discipline.id === +train.disciplineSubscription[0]).nameRus : null,
                    trainingRecord: train.videofile,
                    homework: train.homework,
                    idProfile: isStudent ? train.idMaster : train.idStudent,
                    idTraining: train.idTraining,
                    isTrial: train.trial
                };
            });

        return trainingsArr;
    };

    render() {
        const { mode, loading, isRequestFailed, endAchieved } = this.props;

        return (
            <Hoc>
            	<Row>
            		<Col span={24} className='section'>
                        <HomeworkList
                            loadMoreTrainings={this.loadMoreTrainingsHandler}
                            onGoToProfile={this.goToHandler}
                            onGoToChat={this.goToChat}
                            isStudent={mode === "student"}
                            trainings={this.prepareTrainingsArr()}
                            loading={loading}
                            isRequestFailed={isRequestFailed}
                            endAchieved={endAchieved}
                            onSetHomeworkEdit={this.props.onSetHomeworkEdit}
                        />
            		</Col>
            	</Row>
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
	return {
	    id: state.auth.id,
        mode: state.auth.mode,
        trainings: state.homework.trainings,
        loading: state.homework.loading,
        isRequestFailed: state.homework.isRequestFailed,
        endAchieved: state.homework.endAchieved,
        selectors: state.loading.selectors
	}
};

const mapDispatchToProps = dispatch => {
	return {
        onGetTrainingHistoryList: (idUser, search) => dispatch(actions.getTrainingHistoryList(idUser, search)),
        onResetTrainingHistoryList: () => dispatch(actions.resetTrainingHistoryList()),
        onSetHomeworkEdit: (idTraining, homework) => dispatch(actions.setHomeworkEdit(idTraining, homework)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),

        onSetChatToId: (id) => dispatch(actions.setChatToId(id)),
        onSetChatTrainingId: (id) => dispatch(actions.setChatTrainingId(id)),
        onSetChatInterlocutorInfo: (interlocutorName, interlocutorAvatar) => dispatch(actions.setChatInterlocutorInfo(interlocutorName, interlocutorAvatar)),
        onSetBeginTime: (beginTime) => dispatch(actions.setBeginTime(beginTime)),
        onSetIsCompleteStatus: (isComplete) => dispatch(actions.setIsCompleteStatus(isComplete)),
        onSetIsTrialStatus: (isTrial) => dispatch(actions.setIsTrialStatus(isTrial)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Homework);
