import React from 'react'
import {connect} from 'react-redux';
import * as actions from '../../store/actions'
import moment from 'moment'
import './styles.css'

import StudentMain from './StudentMain';
import CouchMain from "./CouchMain"
import AdminMain from "./AdminMain";

class MainPage extends React.Component{
	constructor(props) {
		super(props);
	}

	state = {
		cancelModal: false,
		addModal: false,
		isNewFreeVisitVisible: false,

	};

	getPastAndFutureCoachTrainings = () => {
		const {id} = this.props;
		let start, end;

		start = moment().utcOffset("+03:00").startOf('day').format('X');
		end = moment().utcOffset("+03:00").endOf('day').format('X');
		this.props.onGetTodayTrainerTraining(id, end, start);

		start = moment().utcOffset("+03:00").startOf('week').format('X');
		end = moment().add(1, 'weeks').format('X');
		this.props.onGetFutureTrainerTraining(id, start, end);

		start = moment().subtract(1, 'weeks').format('X');
		end = moment().format('X');
		this.props.onGetPostTrainerTraining(id, start, end);
	};

	componentDidMount() {
		this.props.getSelectors('discipline');
		this.props.onGetNextTraining(this.props.id);

		if (this.props.mode === "student") {
			this.props.onGetTrainingNotFinished(
				this.props.id,
				moment().utcOffset("+03:00").startOf('week').format('X'),
				moment().add(1, 'weeks').format('X'), 3);
			this.props.onGetAllTrainingStudent(this.props.id, moment().subtract(1, 'weeks').format('X'), moment().format('X'));
			this.props.onGetMyMastersOrStudents({idStudent: this.props.id});
		} else if (this.props.mode === "master") {
			this.props.onGetMyMastersOrStudents({idMaster: this.props.id});
			this.getPastAndFutureCoachTrainings();
		}
	}

	goToChat = (idTo, idTraining, interlocutorName, interlocutorAvatar, beginTime, isComplete, isTrial = false) => {
		this.props.onSetChatToId(idTo);
		this.props.onSetChatInterlocutorInfo(interlocutorName, interlocutorAvatar);
		this.props.onSetChatTrainingId(idTraining);
		this.props.onSetBeginTime(beginTime);
		this.props.onSetIsCompleteStatus(isComplete);
		this.props.onSetIsTrialStatus(isTrial);
		this.props.history.push('/app/chat');
	};


    render(){
        return (this.props.mode === "student") ? (
			<div>

				<StudentMain
					allAbonements = {this.props.allAbonements}
					showCancel = {() => {this.setState({cancelModal: true})}}
					addModal = {this.state.addModal}
					closeAdd = {() => {this.setState({addModal: false})}}
					onSaveNewVisit = {this.onSaveNewVisit} // ?
					cancelModal ={this.state.cancelModal}
					closeCancel = {() => {this.setState({cancelModal: false})}}
					saveCancel = {() => {}}
					addConclusion = {this.props.addConclusion}
					makeArchiveOfFiles = {this.props.makeArchiveOfFiles}

					nearTraining = {this.props.nearTraining}
					nextTrainingTime = {this.props.nextTrainingTime}
					lastTrainings={this.props.studentTrainings}
					myCoaches = {this.props.myCoachOrStudents}
					selectors = {this.props.selectors}
					goToChat = {this.goToChat}
					{...this.props}/>


			</div>
		) : (this.props.mode === "master") ? (
			<div>
				<CouchMain
					allAbonements = {this.props.allAbonements}
					nextTrainingTime = {this.props.nextTrainingTime}
					myStudents = {this.props.myCoachOrStudents}
					todayTraining = {this.props.todayTraining}
					futureTraining = {this.props.futureTraining}
					postTraining = {this.props.postTraining}
					selectors = {this.props.selectors}
					goToChat = {this.goToChat}
					onSetHomeworkEdit = {this.props.onSetHomeworkEdit}

					showCancel = {() => {this.setState({cancelModal: true})}}
					addModal = {this.state.addModal}
					closeAdd = {() => {this.setState({addModal: false})}}
					onSaveNewVisit = {this.onSaveNewVisit} // ?
					cancelModal = {this.state.cancelModal}
					closeCancel= {() => {this.setState({cancelModal: false})}}
					saveCancel = {() => {}}
					addConclusion = {this.props.addConclusion}
					makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
					{...this.props}/>


			</div>
		) : (this.props.mode === "admin") ?
			<div>
				<AdminMain
					onGetReport={this.props.onGetReport}
					reportLinks={this.props.reportLinks}
				/>

			</div> : null;
    }
}

const mapStateToProps = state => {
    return {
		allAbonements: state.abonement.allAbonements, // и интервалы
		id: state.auth.id,
		mode: state.auth.mode,
		selectors: state.loading.selectors,
		myCoachOrStudents: state.training.myCoachOrStudents,
		nearTraining: state.training.nearTraining,
		nextTrainingTime: state.training.nextTrainingTime,
		todayTraining: state.trainer.todayTraining,
		postTraining: state.trainer.postTraining,
		futureTraining: state.trainer.futureTraining,
		studentTrainings: state.training.studentTrainings,

		patients: state.patients.docPatients,
		patientDoctors: state.patients.patientDoctorsShort,
        myDoctorsLoaded: state.patients.myDoctorsLoaded,
		intervals: state.patients.intervals,
		userInfoShort: state.profilePatient,

		reportLinks: state.admin.reportLinks
    }
};

const mapDispatchToProps = dispatch => {
    return {
		onSelectPatient: (id) => dispatch(actions.selectPatient(id)),

		onGetDeadlinePay: (idStudent) => dispatch(actions.getDeadlinePay(idStudent)),
		onSetHomeworkEdit: (idTraining, homework) => dispatch(actions.setHomeworkEdit(idTraining, homework)),


		onGetMyMastersOrStudents: (obj) => dispatch(actions.getMyMastersOrStudents(obj)),

		onGetTrainingNotFinished:(idStudent, dateMin, dateMax, max) => dispatch(actions.getTrainingNotFinished(idStudent, dateMin, dateMax, max)),
		onSetChatToId: (id) => dispatch(actions.setChatToId(id)),
		onSetChatTrainingId: (id) => dispatch(actions.setChatTrainingId(id)),
		onSetChatInterlocutorInfo: (interlocutorName, interlocutorAvatar) => dispatch(actions.setChatInterlocutorInfo(interlocutorName, interlocutorAvatar)),
		onSetBeginTime: (beginTime) => dispatch(actions.setBeginTime(beginTime)),
		onSetIsCompleteStatus: (isComplete) => dispatch(actions.setIsCompleteStatus(isComplete)),
		onSetIsTrialStatus: (isTrial) => dispatch(actions.setIsTrialStatus(isTrial)),

		onGetNextTraining: (id) => dispatch(actions.getNextTraining(id)),
		onGetPostTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getPostTrainerTraining(idMaster, dateMin, dateMax)),
		onGetFutureTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getFutureTrainerTraining(idMaster, dateMin, dateMax)),
		onGetAllTrainingStudent: (idMaster, dateMin, dateMax) => dispatch(actions.getAllTrainingStudent(idMaster, dateMin, dateMax)),
		onGetTodayTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getTodayTrainerTraining(idMaster, dateMin, dateMax)),
		getSelectors: (name) => dispatch(actions.getSelectors(name)),

		onGetReport: () => dispatch(actions.getReport())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
