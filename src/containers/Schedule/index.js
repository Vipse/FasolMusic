import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux';
import {findTimeInterval} from '../../helpers/timeInterval'
import {timePeriod} from './mock-data'
import {fillTrainingWeek} from './shedule';
import {message, Modal as PopupModal} from 'antd';
import Hoc from '../../hoc'

import Button from "../../components/Button";
import Calendar from "../../components/Calendar22";
import CancelVisitModal from "../../components/CancelVisitModal";
import NewVisitModal from "../../components/NewVisitModal";
import NewMessageModal from "../../components/NewMessageModal";
import FreeAdminTrainersItem from './../../components/FreeAdminTrainersItem/index';

import ReceptionsScheduleModal from "../../components/ReceptionsScheduleModal";
import Modal from './../../components/Modal/index';
import * as actions from '../../store/actions'
import Card from './../../components/Card/index';

import './styles.css'

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditorMode: false,
            currentDate: new Date(),
            interval: null,
            view: '',
            newVisitModal: false,

            newVisitData: {
                date: null,
                students: [],
            },
            cancelModal: false,
            newMessageModal: false,
            receptionsScheduleModal: false,
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
            isSpinnerFreeTrainers: false,
            modalMasterListData:null
        }
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.statusBtnBack !== this.props.statusBtnBack && nextProps.statusBtnBack === false){
            this.setState({
                scheduleSpinner: false,
                isShowFreeTrainers: false,
                apiPatients: [],
                theMasterSelect: false,
                notRedirectDiscipline: false
            })
        }
        this.id = this.getCurrentId()
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

    showMasterList = (freetrainers, busytrainers, time) =>{
        this.freetrainers = freetrainers;
        this.busytrainers = busytrainers;
    
        this.props.onGetAllInfoMasters('free', [...freetrainers])
            .then(() => this.props.onGetAllInfoMasters('busy', [ ...busytrainers])
            .then(() => this.setState({chosenTime:time}))
            .then(()=>{
                const date = moment(time).format('X');

                let trainers = this.props.busytrainers.map((item)=>{
                    return {
                        id:item.idMaster,
                        disciplines:{code:item.disciplines[0].discipline[0].value}
                    }
                })

                    Promise.all(trainers.map( async(item) => {

                        await this.props.onGetTrainerTraining(item.id,date,date)
                        let training = this.props.trainerTraining[Object.keys(this.props.trainerTraining)[0]]['1'].allInfo
                        
                        await this.props.onGetUserInfo(training.idStudent);
                        let student = this.props.studentInfo

                        /* await this.props.onGetAllTrainingStudent(training.idStudent);
                        let allTrainings = this.props.studentTrainings; */ // Заменить функцией которая будет

                        return {
                            idStudent:training.idStudent,
                            idMaster:training.idMaster,
                            isTrial:training.trial,
                            isBooking:training.isBooking,
                            name:student.name ? student.name:student.fio,
                            avatar:student.avatar,
                            isOnline:student.online
                        }

                    }))
                    .then((res) => {
                        this.setState({modalMasterListData:res})
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                
            })
            .then(() => this.setState({modalMasterList: true})))

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

    clickOnEvent = (event) => {
        const {isPushBtnTransfer} = this.props;
        if(isPushBtnTransfer){
            this.delEvent = {event, wasTransfer: event.wasTransfer};
        }
    }
    showModalTransferEvent = (idEvent) => { // нажатие на желтую область -> появление свободных тренеров
        const {isPushBtnTrialTraining, abonementIntervals, isPushBtnTransfer} = this.props;

        if(isPushBtnTransfer && this.delEvent){
            this.transferDay = {dateStart: Math.floor(+idEvent / 1000)}
            this.setState({modalTransferTraining: true})
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
                                .then(() => this.setState({isShowFreeTrainers: true, isSpinnerFreeTrainers: false}))

        }

        else if(!this.props.isPushBtnTransfer){
            const students = [ {trainer: null, start: new Date(idEvent), id: idEvent, apiPatients: true}];
            const countTraining = abonementIntervals ? abonementIntervals.countTraining : 0

            this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: countTraining});
            this.props.onMasterFreeOnDate(Math.floor(+idEvent / 1000), this.props.chooseArrMasters)
                .then(() => this.setState({isShowFreeTrainers: true, isSpinnerFreeTrainers: false}))
            message.info('Выберите одного из тренеров')
            this.setState({apiPatients: students});
        }

        this.state.isShowFreeTrainers && this.setState({isSpinnerFreeTrainers: true})
    }

    setChoosenTrainer = (idMaster) => { // выбор одного из тренеров
        const { profileStudent: fdata, isPushBtnTrialTraining, masterListObj, abonementIntervals, isAdmin} = this.props;
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
            disciplines,
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
                            this.props.onIsPushBtnUnfresh();
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
                        .then(() => this.setState({scheduleSpinner: false}))
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
        const id = this.id

        if(this.cancelId){
                this.props.onTransferTraininingToEnd({idTraining : this.cancelId}, isAdmin)
                    .then(() => this.props.onGetAbonementsFilter(id, currDiscipline,isAdmin));
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

    setAbonement_Training = () => {
        let subs = this.props.allAbonements;
        const {start} = this.delEvent.event;
        const {currDiscipline, isAdmin} = this.props;
        const id = this.id
        let scheduleForWeek = {}; 
        let trainingtime = {};

        const max = subs.length;
        const curWeek = moment( start.getTime() ).week(); // текущая неделя

        for(let i = 0; i < max; i++){

                let item = subs[i];
                const weekElem =  moment(item.start.getTime()).week(); // номер недели

                if (curWeek === weekElem && !item.trial) {
                    if( item.id === this.delEvent.event.id ){
                        const weekDay =  new Date(this.transferDay.dateStart * 1000).getDay(); // номер дня в неделе ( переносимое занятие)

                        if(!trainingtime.hasOwnProperty(weekDay)){
                                trainingtime[weekDay] = [];
                        }
                        trainingtime[weekDay].push({id: item.idMaster, start: +this.transferDay.dateStart })
                    }
                    else{
                        const weekDay =  item.start.getDay();
                        if(!trainingtime.hasOwnProperty(weekDay)){
                                trainingtime[weekDay] = [];
                        }
                        trainingtime[weekDay].push({id: item.idMaster, start: Math.floor(+item.start.getTime() / 1000) })
                    }

                    if(!scheduleForWeek.dateStart){
                        scheduleForWeek.dateStart = Math.floor(subs[i].start.getTime() / 1000);
                        scheduleForWeek.idSubscription = subs[i].idSubscription;
                        scheduleForWeek.idStudent = id;
                        scheduleForWeek.amount = subs[i].amount;
                    }


                }
        }

        scheduleForWeek.trainingtime = trainingtime;

        this.props.onChangeBtnBack(false);
        this.resetAllEvent();
        this.props.onChangeSubscription(scheduleForWeek, isAdmin)
            .then(() => this.props.onGetAbonementsFilter(id, currDiscipline,isAdmin));

        this.setState({modalTransferTraining: false});
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


        this.props.onGetAvailableInterval(time0 ,time1, weekdays, [codeDisc], isAdmin)
            .then(data => {
                if(!data.length)  message.info('На выбранной неделе нет свободных тренеров - перейди на следующую неделю')
            })
        this.props.onSetFreeIntervals(array, data.type);
        this.props.onGetAbonementsFilter(id, currDiscipline,isAdmin);
    };

    componentDidMount() {
        const {currDiscipline, isAdmin} = this.props;
        const id = this.getCurrentId() 

        console.log('SCH this.props.match', this.props.match)
        const start =  moment(Date.now()).startOf('week').format('X');
        const end = moment(Date.now()).endOf('week').format('X');

        this.props.onSetWeekInterval({start, end});

        this.setIntervalAndView(this.state.currentDate, 'week');

        this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin, true);

        if(this.props.mode === 'student' || this.isStudentSchedule()){
            this.props.onGetDisciplineCommunication(id);

            this.props.onCheckToken(id)
                .then(() => setTimeout(() => this.setState({scheduleSpinner: false})))
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
                        this.props.onChangePushBtnUnfresh(true)
                    }
                })
        }

        if(this.props.isAdmin) {

            this.props.onGetFreeAndBusyMasterList(start, end)
                .then(() => setTimeout(() => this.setState({scheduleSpinner: false}), 500))
        }
        if(this.props.mode === 'master'){
            this.props.onGetTrainerTraining(id, start, end, currDiscipline)
                .then(() => setTimeout(() => this.setState({scheduleSpinner: false})))
            
            this.props.onGetInfoDoctor(id)
            .then(()=>{
                this.setCurrDiscipline();
            })
        }

    }

    componentWillUnmount() {
        if(!this.state.isShowFreeTrainers){
            this.props.onSetPushTrialTraining(null)
            this.props.onUnsetPushBtnTransferTraining();
            this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0});
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

        if(mode === 'admin' && !this.isStudentSchedule()){
            this.props.onGetFreeAndBusyMasterList(dateStart, dateEnd)
                .then(spinEnd)
        }
        if(mode === 'master'){
            this.props.onGetTrainerTraining(id, dateStart, dateEnd, currDiscipline)
                .then(spinEnd)
        }
        if(mode === 'student' || this.isStudentSchedule()){
            this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin)
                .then(spinEnd)
        }


        if(this.state.theMasterSelect){
            this.props.onGetTheMasterInterval(dateStart, dateEnd, chooseTheMaster, chooseWeekdays,isAdmin)
                .then(spinEnd);
        }
        else if(isPushBtnTrialTraining === 'trial' || isPushBtnUnfresh){
            this.props.onGetAvailableInterval(dateStart, dateEnd, chooseWeekdays, currDiscipline.code, isAdmin)
                .then(data => {
                    if(!data.length)  message.info('На выбранной неделе нет свободных тренеров - перейди на следующую неделю')
                    spinEnd()
                });
        }

        if(this.props.isPushBtnTransfer){
                if(discCommunication.hasOwnProperty(currDiscipline.code)){
                    this.props.onGetTheMasterInterval(dateStart, dateEnd, discCommunication[currDiscipline.code].idMaster, [0,1,2,3,4,5,6], isAdmin)
                    .then(() => {
                        this.setState({theMasterSelect: true, scheduleSpinner: false})
                        spinEnd()
                    });
                }
        }
    };

    changeCurrDiscipline = (disc) => {
        const {start, end} = this.state.isEditorMode;
        const {currDiscipline, mode} = this.props;
        const id= this.id


        if(mode === 'student'){
           // this.props.onGetAbonementsFilter(id, currDiscipline);
        }
        else if(mode === 'master'){
            this.props.onGetTrainerTraining(id, start, end, disc);
        }
        this.props.onChangeCurrDiscipline(disc)
    }

    setCurrDiscipline = () => {
        let {mode} = this.props;

        if (mode == 'master') {
            let trainer = this.props.profileCoach;

            if (trainer.disciplines.length == 1) {
            let discipline = trainer.disciplines[0].discipline[0]
            discipline.code=discipline.id
            this.changeCurrDiscipline(discipline)
            }
        }
    }

    closeNewVisitModal = () => {
        this.setState({
            newVisitModal: false,
        })
    };

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

    changeToEditorMode = (isEditorMode) => {
        let mode = isEditorMode ? 'month' : 'week';
        const {start, end} = findTimeInterval(this.state.currentDate, mode);
        isEditorMode ? this.props.onGetAllIntervals(start, end) : null

        this.setState({
            view: mode,
            interval: {
                start,
                end,
            },
        });
        this.setState({isEditorMode});
    };

    closeReceptionSchedule = () => {
        this.setState({
            receptionsScheduleModal: false,
            receptionData: {
                ...this.state.receptionData,
                dates: [],
            }
        })
    };

    onSaveReceptionSchedule = (interval) => {
        this.props.onAddInterval(interval, this.state.interval.start, this.state.interval.end);
        this.setState({
            receptionsScheduleModal: false,
            receptionData: {
                ...this.state.receptionData,
                dates: [],
            }
        })
    };

    openReceptionSchedule = (date, schedule) => {
        if (schedule) {
            this.setState({
                receptionData: {
                    ...this.state.receptionData,
                    currentSched: schedule
                }
            })
        }
        if (date.length !== 0) {
            this.setState({
                receptionsScheduleModal: true,
                receptionData: {
                    ...this.state.receptionData,
                    dates: [].concat(this.state.receptionData.dates, date)
                }
            })
        }
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
        const {
            abonementIntervals,
            trainerList,
            masterList,
            allAbonements,
            currDiscipline,
            isPushBtnTransfer,
            isPushBtnAdd,
            profileStudent,
            isPushBtnTrialTraining,
            history,
            isAdmin} = this.props;

        const id = this.getCurrentId();
        let isNeedSaveIntervals = false
        if(abonementIntervals){
            isNeedSaveIntervals = abonementIntervals.visibleCreateTrainModal;
            this.countTraining = abonementIntervals.countTraining; //кол-во трень в абонементе
        }
        const {dates, currentSched} = this.state.receptionData;
        let editorBtn, calendar, timeSetCall = this.state.receptionData.currentSched.intervalOb, timeSetReception = [];
        let {intervalTime, type, isDayOff} = this.state.receptionData.currentSched;
        if ('intervalOb' in currentSched || 'intervalEx' in currentSched) {
            timeSetCall = currentSched.intervalOb.map(item => {
                return {
                    defaultStartValue: moment(item.start),
                    defaultEndValue: moment(item.end),
                }
            });
            timeSetReception = currentSched.intervalEx.map(item => {
                return {
                    defaultStartValue: moment(item.start),
                    defaultEndValue: moment(item.end),
                }
            });

        }

        if (this.props.isAdmin && !this.isStudentSchedule()) {
            const currDate = this.state.currentDate,
            currY = currDate.getFullYear(),
            currM = currDate.getMonth(),
            currD = currDate.getDate();

            let min = new Date( currY, currM, currD, 9);
            let max = new Date( currY, currM, currD, 22);

            calendar = (<Calendar
                    selectable
                    onSelectEvent={this.props.onSelectEvent}
                    defaultView="week"
                    onView={(view, date) => {
                        !date ? this.setIntervalAndView(this.state.currentDate, view) : () => {
                        };
                    }}
                    date={this.state.currentDate}
                    onNavigate={this.dateChangeHandler}
                    gotoEditor={() => this.changeToEditorMode(true)}
                    onGotoPatient={this.gotoHandler}
                    step={60}
                    masterList={(masterList) ? masterList : {}}
                    isAdmin = {this.props.isAdmin}
                    showMasterList = {this.showMasterList}
                    intervals={ isNeedSaveIntervals ? this.props.freeIntervals : []}
                    min= {min}
                    max= {max}
                    onPopoverClose={this.eventDeleteHandler}
                    onPopoverEmail={this.onPatientEmail}
                    onChange={this.dateChangeHandler}
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
                    setAbonement_Training = {this.setAbonement_Training}
                    onCancelTraining = {this.onCancelTraining}
                    trainerTraining = {this.props.trainerTraining}
                    scheduleSpinner = {this.state.scheduleSpinner}

                    />)
        }
        else if (this.props.mode === 'master') {
            const currDate = this.state.currentDate,
                currY = currDate.getFullYear(),
                currM = currDate.getMonth(),
                currD = currDate.getDate();

                let min = new Date( currY, currM, currD, 9);
                let max = new Date( currY, currM, currD, 22);

            calendar = (<Calendar receptionNum={this.props.eventTraining ? this.props.eventTraining.length : 0}
                                  isUser = {true}
                                  events = {this.props.eventTraining}//{this.props.allUserVisits} //
                                  onNavigate={this.dateChangeHandler}
                                  date={this.state.currentDate}
                                  min= {min}
                                  max= {max}
                                  step={60}
                                  mode = {this.props.mode}
                                  selectDisciplines = {this.props.selectDisciplines}
                                  currDiscipline = {this.props.currDiscipline}
                                  onChangeCurrDiscipline = {this.changeCurrDiscipline}
                                  scheduleSpinner = {this.state.scheduleSpinner}
                                  countTrainingDiscipline = {this.props.countTrainingDiscipline}
                                  onGotoPage= { (id) => this.props.history.push('/app/student' + id)}
                                  onChange={this.dateChangeHandler}
                                  highlightedDates = {this.prepareDatesForSmallCalendar(this.props.allUserVisits)}
                        />)
        }
        else {
            const currDate = this.state.currentDate,
                currY = currDate.getFullYear(),
                currM = currDate.getMonth(),
                currD = currDate.getDate();

                let min = new Date( currY, currM, currD, 9);
                let max = new Date( currY, currM, currD, 22);

            editorBtn = (<Button btnText='Редактор графика'
                                 onClick={() => this.changeToEditorMode(true)}
                                 type='yellow'
                                 icon='setting_edit'/>)

                            let filterInterval = [];
                            let notRedirectDiscipline = false;
                            if(0 !== this.countTraining && this.countTraining <= this.state.apiPatients.length){                          
                                //nothing
                            }
                             else if(isPushBtnTrialTraining === 'trial'){
                                filterInterval = this.props.superFreeInterval;
                                notRedirectDiscipline = true;
                             }
                             else if(isPushBtnTrialTraining === 'select_master'){
                                filterInterval = this.props.theMasterInterval;
                                notRedirectDiscipline = true;
                             }

                             else if(this.state.theMasterSelect || isPushBtnTransfer || isPushBtnAdd || isPushBtnTrialTraining === 'first_trainer'){

                                filterInterval = this.props.theMasterInterval;
                                notRedirectDiscipline = true;

                             }
                             else if(isNeedSaveIntervals){

                                filterInterval =  this.props.superFreeInterval;
                                notRedirectDiscipline = true;
                             }

            calendar = (<Calendar
                                  receptionNum={(Array.isArray(allAbonements) && allAbonements.length) ? allAbonements.length : this.state.apiPatients.length}
                                  selectable
                                  onSelectEvent={this.props.onSelectEvent}
                                  defaultView="week"
                                  onView={(view, date) => {
                                      !date ? this.setIntervalAndView(this.state.currentDate, view) : () => {
                                      };
                                  }}
                                  date={this.state.currentDate}
                                  onNavigate={this.dateChangeHandler}
                                  gotoEditor={() => this.changeToEditorMode(true)}
                                  onGotoPatient={this.gotoHandler}
                                  step={60}
                                  onGotoPage= {id => history.push('/app/coach' + id)}
                                  clickOnEvent = {this.clickOnEvent}
                                  selectAnyTrainer = {this.selectAnyTrainer}
                                  mode = {this.props.mode}
                                  events={(Array.isArray(allAbonements) && allAbonements.length) ? [...allAbonements, ...this.state.apiPatients] : this.state.apiPatients}
                                  intervals={filterInterval}
                                  superFreeInterval = {filterInterval}
                                  isPushBtnTransfer = {this.props.isPushBtnTransfer}
                                  notRedirectDiscipline = {notRedirectDiscipline}
                                  deleteEventApiPatient = {this.deleteEventApiPatient}

                                  selectDisciplines = {this.props.selectDisciplines}
                                  currDiscipline = {this.props.currDiscipline}
                                  onChangeCurrDiscipline = {(disc) => {
                                    this.props.onChangeCurrDiscipline(disc);
                                    this.props.onGetAbonementsFilter(id, disc, isAdmin);
                                    }}
                                  min= {min}
                                  max= {max}
                                  onPopoverClose={this.eventDeleteHandler}
                                  onPopoverEmail={this.onPatientEmail}
                                  onChange={this.dateChangeHandler}
                                  highlightedDates = {this.prepareDatesForSmallCalendar(this.props.allUserVisits)}
                                  deleteTraining={this.deleteTraining} // my
                                  freeTrainers={this.props.fullInfoMasters} //my
                                  showModalTransferEvent={this.showModalTransferEvent}
                                  setChoosenTrainer={this.setChoosenTrainer}
                                  isNeedSaveIntervals={this.state.apiPatients.length && (this.state.theMasterSelect||this.state.theTrialMasterSelect) ? true : false}//{this.state.newModalSaveSchedule}
                                  fillTrainingWeek = {this.fillTrainingWeek}
                                  isShowFreeTrainers = {this.state.isShowFreeTrainers}
                                  transferTraining = {this.transferTraining} // drag and drop
                                  deleteEvent = {this.deleteEvent} // drag and drop
                                  setAbonement_Training = {this.setAbonement_Training}
                                  onCancelTraining = {this.onCancelTraining}
                                  trainerTraining = {this.props.trainerTraining}
                                  scheduleSpinner = {this.state.scheduleSpinner}
                                  countTrainingDiscipline = {this.props.countTrainingDiscipline}
                                  onRemoveTrialTraining = {this.deleteTrialTraining}
                                  isSpinnerFreeTrainers = {this.state.isSpinnerFreeTrainers}

            />)
        }

        
        let cardTitle = (this.isStudentSchedule() && profileStudent.name) ? "Расписание - "+profileStudent.name : 'Расписание тренировок'

        return (
            <Hoc>
                <Card title={cardTitle}>
                        {calendar}
                </Card>


                <Modal
                    title='Сообщение'
                    visible={this.state.modalTransferTraining}
                    onCancel={() => this.setState({modalTransferTraining : false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                >
                        <div className="schedule-message-modal">
                                {(isAdmin || (this.delEvent && !this.delEvent.wasTransfer)) && <div className="schedule-message-btn">
                                    <Button btnText='Перенести 1 треню'
                                        onClick= {this.setTransfer_1_Training}
                                        type='yellow'/>
                                </div>}

                                <div className="schedule-message-btn">
                                            <Button btnText='Новое расписание'
                                            onClick= {this.setAbonement_Training}
                                            type='yellow'/>
                                </div> 
                        </div>
                </Modal>


                <Modal
                    title='Сообщение'
                    visible={this.state.modalCancelTraining}
                    onCancel={() => this.setState({modalCancelTraining : false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                >
                        <div className="schedule-message-modal">
                                <div className="schedule-message-btn">
                                    <Button btnText='Перенести треню в конец'
                                        onClick= {this.setTransfer_End_Training}
                                        type='yellow'/>
                                </div>

                                <div className="schedule-message-btn">
                                    <Button btnText='Заморозка расписания'
                                    onClick= {this.freezeAbonement}
                                    type='yellow'/>
                                </div>
                        </div>
                </Modal>

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

                <Modal
                    title='Список коучей'
                    visible={this.state.modalMasterList}
                    onCancel={() => this.setState({modalMasterList : false})}
                    width={720}
                    className="schedule-message-modal-wrapper"
                >
                    <div className="admin-trainer-wrapper">
                        <div className="block-free-trainer">
                            <p className="free-trainer">Свободные тренера</p>
                            {this.props.freetrainers && this.props.freetrainers.map((item, index) => {
                                return (<FreeAdminTrainersItem {...item}
                                                        key={index}
                                                        onGoto= {(id) => this.props.history.push('/app/coach'+id)}
                                />)
                            })}

                        </div>

                        <div className="block-free-trainer">
                            <p className="free-trainer">Занятые тренера</p>
                            {this.props.busytrainers && this.props.busytrainers.map((item, index) => {
                                return (<FreeAdminTrainersItem {...item}
                                                        key={index}
                                                        onGoto={(id) => this.props.history.push('/app/coach'+id)}
                                                        onGotoStudent={(id) => this.props.history.push('/app/student'+id)}
                                                        data={this.state.modalMasterListData}
                                                        isBusy={true}
                                />)
                            })}
                        </div>
                    </div>
                </Modal>


                <CancelVisitModal visible={this.state.cancelModal}
                                  {...this.props.cancelData}
                                  onSave={(obj) => {
                                      this.props.onCloseCancelModal(obj);
                                      this.setState({cancelModal: false, sendingModal: true});
                                  }}
                                  onCancel={() => this.setState({cancelModal: false})}
                />
                <NewVisitModal visible={this.state.newVisitModal}
                               {...this.state.newVisitData}
                               students={this.props.students}
                               onCancel={this.closeNewVisitModal}
                               onSave={this.onSaveNewVisit}
                />
                <NewMessageModal visible={this.state.newMessageModal}
                                 {...this.props.chosenData}
                                 onCancel={this.closeNewMessage}
                                 onSend={ this.onSendNewMessage}
                />
                <ReceptionsScheduleModal visible={this.state.receptionsScheduleModal}
                                         dateSet={{
                                             defaultStartValue: moment(dates[0]),
                                             defaultEndValue: moment(dates[dates.length - 1]),
                                         }}
                                         intervalTime={+intervalTime || timePeriod[0]}
                                         type={type}
                                         selOptions={timePeriod}
                                         timeSetCall={timeSetCall}
                                         timeSetReception={timeSetReception}
                                         onCancel={this.closeReceptionSchedule}
                                         onSave={(info) => this.onSaveReceptionSchedule(info)}
                                         isDayOff={!!(+isDayOff)}
                                         emergencyAvailable={this.props.emergencyAvailable}
                />
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        allAbonements: state.abonement.allAbonements, // и интервалы
        id: state.auth.id,
        trainerList: state.trainer.trainerList,
        trainerTraining: state.trainer.trainerTraining,
        chooseWeekdays: state.student.weekdays,
        chooseDiscipline: state.student.discipline,
        chooseArrMasters: state.student.masters, //id masterov
        fullInfoMasters: state.student.fullInfoMasters,
        studentInfo: state.student.userInfo,
        studentTrainings: state.training.studentTrainings,
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
        profileCoach:state.profileCoach,

        students:  state.students.coachStudents,
        freeIntervals:  state.students.freeIntervals,
        abonementIntervals: state.students.abonementIntervals,
        countTraining: state.students.countTraining,
        isUser:  state.auth.mode === "user",
        isAdmin:  state.auth.mode === "admin",
        superFreeInterval: state.student.freeInterval,
        theMasterInterval: state.student.theMasterInterval,
        mode: state.auth.mode,
        selectMaster: state.student.selectMaster, //из payment выбран
        discAbonement: state.student.discAbonement, // id абонементов у этого студента
        masterListObj: state.trainer.masterListObj,
        subsForDisc : state.abonement.subsForDisc,
        isPushBtnUnfresh: state.abonement.isPushBtnUnfresh,
        useFrozenTraining: state.student.useFrozenTraining,
        discCommunication: state.student.discCommunication,
        checkToken: state.acquiring.checkToken,
        countTrainingDiscipline: state.training.countTrainingDiscipline,
        willTrial: state.training.willTrial,
        finishedTrial: state.training.willTrial,

        masterList: state.admin.masterList.interval,
        freetrainers: state.admin.freetrainers,
        busytrainers: state.admin.busytrainers,
        statusBtnBack: state.student.statusBtnBack,
        sheduleStudent: state.admin.profileStudent
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onCreateAbonement: (data) => dispatch(actions.createAbonement(data)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),
        onTransferTrainining: (value, isCallAdmin) => dispatch(actions.transferTrainining(value, isCallAdmin)),
        onTransferTraininingToEnd: (value, isCallAdmin) => dispatch(actions.transferTraininingToEnd(value, isCallAdmin)),
        onChangeSubscription: (data, isCallAdmin) => dispatch(actions.changeSubscription(data, isCallAdmin)),
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
        onSetWeekInterval: (interval) => dispatch(actions.setWeekInterval(interval)),
        onGetCountTrainingByDiscipline: (id,discipline) => dispatch(actions.getCountTrainingByDiscipline(id,discipline)),
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
        onIsPushBtnUnfresh: () => dispatch(actions.isPushBtnUnfresh()),
        onChangePushBtnUnfresh: (status) => dispatch(actions.isPushBtnUnfresh(status)),
        onGetAllTrainingStudent: (id,dateStart,dateEnd) => dispatch(actions.getAllTrainingStudent(id,dateStart,dateEnd)),

        onSetMasterTheDisicipline: (idMaster) => dispatch(actions.setMasterTheDisicipline(idMaster)),
        onCheckToken: (idUser) => dispatch(actions.checkToken(idUser)),
        onGetFutureTrialTraining: (id, discipline) => dispatch(actions.getFutureTrialTraining(id, discipline)),
        onRemoveTrialTraining: (idTraining, isCallAdmin) => dispatch(actions.removeTrialTraining(idTraining, isCallAdmin)),
        onGetSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),
        onChangeBtnBack: (status) => dispatch(actions.changeBtnBack(status)),
        onGetTrainingsTrialStatus: (idStudent) => dispatch(actions.getTrainingsTrialStatus(idStudent)),

        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data)),
        onGetUserInfo: (id) => dispatch(actions.getUserInfo(id)),
        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
        

        onGetFreeAndBusyMasterList: (start, end) => dispatch(actions.getFreeAndBusyMasterList(start, end)),
        onGetAllInfoMasters: (typeMasters, masterList) => dispatch(actions.getAllInfoMasters(typeMasters,masterList)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline,isCallAdmin)=>dispatch(actions.getAvailableInterval(dateStart,dateEnd,weekdays,discipline,isCallAdmin)),
        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onMasterFreeOnDate: (dateStart, chooseArrMasters) => dispatch(actions.masterFreeOnDate(dateStart, chooseArrMasters)),
        onGetTheMasterInterval: (dateStart, dateEnd, idMaster, weekdays, isCallAdmin) => dispatch(actions.getTheMasterInterval(dateStart, dateEnd, idMaster, weekdays, isCallAdmin)),
        onGetTrainingTrialStatusByDiscipline: (discipline, idStudent) => dispatch(actions.getTrainingTrialStatusByDiscipline(discipline, idStudent)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
