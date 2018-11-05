import React from 'react'
import {connect} from 'react-redux';
import CouchMain from "./CouchMain"
import PatientPage from "./PatientPage"
import * as actions from '../../store/actions'
import moment from 'moment'
import './styles.css'

class MainPage extends React.Component{
	state = {
		cancelModal: false,
		addModal: false,
        isNewFreeVisitVisible: false,

	}

	componentWillMount(){
		if (this.props.mode === "user"){
			this.props.onGetPatientDoctors(2);
            this.props.onGetNearVisits(3);
            this.props.onGetUserInfoShort();
		}
		else {
			this.props.reviews && this.props.onGetAllReviews();
			let now = new Date();
			this.props.onGetTodayVisits(new Date(now.getFullYear(), now.getMonth(), now.getDate()),
											new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20));

			this.props.getDocTodayInfo();
			this.props.onGetIntervalForDate(moment(+new Date()).format('X'), moment(+new Date()).format('X'), );
		}

	}

	onAddVisit = () => {
		this.props.onGetDocPatients();
		this.setState({addModal: true});


        let now = new Date();
		this.props.onGetTodayVisits(new Date(now.getFullYear(), now.getMonth(), now.getDate()),
										new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20));
		this.props.getDocTodayInfo();
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

    render(){
        return (this.props.mode === "user") ? (
			<PatientPage
				isUser = {this.props.mode === "user"}
				doctors = {this.props.patientDoctors}
				completedApps = {this.props.completedApps}
				nearVisits = {this.props.nearVisits}
                nearVisitsLoaded={this.props.nearVisitsLoaded}
                myDoctorsLoaded={this.props.myDoctorsLoaded}
                completedAppsLoaded={this.props.completedAppsLoaded}
				{...this.props}
                isNewFreeVisitVisible = {this.state.isNewFreeVisitVisible}
                onCancel = {()=>this.setState({isNewFreeVisitVisible: false })}
                onFreeVisit = {this.onNewFreeVisit}
                onAddVisit = {this.props.onAddNewVisit}
				getCompletedApps = {this.props.onGetCompletedApp}
                onSubmitReview={this.props.makeReview}
                makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
            />
		) : (
			<CouchMain
				showCancel = {() => {this.setState({cancelModal: true})}}
				onAdd = {this.onAddVisit}
				addModal = {this.state.addModal}
				closeAdd= {() => {this.setState({addModal: false})}}
				onSaveNewVisit = {this.onSaveNewVisit}
				cancelModal ={this.state.cancelModal}
                closeCancel= {() => {this.setState({cancelModal: false})}}
				saveCancel = {() => {}}
				getCompletedApps = {(pagination)=>this.props.onGetActualTreatments({status: "topical", ...pagination})}
                treatmentsCount={this.props.treatmentsCount}
                addConclusion = {this.props.addConclusion}
                makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
				{...this.props}/>
		)
    }
}

const mapStateToProps = state => {
    return {
		mode: state.auth.mode,
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
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
