import React from 'react'
import {connect} from 'react-redux';
import * as actions from '../../store/actions'
import moment from 'moment'
import './styles.css'

import StudentMain from './StudentMain';
import CouchMain from "./CouchMain"
import AdminMain from "./AdminMain";
import VKApp from './../../components/VKApp/index';

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

		start = moment(Date.now()).startOf('day').format('X');
		end = moment(Date.now()).endOf('day').format('X');
		this.props.onGetTodayTrainerTraining(id, end, start);

		start = moment(Date.now()).subtract(1, 'hours').format('X');
		end = moment(Date.now()).add(1, 'weeks').format('X');
		this.props.onGetFutureTrainerTraining(id, start, end);

		start = moment(Date.now()).subtract(1, 'weeks').format('X');
		end = moment(Date.now()).format('X');
		this.props.onGetPostTrainerTraining(id, start, end);
	};

	componentDidMount() {
		this.props.getSelectors('discipline');
		this.props.onGetNextTraining(this.props.id);

		if (this.props.mode === "student") {
			this.props.onGetTrainingNotFinished(this.props.id, moment().add(1, 'weeks').format('X'), 3);
			this.props.onGetAllTrainingStudent(this.props.id, moment(Date.now()).subtract(1, 'weeks').format('X'), moment(Date.now()).format('X'));
			this.props.onGetMyMastersOrStudents({idStudent: this.props.id});
		} else if (this.props.mode === "master") {
			this.props.onGetMyMastersOrStudents({idMaster: this.props.id});
			this.getPastAndFutureCoachTrainings();
		}
	}

	goToChat = (idTo, idTraining, interlocutorName, interlocutorAvatar, beginTime, isComplete, isTrial = false) => {
		console.log(idTo);
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
					getCompletedApps = {(pagination)=>this.props.onGetActualTreatments({status: "topical", ...pagination})}
					treatmentsCount={this.props.treatmentsCount}
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
					getCompletedApps = {(pagination)=>this.props.onGetActualTreatments({status: "topical", ...pagination})}
					treatmentsCount={this.props.treatmentsCount}
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
		visits: state.schedules.visits,
		reviews: state.reviews.reviews,
		actualTreatments: state.treatments.treatments,
		completedApps: state.treatments.completedApps,
		docTodayInfo: state.doctor.todayInfo,
		patientDoctors: state.patients.patientDoctorsShort,
		nearVisits: state.schedules.nearVisits,
		nearVisitsLoaded: state.schedules.nearVisitsLoaded,
        myDoctorsLoaded: state.patients.myDoctorsLoaded,
        treatmentsCount: state.treatments.treatmentsCount,
        completedAppsLoaded: state.treatments.completedAppsLoaded,
		intervals: state.patients.intervals,
		availableIntervals: state.profileDoctor.workIntervals,
		userInfoShort: state.profilePatient,

		reportLinks: state.admin.reportLinks
    }
};

const mapDispatchToProps = dispatch => {
    return {
		onGetDocPatients: () => dispatch(actions.getDocPatients()),
		onSelectReception: (id) => dispatch(actions.seletVisit(id)),
		onSelectTretment: (id) => dispatch(actions.selectTreatment(id)),
		onGetTodayVisits: (start, end) => dispatch(actions.getTodayVisits(start, end)),
		onGetAllReviews: () => dispatch(actions.getAllReviews()),
		onGetActualTreatments: (obj) => dispatch(actions.getPaginationTreatments(obj)),
        onGetCompletedApp: (obj) => dispatch(actions.getCompletedApps(obj)),
		onSelectPatient: (id) => dispatch(actions.selectPatient(id)),

		getDocTodayInfo: () => dispatch(actions.getDocTodayInfo()),
		onGetPatientDoctors: (count) => dispatch(actions.getPatientDoctors(count)),
		onGetIntervalForDate: (beginDay, endDay, id) => dispatch(actions.getDateIntervalWithoutMakingApp(beginDay, endDay, id)),
		onGetAllDocIntervals: (id) => dispatch(actions.getAllDocIntervals(id)),
		onSendUserPoleValue: (pole, value) => dispatch(actions.sendUserPoleValue(pole, value)),
		onGetUserInfoShort: () => dispatch(actions.getUserInfoShort()),
        makeReview: (obj) => dispatch(actions.makeReview(obj)),
        addConclusion:(id_zap, file) => dispatch(actions.uploadConclusion(id_zap, file)),
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files)),
		cancelAppByPatient: (id) => dispatch(actions.cancelAppByPatient(id)),

		onGetDeadlinePay: (idStudent) => dispatch(actions.getDeadlinePay(idStudent)),
		onSetHomeworkEdit: (idTraining, homework) => dispatch(actions.setHomeworkEdit(idTraining, homework)),


		onGetMyMastersOrStudents: (obj) => dispatch(actions.getMyMastersOrStudents(obj)),

		onGetTrainingNotFinished:(idStudent, dateMax, max) => dispatch(actions.getTrainingNotFinished(idStudent, dateMax, max)),
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

		onGetReport: (dateStart, dateEnd) => dispatch(actions.getReport(dateStart, dateEnd))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
