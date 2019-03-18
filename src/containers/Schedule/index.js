/* eslint-disable */
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
import Spinner from './../../components/Spinner/index';

import './styles.css'
import NewModalSaveSchedule from '../../components/NewModalSaveSchedule';

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
                patients: [],
            },
            cancelModal: false,
            newMessageModal: false,
            receptionsScheduleModal: false,
            sendingModal: false,
            receptionData: {
                dates: [],
                currentSched: {},

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

        this.props.onGetAllInfoMasters('free', [...freetrainers])
            .then(this.props.onGetAllInfoMasters('busy', [ ...busytrainers])
                    .then(() => {
                        this.setState({modalMasterList: true})
                    }));

    }

    deleteTraining = (idTraining) => { // нажатие на крестик
        const {id, currDiscipline} = this.props;
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
        this.props.onGetTrainingsTrialStatus(this.props.id)
        this.props.onRemoveTrialTraining(id)
    }

    showModalTransferEvent = (idEvent) => { // нажатие на желтую область -> появление свободных тренеров
        const {profileStudent, isPushBtnAdd, isPushBtnTrialTraining, mainUser, abonementIntervals} = this.props;

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
                        trainer.start = new Date(idEvent); //idEvent ~ time

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
                                .then(() => {
                                    this.setState({isShowFreeTrainers: true})
                                })

        }

        else if(!this.props.isPushBtnTransfer){
            const patients = [ {trainer: null, start: new Date(idEvent), id: idEvent, apiPatients: true}];
            const countTraining = abonementIntervals ? abonementIntervals.countTraining : 0

            this.timeEvent = idEvent;

            this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: countTraining});
            this.props.onMasterFreeOnDate(Math.floor(+idEvent / 1000), this.props.chooseArrMasters)
                .then(() => {
                    this.setState({isShowFreeTrainers: true})
                })

            message.info('Выберите одного из тренеров')
            this.setState({isShowFreeTrainers : true, apiPatients: patients});
        }

        this.state.isShowFreeTrainers && this.setState({isShowFreeTrainers: false})

    }

    setChoosenTrainer = (idMaster) => { // выбор одного из тренеров
        const { profileStudent: fdata, isPushBtnTrialTraining, masterListObj, abonementIntervals} = this.props;
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
            this.setState({isShowFreeTrainers : false});
            return;
        }


        if(!this.state.interval){
            start = moment(Day.now()).startOf('week');
            end = moment(Day.now()).endOf('week')
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

        this.props.onGetTheMasterInterval(dateStart, dateEnd, idMaster, chooseWeekdays)
            .then(() => {
                this.setState({theMasterSelect: true})
            });

        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: abonementIntervals.countTraining});
        this.props.onSetChooseTheMasterByStudent(idMaster);
        this.setState({isShowFreeTrainers : false, newModalSaveSchedule: true});
    }

    fillTrainingWeek = () => { // создание абонемента

        const {
            id,
            abonementIntervals,
            currDiscipline,
            disciplines,
            isPushBtnTrialTraining,
            profileStudent,
            selectMaster,
            subsForDisc,
            chooseTheMaster,
            useFrozenTraining
        } = this.props;



        let buf = 'vocals';

        for(let el in disciplines){

            if(disciplines[el].code === currDiscipline.code){

                buf = el;
            }
        }

        if(isPushBtnTrialTraining){
            this.props.onSetPushTrialTraining('choose_trial');
        }


        if(selectMaster){

            if(subsForDisc && subsForDisc.hasOwnProperty(currDiscipline.code)) {
                this.props.onAddAmountTraining(subsForDisc[currDiscipline.code], abonementIntervals.countTraining)
                    .then(() => {
                            setTimeout(() => {
                                this.props.onGetStudentBalance(id);
                                this.props.onGetUseFrozenTraining(id);
                            }, 1000);
                    })
            }
        }
        else{
            this.props.onCreateAbonement(fillTrainingWeek(id, abonementIntervals.countTraining, buf, [...this.state.apiPatients]))
                .then(() => {

                        if(abonementIntervals.countTraining !== 1) this.props.onEditUseFrozenTraining(id,useFrozenTraining);
                        if(this.props.isPushBtnUnfresh){

                            this.props.onIsPushBtnUnfresh();
                        }

                        this.props.onGetAbonementsFilter(id, currDiscipline); // получить уже распредленное время тренировок в абонементе
                        setTimeout(()=>{
                            this.props.onGetStudentBalance(id);
                            this.props.onGetUseFrozenTraining(id);
                        }, 1000);
                });
        }


        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0}); // убрать Сохранить
        this.props.onChangeBtnBack(false);
        this.props.onGetDisciplineCommunication(id);


        this.props.onGetTrainingsTrialStatus(id); // ?
        this.props.onGetTrainingTrialStatusByDiscipline(currDiscipline.code, id);

        this.setState({theTrialMasterSelect: false,newModalSaveSchedule: false, apiPatients: [], sendingModal: true, theMasterSelect: false})
        message.success("Тренировки распределены по расписанию");
    }

    transferTraining = (transferDay) => {

        if(transferDay){
            this.transferDay = {dateStart : Math.floor(+transferDay.getTime() / 1000)}
        }

    }
    deleteEvent = (delEvent) => {

        if(delEvent && Object.keys(delEvent).length){

            this.delEvent = delEvent;
            this.setState({modalTransferTraining: true})
        }
    }


    setTransfer_1_Training = () => {

            const {id, currDiscipline, discCommunication} = this.props;
            const {id: idTraining, idMaster} = this.delEvent.event;

            const currMaster = discCommunication.hasOwnProperty(currDiscipline.code) ? discCommunication[currDiscipline.code] : null

            if(this.transferDay && currMaster){
                    this.props.onTransferTrainining({idTraining, idMaster: currMaster.idMaster, ...this.transferDay})
                        .then(() => {
                            this.setState({scheduleSpinner: true});
                            this.props.onGetAbonementsFilter(id,currDiscipline)
                                .then(() => {
                                    this.setState({scheduleSpinner: false});
                                })
                        });
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
        const {id, currDiscipline} = this.props;

        if(this.cancelId){
                this.props.onTransferTraininingToEnd({idTraining : this.cancelId})
                    .then(() => {
                        this.props.onGetAbonementsFilter(id, currDiscipline);
                    });
        }
        this.setState({modalCancelTraining: false});
    }

    freezeAbonement = () => {

        const {id, currDiscipline, useFrozenTraining} = this.props;

        if(this.freezeIdSubscription) {
            this.props.onFreezeAbonement(this.freezeIdSubscription)
                .then(() => {
                    this.props.onGetAbonementsFilter(id, currDiscipline);
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
        const {idSubscription, start} = this.delEvent.event;
        const {id, currDiscipline} = this.props;
        let scheduleForWeek = {}; // это POST
        let trainingtime = {}; // это POST

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
        this.props.onChangeSubscription(scheduleForWeek)
            .then(() => this.props.onGetAbonementsFilter(id, currDiscipline));

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

        const {id, currDiscipline} = this.props;

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

        this.props.onGetAvailableInterval(time0 ,time1, weekdays, [codeDisc]);
        this.props.onSetFreeIntervals(array, data.type);
        this.props.onGetAbonementsFilter(id, currDiscipline);
    };

    componentDidMount() {
        const {id, currDiscipline} = this.props;
        const start =  moment(Date.now()).startOf('week').format('X');
        const end = moment(Date.now()).endOf('week').format('X');

        this.props.onSetWeekInterval({start, end});

        this.setIntervalAndView(this.state.currentDate, 'week');

        this.props.onGetAbonementsFilter(id, currDiscipline);

        if(this.props.mode === 'student'){
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
                        this.props.onIsPushBtnUnfresh()
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
        }

    }

    componentDidUpdate() {
        const{id, currDiscipline} = this.props;

        //this.props.onGetFutureTrialTraining(id, currDiscipline)
        this.props.onGetCountTrainingByDiscipline(id, currDiscipline.code);
        // if(this.props.mode === 'student'){
        //     this.props.onIssetTrial(id);
        // }
    }

    componentWillUnmount() {
        if(!this.state.isShowFreeTrainers){
            this.props.onSetPushTrialTraining(null)
            this.props.onUnsetPushBtnTransferTraining();
            this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0});
        }

    }

    getCountOfReceptionsAtCurMonth = () => {
        let date = this.state.currentDate;
        let visits = this.props.allUserVisits;
        let count = 0;

        if (date && visits)
            visits.forEach((item) => {moment(+item.start * 1000)._d.getMonth() === date.getMonth() ? ++count : null});

        return count;
    };

    getCountOfScheduledIntervals = () => {
        let count = 0;
        if (this.props.schedules)
            this.props.schedules.forEach((item) => {item.isDayOff === "0" ? ++count : null});

        return count;
    };

    dateChangeHandler = (date, view, action, isOnDay) => {
        const {chooseWeekdays, id, mode, currDiscipline, chooseTheMaster, isPushBtnTrialTraining,discCommunication,isPushBtnUnfresh} = this.props;

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
        this.props.onSetWeekInterval({start: dateStart, end: dateEnd});

        if(mode === 'admin'){
            this.props.onGetFreeAndBusyMasterList(dateStart, dateEnd)
                .then(() => setTimeout(() => this.setState({scheduleSpinner: false}), 1000))
        }
        if(mode === 'master'){
            this.props.onGetTrainerTraining(id, dateStart, dateEnd, currDiscipline)
        }
        if(mode === 'master' || mode === 'student'){

            this.props.onGetAbonementsFilter(id, currDiscipline)
                .then(() => setTimeout(() => this.setState({scheduleSpinner: false}), 1000))
        }


        if(this.state.theMasterSelect){
            this.props.onGetTheMasterInterval(dateStart, dateEnd, chooseTheMaster, chooseWeekdays)
                .then(() => {
                    setTimeout(() => this.setState({scheduleSpinner: false}), 1000)
                });
        }
        else if(isPushBtnTrialTraining === 'trial' || isPushBtnUnfresh){
            this.props.onGetAvailableInterval(dateStart, dateEnd, chooseWeekdays, currDiscipline.code)
                .then(() => {
                    setTimeout(() => this.setState({scheduleSpinner: false}), 1000)
                });
        }

        if(this.props.isPushBtnTransfer){


            if(discCommunication.hasOwnProperty(currDiscipline.code)){
                this.props.onGetTheMasterInterval(dateStart, dateEnd, discCommunication[currDiscipline.code].idMaster, [0,1,2,3,4,5,6])
                .then(() => {
                    this.setState({theMasterSelect: true, scheduleSpinner: false})
                });
            }
        }


    };

    changeCurrDiscipline = (disc) => {
        const {start, end} = this.state.isEditorMode;
        const {currDiscipline, id, mode} = this.props;

        if(mode === 'student'){
           // this.props.onGetAbonementsFilter(id, currDiscipline);
        }
        else if(mode === 'master'){
            this.props.onGetTrainerTraining(id, start, end, disc);
        }

        this.props.onChangeCurrDiscipline(disc)

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
            id,
            currDiscipline,
            isPushBtnTransfer,
            isPushBtnAdd,
            isPushBtnTrialTraining} = this.props;

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

        if (this.props.isAdmin) {
            const currDate = this.state.currentDate,
            currY = currDate.getFullYear(),
            currM = currDate.getMonth(),
            currD = currDate.getDate();

            let min = new Date(new Date(1540875600 /*this.props.min*/ * 1000).setFullYear(currY, currM, currD)),
                max = new Date(new Date(1540929600 /*this.props.max*/ * 1000).setFullYear(currY, currM, currD));



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

            let min = new Date(new Date(1540875600 /*this.props.min*/ * 1000).setFullYear(currY, currM, currD)),
                max = new Date(new Date(1540929600 /*this.props.max*/ * 1000).setFullYear(currY, currM, currD));

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


            // let min = new Date(new Date(1540875600 /*this.props.min*/ * 1000).setFullYear(currY, currM, currD)),
            //     max = new Date(new Date(1540929600 /*this.props.max*/ * 1000).setFullYear(currY, currM, currD));


                let min = new Date( currY, currM, currD, 8);
                let max = new Date( currY, currM, currD, 23);

                console.log('min :',min);
            // надо нормальную проверка для коуча и студента

            editorBtn = (<Button btnText='Редактор графика'
                                 onClick={() => this.changeToEditorMode(true)}
                                 type='yellow'
                                 icon='setting_edit'/>)

                            let filterInterval = [];
                            let notRedirectDiscipline = false;

                            if(0 !== this.countTraining === this.state.apiPatients.length){
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
                                  onGotoPage= { (id) => this.props.history.push('/app/coach' + id)}
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
                                    this.props.onGetAbonementsFilter(id, disc);
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

            />)
        }

        return (
            <Hoc>
                <Card title='Расписание тренировок'>
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
                                <div className="schedule-message-btn">
                                    <Button btnText='Перенести 1 треню'
                                        onClick= {this.setTransfer_1_Training}
                                        type='yellow'/>
                                </div>

                                { ( this.delEvent && this.delEvent.event.trial) ?
                                    null :
                                        <div className="schedule-message-btn">
                                            <Button btnText='Новое расписание'
                                            onClick= {this.setAbonement_Training}
                                            type='yellow'/>
                                </div> }
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
                                            this.props.onRemoveTrialTraining(this.deleteIdTraining)
                                                .then(() => this.props.onGetAbonementsFilter(id, currDiscipline))

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
                                                        onGoto= {(id) => this.props.history.push('/app/coach'+id)}

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
                               patients={this.props.patients}
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
        amountTraining: state.patients.amountTraining, // поменять на student
        eventTraining: state.trainer.eventTraining,
        isPushBtnTransfer: state.student.isPushBtnTransfer,
        isPushBtnAdd: state.student.isPushBtnAdd,
        isPushBtnTrialTraining: state.student.isPushBtnTrialTraining,
        profileStudent: state.profilePatient,
        selectDisciplines: state.abonement.disciplines,
        currDiscipline: state.abonement.currDiscipline,
        disciplines: state.abonement.disciplines,
        chooseTheMaster: state.abonement.chooseTheMaster,
        mainUser: (state.profilePatient) ? (state.profilePatient.mainUser ? state.profilePatient.mainUser : null) : null,

        patients:  state.patients.docPatients,
        freeIntervals:  state.patients.freeIntervals,
        abonementIntervals: state.patients.abonementIntervals,
        countTraining: state.patients.countTraining,
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

        intervals: state.schedules.visIntervals,
        min: state.schedules.min,   // !   1540929600
        max:  state.schedules.max,   // !  1540875600
        chosenData: state.schedules.chosenData,
        cancelData: state.schedules.cancelData,
        allUserVisits:  state.schedules.allUserVisits,
        emergencyAvailable:  state.doctor.emergencyAvailable
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetDocPatients: () => dispatch(actions.getDocPatients()),

        onGetAllIntervals: (start, end) => dispatch(actions.getAllIntervals(start, end)),
        clearReceptions: () => dispatch(actions.clearIntervals()),
        onAddInterval: (obj, start, end) => dispatch(actions.addInterval(obj, start, end)),

        onSendMessage: (mess) => dispatch(actions.sendMessage(mess)),
        onCloseCancelModal: (obj) => dispatch(actions.cancelEventsRange(obj)),
        onClearVisits: () => dispatch(actions.clearVisits()),

        onSelectPatient: (id) => dispatch(actions.selectPatient(id)),
        onSelectEvent: (event) => dispatch(actions.selectEvent(event)),
        onEventDelete: () => dispatch(actions.deleteEvent()),

        onCreateAbonement: (data) => dispatch(actions.createAbonement(data)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),

        onTransferTrainining: (value) => dispatch(actions.transferTrainining(value)),
        onTransferTraininingToEnd: (value) => dispatch(actions.transferTraininingToEnd(value)),
        onChangeSubscription: (data) => dispatch(actions.changeSubscription(data)),
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
        onGetAbonementsFilter: (idStudent, currDiscipline) => dispatch(actions.getAbonementsFilter(idStudent, currDiscipline)),

        onAddAmountTraining: (idSubscription, addAmount) => dispatch(actions.addAmountTraining(idSubscription, addAmount)),
        onGetStudentBalance: (idStudent) => dispatch(actions.getStudentBalance(idStudent)),
        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
        onEditUseFrozenTraining: (idStudent,amountTraining) => dispatch(actions.editUseFrozenTraining(idStudent,amountTraining)),
        onGetUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),
        onIsPushBtnUnfresh: () => dispatch(actions.isPushBtnUnfresh()),
        onSetMasterTheDisicipline: (idMaster) => dispatch(actions.setMasterTheDisicipline(idMaster)),
        onCheckToken: (idUser) => dispatch(actions.checkToken(idUser)),
        onGetFutureTrialTraining: (id, discipline) => dispatch(actions.getFutureTrialTraining(id, discipline)),
        onRemoveTrialTraining: (idTraining) => dispatch(actions.removeTrialTraining(idTraining)),
        onGetSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),
        onChangeBtnBack: (status) => dispatch(actions.changeBtnBack(status)),
        onGetTrainingsTrialStatus: (idStudent) => dispatch(actions.getTrainingsTrialStatus(idStudent)),

        onGetInfoPatient: (id) => dispatch(actions.getInfoPatient(id)),
        onSaveUserEdit: (data) => dispatch(actions.saveUserEdit(data)),

        onGetFreeAndBusyMasterList: (start, end) => dispatch(actions.getFreeAndBusyMasterList(start, end)),
        onGetAllInfoMasters: (typeMasters, masterList) => dispatch(actions.getAllInfoMasters(typeMasters,masterList)),
        onGetAvailableInterval: (dateStart, dateEnd, weekdays, discipline) => dispatch(actions.getAvailableInterval(dateStart, dateEnd, weekdays, discipline)),
        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onMasterFreeOnDate: (dateStart, chooseArrMasters) => dispatch(actions.masterFreeOnDate(dateStart, chooseArrMasters)),
        onGetTheMasterInterval: (dateStart, dateEnd, idMaster, weekdays) => dispatch(actions.getTheMasterInterval(dateStart, dateEnd, idMaster, weekdays)),
        onGetTrainingTrialStatusByDiscipline: (discipline, idStudent) => dispatch(actions.getTrainingTrialStatusByDiscipline(discipline, idStudent)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
