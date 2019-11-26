import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux';
import {findTimeInterval} from '../../helpers/timeInterval'
import {fillTrainingWeek} from './shedule';
import {message, Modal as PopupModal} from 'antd';


import Button from "../../components/Button";
import Calendar from "../../components/Calendar22";
import NewVisitModal from "../../components/NewVisitModal";
import NewMessageModal from "../../components/NewMessageModal";

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
            //startDate: props.startDate,
            //endDate:  props.endDate,

            //
            isEditorMode: false,
            currentDate: new Date(),
            interval: null,
            view: '',

            newVisitData: {
                date: null,
                students: [],
            },
            cancelModal: false,
            newMessageModal: false,
            sendingModal: false,
            receptionData: {
                dates: [],
                currentSched: {}
            },
            apiPatients: [],
            isShowFreeTrainers: false,
            amountTraining: true,
            modalTransferTraining: false,
            modalCancelTraining: false,
            modalMasterList: false,
            theMasterSelect: false,
            theTrialMasterSelect: false,
            notRedirectDiscipline: false,
            scheduleSpinner: true,
            modalRemoveTrialTraining: false,
            newModalSaveSchedule: false,
        }

        const m = moment().startOf('week');
        
        this.min = moment([m.get('year'), m.get('month'), m.get('date'), 8]).format('X')
        this.max = moment([m.get('year'), m.get('month'), m.get('date'),23]).format('X')
    };

    

    componentDidUpdate(nextProps, nextState) {
        const {currentIdUser, setParamsId} = this.props;

        if(nextProps.statusBtnBack !== this.props.statusBtnBack && nextProps.statusBtnBack === false){
            this.setState({
                isShowFreeTrainers: false,
                apiPatients: [],
                theMasterSelect: false,
                notRedirectDiscipline: false
            })
        }

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
        this.setChoosenTrainer(fullInfoMasters[rand].id)
    }

    resetAllEvent = () => {
        this.props.onSetPushTrialTraining(null)
        this.props.onUnsetPushBtnTransferTraining();
        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0});
    }

    showMasterList = (freetrainers, busytrainers) =>{
        this.freetrainers = freetrainers;
        this.busytrainers = busytrainers;

    }

    deleteTraining = (idTraining) => { // нажатие на крестик
        this.deleteIdTraining = idTraining;
        this.setState({modalRemoveTrialTraining: true});
    }

    deleteEventApiPatient = (idEvent) => {
        let newApiPatients = [];
        this.state.apiPatients.forEach((el) => {
            if(el.id !== idEvent) newApiPatients.push({...el})
        })

        this.setState({apiPatients: newApiPatients})
    }

    deleteTrialTraining = (id) => {
        this.props.onRemoveTrialTraining(id, this.props.isAdmin)
            .then(this.props.onGetTrainingsTrialStatus(this.id))
            .then(this.props.onGetTrainingTrialStatusByDiscipline(this.props.currDiscipline.code, this.id))
    }


    showModalTransferEvent = (idEvent) => { // нажатие на желтую область -> появление свободных тренеров
        const {isPushBtnTrialTraining, abonementIntervals, isPushBtnTransfer} = this.props;

        if(isPushBtnTransfer && this.delEvent){
            this.transferDay = {dateStart: Math.floor(+idEvent / 1000)}
            this.setTransfer_1_Training();
        }
        if(this.state.theMasterSelect){
            let {trainerList} = this.props;
            for(let i = 0; i < trainerList.length; i++){
                    if(trainerList[i].idMaster === this.props.chooseTheMaster){
                        let trainer= {...trainerList[i], apiPatients: true, id: idEvent};
                        trainer.start = new Date(idEvent);

                        this.setState({newModalSaveSchedule: true, apiPatients : [...this.state.apiPatients, trainer]})
                        return;
                    }
            }
        }
        if(isPushBtnTrialTraining === 'select_master'){
                const {trainerList, selectMaster} = this.props;
                for(let i = 0; i < trainerList.length; i++){
                    if(trainerList[i].idMaster == selectMaster){
                        let trainer= {...trainerList[i], apiPatients: true, id: idEvent};
                        trainer.start = new Date(idEvent);

                        this.setState({newModalSaveSchedule: true,apiPatients : [...this.state.apiPatients, trainer]})
                        return
                    }
                }

        }
        if(isPushBtnTrialTraining === 'trial'){
                            this.trialTime = idEvent;
                            this.setState({apiPatients : [ {trainer: null, start: new Date(idEvent), apiPatients: true, id: idEvent}]})

                            this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 1});
                            this.props.onMasterFreeOnDate(Math.floor(+idEvent / 1000), this.props.chooseArrMasters)
                                .then(() => this.setState({isShowFreeTrainers: true}))

        }

        else if(!this.props.isPushBtnTransfer){
            const students = [ {trainer: null, start: new Date(idEvent), id: idEvent, apiPatients: true}];
            const countTraining = abonementIntervals ? abonementIntervals.countTraining : 0

            this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: countTraining});
            this.props.onMasterFreeOnDate(Math.floor(+idEvent / 1000), this.props.chooseArrMasters)
                .then(() => this.setState({isShowFreeTrainers: true}))
            message.info('Выберите одного из тренеров')
            this.setState({apiPatients: students});
        }

    }

    setChoosenTrainer = (idMaster) => { // выбор одного из тренеров
        const { isPushBtnTrialTraining, masterListObj, abonementIntervals, isAdmin} = this.props;
        let start = null,
            end = null;

        if(isPushBtnTrialTraining === 'trial'){
            let {trainerList} = this.props;
            for(let i = 0; i < trainerList.length; i++){
                    if(trainerList[i].idMaster === idMaster){
                        let trainer= {...trainerList[i], id:this.trialTime, apiPatients: true};
                        trainer.start = new Date(this.trialTime); //idEvent ~ time

                        this.setState({newModalSaveSchedule: true, apiPatients : [ trainer], theTrialMasterSelect: true})
                        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: 1});
                        i = Infinity;
                    }
            }
            this.props.onSetPushTrialTraining('first_trainer');
            this.props.onSetChooseTheMasterByStudent(idMaster);

            setTimeout(() => this.fillTrainingWeek(), 1000);
            this.isNoTrial = 0;
            this.setState({isShowFreeTrainers : false});
            return;
        }

        if(!this.state.interval){
            start = moment(Date.now()).startOf('week');
            end = moment(Date.now()).endOf('week')
        }
        else {
            start = this.state.interval.start;
            end = this.state.interval.end;
        }
        const {chooseWeekdays} = this.props;
        const dateStart = Math.floor( + start.getTime() / 1000);
        const dateEnd   = Math.floor( + end.getTime() / 1000);


        if(masterListObj.hasOwnProperty(idMaster)){
            let bufApiPatient = []
            this.state.apiPatients.forEach((el) =>  {
                if(!el.trainer) bufApiPatient.push( {...masterListObj[idMaster], start: el.start, id: el.start, apiPatients:true})
                else bufApiPatient.push(el);
            })
            this.setState({apiPatients: bufApiPatient})
        }

        this.props.onGetTheMasterInterval(dateStart, dateEnd, idMaster, chooseWeekdays, isAdmin)
            .then(() => this.setState({theMasterSelect: true}));

        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: abonementIntervals.countTraining});
        this.props.onSetChooseTheMasterByStudent(idMaster);
        this.setState({isShowFreeTrainers : false, newModalSaveSchedule: true});
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

    fillTrainingWeek = () => { // создание абонемента

        const {
            abonementIntervals,
            currDiscipline,
            isPushBtnTrialTraining,
            selectMaster,
            subsForDisc,
            useFrozenTraining,
            isAdmin,
        } = this.props;
        const id = this.id;
        let isNoTrial = this.isNoTrial === 0 ? 0 : 1

        if(isPushBtnTrialTraining){
            this.props.onSetPushTrialTraining('choose_trial');
        }
        if(selectMaster){
            if(subsForDisc && subsForDisc.hasOwnProperty(currDiscipline.code)) {
                this.props.onAddAmountTraining(subsForDisc[currDiscipline.code], abonementIntervals.countTraining)
                    .then(() => this.updateAfterFilling())
            }
        }
        else{
            this.props.onCreateAbonement(fillTrainingWeek(id, abonementIntervals.countTraining, isNoTrial, [currDiscipline.code], [...this.state.apiPatients] ))
                .then(() => {
                        if(isNoTrial === 1) this.props.onEditUseFrozenTraining(id,useFrozenTraining);
                        if(this.props.isPushBtnUnfresh){
                            //this.props.onIsPushBtnUnfresh();
                        }
                        this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin); // получить уже распредленное время тренировок в абонементе
                        this.updateAfterFilling();
                });
        }

        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0}); // убрать Сохранить
        this.props.onChangeBtnBack(false);
        this.props.onGetDisciplineCommunication(id);

        this.isNoTrial = null;
        this.setState({theTrialMasterSelect: false,newModalSaveSchedule: false, apiPatients: [], sendingModal: true, theMasterSelect: false})
        message.success("Тренировки распределены по расписанию");
    }

    transferTraining = (transferDay) => {
        transferDay && (this.transferDay = {dateStart : Math.floor(+transferDay.getTime() / 1000)})
    }
    deleteEvent = (delEvent) => {
        if(delEvent && Object.keys(delEvent).length){
            this.delEvent = delEvent;
            this.setState({modalTransferTraining: true})
        }
    }

    setTransfer_1_Training = () => {

            const {currDiscipline, discCommunication, isAdmin} = this.props;
            const {id: idTraining} = this.delEvent.event;
            const currMaster = discCommunication.hasOwnProperty(currDiscipline.code) ? discCommunication[currDiscipline.code] : null
            const id = this.id;
            if(this.transferDay && currMaster){
                    this.props.onTransferTrainining({idTraining, idMaster: currMaster.idMaster, ...this.transferDay}, isAdmin)
                        .then(() => this.setState({scheduleSpinner: true}))
                        .then(() => this.props.onGetAbonementsFilter(id,currDiscipline,isAdmin))
            }

            this.props.onChangeBtnBack(false);
            this.props.onNoSetBtnTraining();
            this.setState({modalTransferTraining: false});
    }

    onCancelTraining = (transferId, idSubscription) => {
        this.cancelId = transferId; // для переноса в конец
        this.freezeIdSubscription = idSubscription; // для заморозки
        this.setState({modalCancelTraining: true});
    }

    setTransfer_End_Training = () => {
        const {currDiscipline, isAdmin} = this.props;
        const {startDate, endDate} = this.props;
        const id = this.id

        if(this.cancelId){
                this.props.onTransferTraininingToEnd({idTraining : this.cancelId}, isAdmin)
                    .then(() => this.props.onGetStudentsSchedule(id, startDate, endDate, currDiscipline.code)); 
        }
        this.setState({modalCancelTraining: false});
    }

    freezeAbonement = () => {
        const {currDiscipline,isAdmin} = this.props;
        const id = this.id

        if(this.freezeIdSubscription) {
            this.props.onFreezeAbonement(this.freezeIdSubscription)
                .then(() => {
                    this.props.onGetAbonementsFilter(id, currDiscipline,isAdmin);
                    setTimeout(()=>{
                        this.props.onGetStudentBalance(id);
                        this.props.onGetUseFrozenTraining(id);

                        this.props.onGetDisciplineCommunication(id);
                        this.props.onGetSubscriptionsByStudentId(id);

                    }, 1000);
                })

        }
        this.setState({modalCancelTraining: false});
    }


    setIntervalAndView = (date, view) => {
        const {start, end} = findTimeInterval(date, view);
        this.state.isEditorMode ? this.props.onGetAllIntervals(start, end) : null

        this.setState({
            interval: {
                start,
                end,
            },
            view,
        })
    }

    onSendDataTrialModal = (data) => {

        const {currDiscipline,isAdmin} = this.props;
        const id = this.id

        let array = [];
        let weekdays = []; // post
        const time0 = moment(Date.now()).startOf('week').format('X');
        const time1 = moment(Date.now()).endOf('week').format('X');
        const codeDisc = this.props.disciplines[data.type].code;

        for(let i = 0; i < 6; i++){
            if(data.selectedDays.hasOwnProperty(i)){
                weekdays.push(i + 1)
            }
        }


        this.props.onGetAvailableInterval(time0 ,time1, [codeDisc], isAdmin)
            .then(data => {
                if(!data.length)  message.info('На выбранной неделе нет свободных тренеров - перейди на следующую неделю')
            })
        this.props.onSetFreeIntervals(array, data.type);
        this.props.onGetAbonementsFilter(id, currDiscipline,isAdmin);
    };

    componentDidMount() {
        const {startDate, endDate, setParamsId} = this.props;

        //
        const {currDiscipline, isAdmin} = this.props;
        const id = this.getCurrentId() 
        setParamsId({currentIdUser: id})

        const start =  moment(Date.now()).startOf('week').format('X');
        const end = moment(Date.now()).endOf('week').format('X');

        this.props.onSetWeekInterval({start, end});

        this.setIntervalAndView(this.state.currentDate, 'week');

        //this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin, true);

        if(this.props.mode === 'student' || this.isStudentSchedule()){
            this.props.onGetDisciplineCommunication(id);

            this.props.onCheckToken(id)
                //.then(() => setTimeout(() => this.setState({scheduleSpinner: false})))
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


    componentWillUnmount() {
        if(!this.state.isShowFreeTrainers){
            this.props.onSetPushTrialTraining(null)
            this.props.onUnsetPushBtnTransferTraining();
            this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0});
        }
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
            isPushBtnTrialTraining, 
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

    dateChangeHandler = (date, view, action, isOnDay) => {
        const {chooseWeekdays, mode, currDiscipline, chooseTheMaster, isPushBtnTrialTraining,discCommunication,isPushBtnUnfresh,isAdmin} = this.props;
        const id =  this.id

        const {start, end} = this.state.isEditorMode
            ? findTimeInterval(date, 'month'): isOnDay ? findTimeInterval(date, 'day') : findTimeInterval(date, this.state.view);

        let endW = moment(end.getTime()).endOf('week').format('X')

        this.state.isEditorMode ? isOnDay ? null : this.props.onGetAllIntervals(start, end) : null

        this.setState({scheduleSpinner: true})
        isOnDay ?
            this.setState({
                currentDate: date,
                interval: {
                    start,
                    end,
                },
                view: 'day'
            })
            :
            this.setState({
                currentDate: date,
                interval: {
                    start,
                    end,
                },
            })


        const dateStart = Math.floor(+start.getTime() / 1000);
        const dateEnd = endW;
        const spinEnd = () => setTimeout(() => this.setState({scheduleSpinner: false}), 1000)
        this.props.onSetWeekInterval({start: dateStart, end: dateEnd});

        if(mode === 'admin'){
            this.props.onGetFreeAndBusyMasterList(dateStart, dateEnd)
                //.then(spinEnd)
        }
        if(mode === 'master'){
            this.props.onGetTrainerTraining(id, dateStart, dateEnd, currDiscipline)
                //.then(spinEnd)
        }
        if(mode === 'student'){
            this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin)
                //.then(spinEnd)
        }


        if(this.state.theMasterSelect){
            this.props.onGetTheMasterInterval(dateStart, dateEnd, chooseTheMaster, chooseWeekdays,isAdmin)
                .then(spinEnd);
        }
        else if(isPushBtnTrialTraining === 'trial' || isPushBtnUnfresh){
            this.props.onGetAvailableInterval(dateStart, dateEnd, currDiscipline.code, isAdmin)
                .then(data => {
                    if(!data.length)  message.info('На выбранной неделе нет свободных тренеров - перейди на следующую неделю')
                    spinEnd()
                });
        }

        if(this.props.isPushBtnTransfer){
                if(discCommunication.hasOwnProperty(currDiscipline.code)){
                    this.props.onGetTheMasterInterval(dateStart, dateEnd, discCommunication[currDiscipline.code].idMaster, [0,1,2,3,4,5,6], isAdmin)
                    .then(() => this.setState({theMasterSelect: true}));
                }
        }
    };

    changeCurrDiscipline = (disc) => {
        const {start, end} = this.state.isEditorMode;
        const {currDiscipline, mode} = this.props;
        const {startDate, endDate} = this.props;
        const id = this.id

        if(mode === 'student'){     
            this.props.onGetStudentsSchedule(id, startDate, endDate, disc);
        }
        else if(mode === 'master'){
            this.props.onGetTrainerTraining(id, start, end, disc);
        }
        this.props.onChangeCurrDiscipline(disc)
    }


    onSaveNewVisit = (obj) => {
        return this.props.onAddNewVisit(obj, this.state.interval.start, this.state.interval.end);
    };

    onPatientEmail = () => {
        this.setState({newMessageModal: true,})
    };

    closeNewMessage = () => {
        this.setState({newMessageModal: false,})
    };

    onSendNewMessage = (info) => {
        this.props.onSendMessage(info)
        this.setState({newMessageModal: false,})
    };

    eventDeleteHandler = (id) => {
        this.props.onEventDelete(id);
        this.setState({sendingModal: true});
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
            abonementIntervals,
            trainerList,
            masterList,
            allAbonements,
            currDiscipline,
            profileStudent,
            isAdmin} = this.props;

        const id = this.getCurrentId();
        let calendar;
        let isNeedSaveIntervals = false
        if(abonementIntervals){
            isNeedSaveIntervals = abonementIntervals.visibleCreateTrainModal;
            this.countTraining = abonementIntervals.countTraining; //кол-во трень в абонементе
        }
        

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
                onChangeCurrDiscipline = {this.changeCurrDiscipline}
                
                //



                    selectable
                    onSelectEvent={this.props.onSelectEvent}
                    defaultView="week"
                    onView={(view, date) => {
                        !date ? this.setIntervalAndView(this.state.currentDate, view) : () => {
                        };
                    }}
                    date={this.state.currentDate}
                    onGotoPatient={this.gotoHandler}
                    step={60}
                    
                    
                    showMasterList = {this.showMasterList}
                    intervals={ isNeedSaveIntervals ? this.props.freeIntervals : []}
  
                    onPopoverClose={this.eventDeleteHandler}
                    onPopoverEmail={this.onPatientEmail}
                    highlightedDates = {this.prepareDatesForSmallCalendar(this.props.allUserVisits)}
                    showTransferEvent={this.showTransferEvent} // my
                    freeTrainers={trainerList} //my
                    showModalTransferEvent={this.showModalTransferEvent}
                    setChoosenTrainer={this.setChoosenTrainer}
                    isNeedSaveIntervals={isNeedSaveIntervals}
                    fillTrainingWeek = {this.fillTrainingWeek}
                    isShowFreeTrainers = {this.state.isShowFreeTrainers}
                    transferTraining = {this.transferTraining} // drag and drop
                    deleteEvent = {this.deleteEvent} // drag and drop
                    onCancelTraining = {this.onCancelTraining}
                    trainerTraining = {this.props.trainerTraining}
                    scheduleSpinner = {this.state.scheduleSpinner}

                    />)
        }
        else { // student
            
                            let notRedirectDiscipline = false;
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
                                  onSelectEvent={this.props.onSelectEvent}
                                  defaultView="week"
                                  onView={(view, date) => {
                                      !date ? this.setIntervalAndView(this.state.currentDate, view) : () => {
                                      };
                                  }}
                                  
                                  onGotoPatient={this.gotoHandler}
                                  step={60}
                                  selectAnyTrainer = {this.selectAnyTrainer}
                                  mode = {this.props.mode}
                                  events={(Array.isArray(allAbonements) && allAbonements.length) ? [...allAbonements, ...this.state.apiPatients] : this.state.apiPatients}
                                  
                                  notRedirectDiscipline = {notRedirectDiscipline}
                                  

                                  selectDisciplines = {this.props.selectDisciplines}
                                  currDiscipline = {this.props.currDiscipline}
                                  onChangeCurrDiscipline = {this.changeCurrDiscipline}
                                  
                                  onPopoverClose={this.eventDeleteHandler}
                                  onPopoverEmail={this.onPatientEmail}
                                  onChange={this.dateChangeHandler}
                                  highlightedDates = {this.prepareDatesForSmallCalendar(this.props.allUserVisits)}
                                  // my
                                  freeTrainers={this.props.fullInfoMasters} //my
                                  showModalTransferEvent={this.showModalTransferEvent}
                                  setChoosenTrainer={this.setChoosenTrainer}
                                  isNeedSaveIntervals={this.state.apiPatients.length && (this.state.theMasterSelect||this.state.theTrialMasterSelect) ? true : false}//{this.state.newModalSaveSchedule}
                                  fillTrainingWeek = {this.fillTrainingWeek}
                                  isShowFreeTrainers = {this.state.isShowFreeTrainers}
                                  transferTraining = {this.transferTraining} // drag and drop
                                  deleteEvent = {this.deleteEvent} // drag and drop
                                  
                                  trainerTraining = {this.props.trainerTraining}
                                  scheduleSpinner = {this.state.scheduleSpinner}
                                  countTrainingDiscipline = {this.props.countTrainingDiscipline}
                                  onRemoveTrialTraining = {this.deleteTrialTraining}

            />)
        }

        
        let cardTitle = (this.isStudentSchedule() && profileStudent.name) ? "Расписание - "+profileStudent.name : 'Расписание тренировок'

        return (
            <React.Fragment>
                <Card title={cardTitle}>
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
                                                .then(() => this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin))

                                            this.setState({modalRemoveTrialTraining: false});
                                        }}
                                        type='yellow'/>
                                </div>
                        </div>
                 </Modal> 

                <TransferOrFreezeModal />

                <TransferOrNewScheduleModal />
                
                <ListTrainersModal />

                <NewMessageModal visible={this.state.newMessageModal}
                                 {...this.props.chosenData}
                                 onCancel={this.closeNewMessage}
                                 onSend={ this.onSendNewMessage}
                />

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
        trainerList: state.trainer.trainerList,
        trainerTraining: state.trainer.trainerTraining,
        chooseWeekdays: state.student.weekdays,
        chooseDiscipline: state.student.discipline,
        chooseArrMasters: state.scheduleIdParams.masters, //id masterov
        fullInfoMasters: state.student.fullInfoMasters,
        amountTraining: state.students.amountTraining, // поменять на student
        eventTraining: state.trainer.eventTraining,
        isPushBtnTransfer: state.student.isPushBtnTransfer,
        isPushBtnAdd: state.student.isPushBtnAdd,
        isPushBtnTrialTraining: state.student.isPushBtnTrialTraining,
        profileStudent: state.profileStudent,
        selectDisciplines: state.abonement.disciplines,
        currDiscipline: state.abonement.currDiscipline,
        disciplines: state.abonement.disciplines,
        chooseTheMaster: state.abonement.chooseTheMaster,
        mainUser: (state.profileStudent) ? (state.profileStudent.mainUser ? state.profileStudent.mainUser : null) : null,

        students:  state.students.coachStudents,
        freeIntervals:  state.students.freeIntervals,
        abonementIntervals: state.students.abonementIntervals,
        countTraining: state.students.countTraining,
        isUser:  state.auth.mode === "user",
        isAdmin:  state.auth.mode === "admin",
        theMasterInterval: state.student.theMasterInterval,
        mode: state.auth.mode,
        selectMaster: state.student.selectMaster, //из payment выбран
        discAbonement: state.student.discAbonement, // id абонементов у этого студента
        masterListObj: state.trainer.masterListObj,
        subsForDisc : state.abonement.subsForDisc,
        isPushBtnUnfresh: state.student.isPushBtnUnfresh,
        useFrozenTraining: state.student.useFrozenTraining,
        discCommunication: state.student.discCommunication,
        checkToken: state.acquiring.checkToken,
        countTrainingDiscipline: state.training.countTrainingDiscipline,
        willTrial: state.training.willTrial,
        finishedTrial: state.training.willTrial,

        
        freetrainers: state.admin.freetrainers,
        busytrainers: state.admin.busytrainers,
        statusBtnBack: state.student.statusBtnBack,
        sheduleStudent: state.admin.profileStudent
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
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
        onSetWeekInterval: (interval) => dispatch(actions.setWeekInterval(interval)),
        onUnsetPushBtnTransferTraining: () => dispatch(actions.unsetPushBtnTransferTraining()),
        onIssetTrial: (id) => dispatch(actions.issetTrial(id)),


        onGetTrainerTraining: (id, dateMin, dateMax, currDiscipline) => dispatch(actions.getTrainerTraining(id, dateMin, dateMax, currDiscipline)),
        onFreezeAbonement: (idSubscription) => dispatch(actions.freezeAbonement(idSubscription)),
        onGetInfoMasters: (idMaster) => dispatch(actions.getInfoMasters(idMaster)),
        onSetChooseMasterAllInfo: (allInfo) => dispatch(actions.setChooseMasterAllInfo(allInfo)),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onSetChooseTheMasterByStudent: (master) => dispatch(actions.setChooseTheMasterByStudent(master)),
        onNoSetBtnTraining: () => dispatch(actions.noSetBtnTraining()),
        onGetAbonementsFilter: (idStudent, currDiscipline,isCallAdmin,isFirst) => dispatch(actions.getAbonementsFilter(idStudent, currDiscipline,isCallAdmin,isFirst)),

        onAddAmountTraining: (idSubscription, addAmount) => dispatch(actions.addAmountTraining(idSubscription, addAmount)),
        onGetStudentBalance: (idStudent) => dispatch(actions.getStudentBalance(idStudent)),
        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
        onEditUseFrozenTraining: (idStudent,amountTraining) => dispatch(actions.editUseFrozenTraining(idStudent,amountTraining)),
        onGetUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),
        //onIsPushBtnUnfresh: () => dispatch(actions.isPushBtnUnfresh()),
        //onChangePushBtnUnfresh: (status) => dispatch(actions.isPushBtnUnfresh(status)),

        onSetMasterTheDisicipline: (idMaster) => dispatch(actions.setMasterTheDisicipline(idMaster)),
        onCheckToken: (idUser) => dispatch(actions.checkToken(idUser)),
        onGetFutureTrialTraining: (id, discipline) => dispatch(actions.getFutureTrialTraining(id, discipline)),
        onRemoveTrialTraining: (idTraining, isCallAdmin) => dispatch(actions.removeTrialTraining(idTraining, isCallAdmin)),
        onGetSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),
        onChangeBtnBack: (status) => dispatch(actions.changeBtnBack(status)),
        onGetTrainingsTrialStatus: (idStudent) => dispatch(actions.getTrainingsTrialStatus(idStudent)),

        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data)),

        onGetFreeAndBusyMasterList: (start, end) => dispatch(actions.getFreeAndBusyMasterList(start, end)),
        onGetAvailableInterval: (dateStart, dateEnd, discipline,isCallAdmin)=>dispatch(actions.getAvailableInterval(dateStart,dateEnd,discipline,isCallAdmin)),
        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onMasterFreeOnDate: (dateStart, chooseArrMasters) => dispatch(actions.masterFreeOnDate(dateStart, chooseArrMasters)),
        onGetTheMasterInterval: (dateStart, dateEnd, idMaster, weekdays, isCallAdmin) => dispatch(actions.getTheMasterInterval(dateStart, dateEnd, idMaster, weekdays, isCallAdmin)),
        onGetTrainingTrialStatusByDiscipline: (discipline, idStudent) => dispatch(actions.getTrainingTrialStatusByDiscipline(discipline, idStudent)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
