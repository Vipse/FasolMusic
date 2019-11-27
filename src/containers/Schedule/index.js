import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux';
import {message, Modal as PopupModal} from 'antd';


import Button from "../../components/Button";
import Calendar from "../../components/Calendar22";

import Modal from './../../components/Modal/index';
import * as actions from '../../store/actions'
import Card from './../../components/Card/index';

import './styles.css'
import ListTrainersModal from '../../components/Modals/ListTrainersModal';
import TransferOrFreezeModal from '../../components/Modals/TransferOrFreezeModal';
import TransferOrNewScheduleModal from '../../components/Modals/TransferOrNewScheduleModal';

class Schedule extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {

            interval: null,

            apiPatients: [],

           
            theMasterSelect: false,

            scheduleSpinner: true,
            modalRemoveTrialTraining: false,
        }

        const m = moment().startOf('week');
        this.min = moment([m.get('year'), m.get('month'), m.get('date'), 8]).format('X')
        this.max = moment([m.get('year'), m.get('month'), m.get('date'),23]).format('X')
        
    };

    

    componentDidUpdate(nextProps, nextState) {
        const {currentIdUser, setParamsId} = this.props;

        this.id = this.getCurrentId()
        if(currentIdUser !== this.id){
            setParamsId({currentIdUser: this.id})
        }   
    }

    getCurrentId = () => { 
        const {id, match} = this.props;
        return (Object.keys(match.params).length && match.params.id) ? match.params.id : id
    }

    isStudentSchedule = () => { 
        const {match} = this.props;
        return (Object.keys(match.params).length && match.params.id) ? true : false
    }





    selectAnyTrainer = () => {
        let {fullInfoMasters} = this.props;
        const min = 0;
        const max = fullInfoMasters.length - 1;
        let rand = min + Math.random() * (max + 1 - min);

        rand = Math.floor(rand);
        
    }

    resetAllEvent = () => {
        this.props.onSetPushTrialTraining(null)
        this.props.onUnsetPushBtnTransferTraining();
        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0});
    }


    deleteTraining = (idTraining) => { // нажатие на крестик
        this.deleteIdTraining = idTraining;
        //this.setState({modalRemoveTrialTraining: true});
    }

    updateAfterFilling = () => {
        const {currDiscipline} = this.props;
        const id = this.id
        
        setTimeout(() => {
            this.props.onGetStudentBalance(id);
            this.props.onGetUseFrozenTraining(id);
            this.props.onGetTrainingsTrialStatus(id);
            this.props.onGetTrainingTrialStatusByDiscipline(currDiscipline.code, id);
        }, 500);
    }

    onCancelTraining = (transferId, idSubscription) => {
        this.cancelId = transferId; // для переноса в конец
        this.freezeIdSubscription = idSubscription; // для заморозки
        //this.setState({modalCancelTraining: true});
    }


    componentDidMount() {
        const {startDate, endDate, setParamsId} = this.props;

        //
        const {currDiscipline, isAdmin} = this.props;
        const id = this.getCurrentId() 
        setParamsId({currentIdUser: id})

        const start =  moment(Date.now()).startOf('week').format('X');
        const end = moment(Date.now()).endOf('week').format('X');

        this.props.onSetWeekInterval({start, end});


        //this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin, true);

        if(this.props.mode === 'student' || this.isStudentSchedule()){
            this.props.onGetDisciplineCommunication(id);

            this.props.onCheckToken(id)
                .then((checkToken) => {

                    if(checkToken.length){
                        PopupModal.info({
                            title: 'Отлично! Теперь ты в нашей команде!',
                            width: '500px',
                            className: 'quick-modal',
                            content: 'Пробежимся по правилам: Каждую тренировку можно переносить 1 раз; ' +
                                'Перенос тренировки возможен за 24 часа до ее начала, ' +
                                'если осталось меньше 24 часов до начала, перенос тренировки невозможен, ' +
                                'если вы не сможете присутствовать, она будет считаться проведенной; ' +
                                'Заморозка занятий действует 3 месяца. ' +
                                'Вот и все, вперед покорять музыку вместе с Fasol музыкальная качалка.',
                            zIndex: 1010
                        });
                    }
                })

            //
            //??
            this.props.onGetStudentsSchedule(id, startDate, endDate, currDiscipline.code);
            //
        }

        if(this.props.isAdmin) {
            this.props.onGetFreeAndBusyMasterList(start, end)
        }
        if(this.props.mode === 'master'){
            this.props.onGetTrainerTraining(id, start, end, currDiscipline)
        }
    }

    componentDidUpdate(prevProps){
        this.state.scheduleSpinner && this.setState({ scheduleSpinner: false })
    }

    dateChange = (action) => {
        const {isAdmin} = this.props;

        const getNewDate = (property) => {
            if (action == 'NEXT'){
                return moment(+this.props[property] * 1000).add(1, 'week').format('X')
            }
            else if(action == 'PREV'){
                return moment(+this.props[property] * 1000).subtract(1, 'week').format('X')
            } 
            else if(action == 'TODAY'){
                if(property == 'startDate') 
                    return moment().startOf('week').format('X')
                else 
                    return moment().endOf('week').format('X')        
            }
        }

        const newStart = getNewDate('startDate')
        const newEnd = getNewDate('endDate') 
        
        const m = moment(+newStart * 1000)
        
        this.min = moment([m.get('year'), m.get('month'), m.get('date'), 8]).format('X')
        this.max = moment([m.get('year'), m.get('month'), m.get('date'), 23]).format('X')
    
        this.props.handleChangeTime(newStart, newEnd);
        this.setState({ 
            scheduleSpinner: true
        })


        if(isAdmin){
            this.fetchAdminDateChange(newStart, newEnd)
        } 
        else {
            this.fetchDateChange(newStart, newEnd)
        }
    }

    fetchAdminDateChange = (newStart, newEnd) => {
        this.props.onGetFreeAndBusyMasterList(newStart, newEnd)
               
        
    }

    
    fetchDateChange = (newStart, newEnd) => {
        const { id, isAdmin, 
            currDiscipline, 
            isPushBtnTransfer,
            discCommunication
        } = this.props;
        const week = [0,1,2,3,4,5,6]

        

        this.props.onGetStudentsSchedule(id, newStart, newEnd, currDiscipline.code)
        
        if (isPushBtnTransfer) {
            if (discCommunication.hasOwnProperty(currDiscipline.code)) {
                this.props.onGetTheMasterInterval(newStart, newEnd, discCommunication[currDiscipline.code].idMaster, week, isAdmin)
                    .then(() => this.setState({ theMasterSelect: true}));
            }
        }
    }


    eventDeleteHandler = (id) => {
        this.props.onEventDelete(id);
        //this.setState({sendingModal: true});
    }

    prepareDatesForSmallCalendar = (visits) => {
        return visits ? visits.map(item => moment(item.start*1000).format("YYYY MM DD")) : null
    };

    gotoHandler = (id) => {
		this.props.onSelectPatient(id);
		this.props.history.push('/app/patient'+id);
	}

    render() {
        const {startDate, endDate} = this.props;
        const {
            masterList,
            allAbonements,
            profileStudent,
            isAdmin} = this.props;

        const id = this.getCurrentId();
        let calendar;
        
        

        if (isAdmin && !this.isStudentSchedule()) {


            calendar = (<Calendar
                masterList={masterList}
                isAdmin={isAdmin}
                dateChange={this.dateChange}
                currentDate={moment().format('x')}
                startDate={startDate * 1000}
                endDate={endDate * 1000}
                min={this.min * 1000}
                max={this.max * 1000}
                
                //



                    defaultView="week"
                    onGotoPatient={this.gotoHandler}
                    step={60}
                    
                    
                    intervals={ this.props.freeIntervals}
  
                    onPopoverClose={this.eventDeleteHandler}
                    highlightedDates = {this.prepareDatesForSmallCalendar(this.props.allUserVisits)}
                    showTransferEvent={this.showTransferEvent} // my

                    onCancelTraining = {this.onCancelTraining}
                    trainerTraining = {this.props.trainerTraining}
                    scheduleSpinner = {this.state.scheduleSpinner}

                    />)
        }
        else { // student
            
                            //let notRedirectDiscipline = false;
                            // if(0 !== this.countTraining && this.countTraining <= this.state.apiPatients.length){                          
                            //     //nothing
                            // }
                            //  else if(isPushBtnTrialTraining === 'trial'){
                            //     filterInterval = this.props.freeIntervals;
                            //     notRedirectDiscipline = true;
                            //  }
                            //  else if(isPushBtnTrialTraining === 'select_master'){
                            //     filterInterval = this.props.theMasterInterval;
                            //     notRedirectDiscipline = true;
                            //  }

                            //  else if(this.state.theMasterSelect || isPushBtnTransfer || isPushBtnAdd || isPushBtnTrialTraining === 'first_trainer'){

                            //     filterInterval = this.props.theMasterInterval;
                            //     notRedirectDiscipline = true;

                            //  }
                            //  else if(isNeedSaveIntervals){

                            //     filterInterval =  this.props.freeIntervals;
                            //     notRedirectDiscipline = true;
                            //  }

                            // filterInterval =  this.props.freeIntervals;

            calendar = (<Calendar
                                
                dateChange={this.dateChange}
                currentDate={moment().format('x')}
                startDate={startDate * 1000}
                endDate={endDate * 1000}
                min={this.min * 1000}
                max={this.max * 1000}
                deleteTraining={this.deleteTraining} 
                onCancelTraining={this.onCancelTraining}
                deleteEventApiPatient={this.deleteEventApiPatient} 


                                  selectable
                                  defaultView="week"
                                  
                                  onGotoPatient={this.gotoHandler}
                                  step={60}
                                  selectAnyTrainer = {this.selectAnyTrainer}
                                  mode = {this.props.mode}
                                  events={(Array.isArray(allAbonements) && allAbonements.length) ? [...allAbonements, ...this.state.apiPatients] : this.state.apiPatients}
                                  
                                  

                                  currDiscipline = {this.props.currDiscipline}
                                 
                                  onPopoverClose={this.eventDeleteHandler}
                                  highlightedDates = {this.prepareDatesForSmallCalendar(this.props.allUserVisits)}
                                  // my
                                 
                                  trainerTraining = {this.props.trainerTraining}
                                  scheduleSpinner = {this.state.scheduleSpinner}

            />)
        }

        
        let cardTitle = (this.isStudentSchedule() && profileStudent.name) ? "Расписание - "+profileStudent.name : 'Расписание тренировок'

        return (
            <React.Fragment>
                <Card className='card-calendar' title={cardTitle}>
                        {calendar}
                </Card>                

                <Modal
                    title='Сообщение'
                    visible={this.state.modalRemoveTrialTraining}
                    onCancel={() => this.setState({modalRemoveTrialTraining : false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                >
                        <div className="schedule-message-modal">
                                <div className="schedule-message-btn">
                                    <Button btnText='Удалить тренировку'
                                        onClick= {() => {
                                            this.props.onRemoveTrialTraining(this.deleteIdTraining, this.props.isAdmin)
                                                .then(this.props.onGetTrainingsTrialStatus(this.id))
                                                .then(this.props.onGetTrainingTrialStatusByDiscipline(this.props.currDiscipline.code, this.id))
                                                //.then(() => this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin))

                                            this.setState({modalRemoveTrialTraining: false});
                                        }}
                                        type='yellow'/>
                                </div>
                        </div>
                 </Modal> 

                <TransferOrFreezeModal />

                <TransferOrNewScheduleModal />
                
                <ListTrainersModal />

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        //
        masterList: state.admin.masterList,
        startDate: state.training.startDate,
        endDate: state.training.endDate,

        //
        allAbonements: state.abonement.allAbonements, // и интервалы
        id: state.auth.id,
        trainerTraining: state.trainer.trainerTraining,

        fullInfoMasters: state.scheduleIdParams.fullInfoMasters,

        isPushBtnTransfer: state.student.isPushBtnTransfer, // поменять на pushBtnTransfer

        profileStudent: state.profileStudent,
        currDiscipline: state.abonement.currDiscipline,

        freeIntervals:  state.students.freeIntervals,
 

        isAdmin:  state.auth.mode === "admin",
        theMasterInterval: state.student.theMasterInterval,
        mode: state.auth.mode,


        discCommunication: state.student.discCommunication,
        checkToken: state.acquiring.checkToken,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //
        onGetStudentsSchedule: (id, start, end, disc) => dispatch(actions.getStudentsSchedule(id, start, end, disc)),
        handleChangeTime: (startDate, endDate) => dispatch(actions.handleChangeTime(startDate, endDate)),
        
        setParamsId: (params) => dispatch(actions.setParamsId(params)),
        
        //
        onCreateAbonement: (data) => dispatch(actions.createAbonement(data)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),
        onTransferTrainining: (value, isCallAdmin) => dispatch(actions.transferTrainining(value, isCallAdmin)),
        onTransferTraininingToEnd: (value, isCallAdmin) => dispatch(actions.transferTraininingToEnd(value, isCallAdmin)),
        onChangeSubscription: (data, isCallAdmin) => dispatch(actions.changeSubscription(data, isCallAdmin)),
        onSetWeekInterval: (interval) => dispatch(actions.setWeekInterval(interval)),
        onUnsetPushBtnTransferTraining: () => dispatch(actions.unsetPushBtnTransferTraining()),



        onGetTrainerTraining: (id, dateMin, dateMax, currDiscipline) => dispatch(actions.getTrainerTraining(id, dateMin, dateMax, currDiscipline)),
        onGetInfoMasters: (idMaster) => dispatch(actions.getInfoMasters(idMaster)),
        onSetChooseMasterAllInfo: (allInfo) => dispatch(actions.setChooseMasterAllInfo(allInfo)),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onSetChooseTheMasterByStudent: (master) => dispatch(actions.setChooseTheMasterByStudent(master)),

        
        onGetStudentBalance: (idStudent) => dispatch(actions.getStudentBalance(idStudent)),
        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
         onGetUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),
        

       
        onCheckToken: (idUser) => dispatch(actions.checkToken(idUser)),
       
        onRemoveTrialTraining: (idTraining, isCallAdmin) => dispatch(actions.removeTrialTraining(idTraining, isCallAdmin)),
       
        
        onGetTrainingsTrialStatus: (idStudent) => dispatch(actions.getTrainingsTrialStatus(idStudent)),

        onGetFreeAndBusyMasterList: (start, end) => dispatch(actions.getFreeAndBusyMasterList(start, end)),
        onGetAvailableInterval: (dateStart, dateEnd, discipline,isCallAdmin)=>dispatch(actions.getAvailableInterval(dateStart,dateEnd,discipline,isCallAdmin)),
        onGetTheMasterInterval: (dateStart, dateEnd, idMaster, weekdays, isCallAdmin) => dispatch(actions.getTheMasterInterval(dateStart, dateEnd, idMaster, weekdays, isCallAdmin)),
        onGetTrainingTrialStatusByDiscipline: (discipline, idStudent) => dispatch(actions.getTrainingTrialStatusByDiscipline(discipline, idStudent)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
