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

	}

	getPastAndFutureTraining = () => {
		const {id} = this.props;
		let start = null,
			end = null;
			
		start = moment(Date.now()).startOf('day').format('X');
		end = moment(Date.now()).endOf('day').format('X');
		this.props.onGetTodayTrainerTraining(id, end, start);

		start = moment(Date.now()).format('X');
		end = moment(Date.now()).add(1, 'weeks').format('X');
		this.props.onGetFutureTrainerTraining(id, start, end);

		start = moment(Date.now()).format('X');
		end = moment(Date.now()).add(1, 'weeks').format('X');
		this.props.onGetPostTrainerTraining(id, start, end);
	};

	componentDidMount() {
		this.props.onGetAbonements(this.props.id);

		if (this.props.mode === "student") {
			this.props.onGetTrainingNotFinished(this.props.id, moment().add(1, 'weeks').format('X'), '1');
			this.props.onGetMyMastersOrStudents({idStudent: this.props.id});
			this.props.onGetNextTraining(this.props.id);
		} else if (this.props.mode === "master") {
			this.props.onGetMyMastersOrStudents({idMaster: this.props.id});
			this.props.onGetNextTraining(this.props.id);
			this.getPastAndFutureTraining();
		}
	}

    onAddVisit = () => {
		this.props.onGetDocPatients();
		this.setState({addModal: true});


        let now = new Date();
		this.props.onGetTodayVisits(new Date(now.getFullYear(), now.getMonth(), now.getDate()),
										new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20));
		//this.props.getDocTodayInfo();
	}

	onSaveNewVisit = (obj) => {
		return this.props.onAddNewVisit(obj, true);

	};

	onNewFreeVisit = () => {
	    this.setState({isNewFreeVisitVisible: true})
	}

	/*shouldComponentUpdate(nextProps, nextState){
		return this.props.visits.length !== nextProps.visits.length
			|| this.props.docTodayInfo.receptionsToday !== nextProps.docTodayInfo.receptionsToday
			|| this.props.docTodayInfo.patients !== nextProps.docTodayInfo.patients
			|| this.state.cancelModal !== nextState.cancelModal
			|| this.state.addModal !== nextState.addModal
			|| this.props.patients.length !== nextProps.patients.length;
	}*/


	// Fasol
	goToChat = (idTo) => {  
		this.props.onSetChatToId(idTo);
		this.props.history.push('/app/chat');
	}

    render(){
		
        return (this.props.mode === "student") ? (
			<StudentMain
				allAbonements = {this.props.allAbonements}
				showCancel = {() => {this.setState({cancelModal: true})}}
				onAdd = {this.onAddVisit}
				addModal = {this.state.addModal}
				closeAdd= {() => {this.setState({addModal: false})}}
				onSaveNewVisit = {this.onSaveNewVisit} // ?
				cancelModal ={this.state.cancelModal}
                closeCancel= {() => {this.setState({cancelModal: false})}}
				saveCancel = {() => {}}
				getCompletedApps = {(pagination)=>this.props.onGetActualTreatments({status: "topical", ...pagination})}
                treatmentsCount={this.props.treatmentsCount}
                addConclusion = {this.props.addConclusion}
				makeArchiveOfFiles = {this.props.makeArchiveOfFiles}

				nearTraining = {this.props.nearTraining}
				nextTrainingTime = {this.props.nextTrainingTime}
				myCoachOrStudents = {this.props.myCoachOrStudents}
				todayTraining = {this.props.todayTraining}
				futureTraining = {this.props.futureTraining}
				postTraining = {this.props.postTraining}
				goToChat = {this.goToChat}
				{...this.props}/>
		) : (this.props.mode === "master") ? (
			<CouchMain
				allAbonements = {this.props.allAbonements}
				nextTrainingTime = {this.props.nextTrainingTime}
				myCoachOrStudents = {this.props.myCoachOrStudents}
				todayTraining = {this.props.todayTraining}
				futureTraining = {this.props.futureTraining}
				postTraining = {this.props.postTraining}
				getSelectors = {this.props.getSelectors}
				goToChat = {this.goToChat}

				showCancel = {() => {this.setState({cancelModal: true})}}
				onAdd = {this.onAddVisit}
				addModal = {this.state.addModal}
				closeAdd= {() => {this.setState({addModal: false})}}
				onSaveNewVisit = {this.onSaveNewVisit} // ?
				cancelModal ={this.state.cancelModal}
                closeCancel= {() => {this.setState({cancelModal: false})}}
				saveCancel = {() => {}}
				getCompletedApps = {(pagination)=>this.props.onGetActualTreatments({status: "topical", ...pagination})}
                treatmentsCount={this.props.treatmentsCount}
                addConclusion = {this.props.addConclusion}
                makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
				{...this.props}/>
		) :
			<AdminMain/>
    }
}

const mapStateToProps = state => {
    return {
		allAbonements: state.abonement.allAbonements, // и интервалы
		id: state.auth.id,
		mode: state.auth.mode,
		myCoachOrStudents: state.training.myCoachOrStudents,
		nearTraining: state.training.nearTraining,
		nextTrainingTime: state.training.nextTrainingTime,
		todayTraining: (state.auth.mode ==='master') ? state.trainer.todayTraining : null,
		postTraining: (state.auth.mode ==='master') ? state.trainer.postTraining : null,
		futureTraining: (state.auth.mode ==='master') ? state.trainer.futureTraining : null,

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
    }
};

const mapDispatchToProps = dispatch => {
    return {
		onGetDocPatients: () => dispatch(actions.getDocPatients()),
		onAddNewVisit: (obj, isToday) => dispatch(actions.addVisit(obj,null,null,isToday)),
		onSelectReception: (id) => dispatch(actions.seletVisit(id)),
		onSelectTretment: (id) => dispatch(actions.selectTreatment(id)),
		onGetTodayVisits: (start, end) => dispatch(actions.getTodayVisits(start, end)),
		onGetAllReviews: () => dispatch(actions.getAllReviews()),
		onGetActualTreatments: (obj) => dispatch(actions.getPaginationTreatments(obj)),
        onGetCompletedApp: (obj) => dispatch(actions.getCompletedApps(obj)),
		onSelectPatient: (id) => dispatch(actions.selectPatient(id)),
		onGetNearVisits: (count) => dispatch(actions.getCountNearVisits(count)),
		//onGetAllPatientsVisits: () => dispatch(actions.getAllVisits()),
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
		
		onGetAbonements: (idStudent) => dispatch(actions.getAbonements(idStudent)),
		onGetDeadlinePay: (idStudent) => dispatch(actions.getDeadlinePay(idStudent)),

		onGetMyMastersOrStudents: (obj) => dispatch(actions.getMyMastersOrStudents(obj)),

		onGetTrainingNotFinished:(idStudent, dateMax, max) => dispatch(actions.getTrainingNotFinished(idStudent, dateMax, max)),
		onSetChatToId: (id) => dispatch(actions.setChatToId(id)),	
		onGetNextTraining: (id) => dispatch(actions.getNextTraining(id)),
		onGetPostTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getPostTrainerTraining(idMaster, dateMin, dateMax)),
		onGetFutureTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getFutureTrainerTraining(idMaster, dateMin, dateMax)),
		onGetTodayTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getTodayTrainerTraining(idMaster, dateMin, dateMax)),
		getSelectors: (name) => dispatch(actions.getSelectors(name)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
