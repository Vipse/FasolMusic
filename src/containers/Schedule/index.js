/* eslint-disable */
import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux';
import Hoc from '../../hoc'
import Row from "../../components/Row";
import Col from "../../components/Col";
import Button from "../../components/Button";
import Calendar from "../../components/Calendar22";
import CancelVisitModal from "../../components/CancelVisitModal";
import NewVisitModal from "../../components/NewVisitModal";
import NewMessageModal from "../../components/NewMessageModal";
import {message} from 'antd';
import MyCoach from '../../components/MyCoach';
import ReceptionsScheduleModal from "../../components/ReceptionsScheduleModal";
import Modal from './../../components/Modal/index';
import * as actions from '../../store/actions'
import './styles.css'
import {findTimeInterval} from '../../helpers/timeInterval'
import {timePeriod} from './mock-data'

import {  apiTrainers, fasolIntervals} from './mock-data';
import { fillTrainingWeek } from './shedule';
import FreeTrainers from '../../components/FreeTrainers';
import FreeTrainersItem from '../../components/FreeTrainersItem';
import { PerfectScrollbar } from 'react-perfect-scrollbar';
import Card from './../../components/Card/index';
import Spinner from './../../components/Spinner/index';


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
            showSpinner: false,
            theMasterSelect: false,
        }
    };

    selectAnyTrainer = () => {
        let {fullInfoMasters} = this.props;
        const min = 0;
        const max = fullInfoMasters.length - 1;
        let rand = min + Math.random() * (max + 1 - min);

        rand = Math.floor(rand);
        this.setChoosenTrainer(fullInfoMasters[rand].id)    
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

    showTransferEvent = (id) => { // нажатие на крестик
        this.deleteId = id;
    }

    showModalTransferEvent = (idEvent) => { // нажатие на желтую область -> появление свободных тренеров
        const {profileStudent, isPushBtnAdd, isPushBtnTrialTraining, mainUser, abonementIntervals} = this.props;
        
        let master = this.props.chooseTheMaster;
        let fdata = profileStudent;

        console.log(this.props.chooseTheMaster)
       
        if(this.state.theMasterSelect){
            let {trainerList} = this.props;
            for(let i = 0; i < trainerList.length; i++){
                debugger;
                if(trainerList[i].idMaster === this.props.chooseTheMaster){
                    let trainer= {...trainerList[i]};
                    trainer.start = new Date(idEvent); //idEvent ~ time
    
                    this.setState({apiPatients : [...this.state.apiPatients, trainer]})
                // apiPatients.push(trainer);
                    return;
                }
            }
        }
        if(isPushBtnTrialTraining === 'trial'){             
                            //fdata.frozenTraining = +fdata.frozenTraining - 1;
                            this.trialTime = idEvent;
                            this.setState({isShowFreeTrainers : true});
                            message.info('Выберите одного из тренеров')

                            this.setState({apiPatients : [ {trainer: null, start: new Date(idEvent)}]})
                            // let {trainerList} = this.props;
                            // for(let i = 0; i < trainerList.length; i++){
                                
                            //     if(trainerList[i].idMaster === master){
                            //         let trainer= {...trainerList[i]};
                            //         trainer.start = new Date(idEvent); //idEvent ~ time
                    
                            //         this.setState({apiPatients : [...this.state.apiPatients, trainer]})
                            //     // apiPatients.push(trainer);
                            //         i = Infinity;
                            //     }
                            // }
                            // debugger
                            this.props.onMasterFreeOnDate(Math.floor(+idEvent / 1000), this.props.chooseArrMasters);
                            message.success('Тренировка выбрана')
                           // message.info('Для подтверждения расписания нажмите "Сохранить"')

                          //  this.props.onSetPushTrialTraining('choose_trial');

                           // this.props.onSaveUserEdit(fdata);
                            this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: 1}); // show Сохранитьreturn;     
                  
                    //return;
        }

        else if(!this.props.isPushBtnTransfer){
           
            if(isPushBtnAdd) {
                
                

                        let {trainerList} = this.props;
                        for(let i = 0; i < trainerList.length; i++){
                            
                            if(trainerList[i].idMaster === mainUser){
                                let trainer= {...trainerList[i]};
                                trainer.start = new Date(idEvent); //idEvent ~ time
                
                                this.setState({apiPatients : [...this.state.apiPatients, trainer]})
                            // apiPatients.push(trainer);
                                i = Infinity;
                            }
                        }
                       

                        const countTraining = abonementIntervals ? abonementIntervals.countTraining : 0
                        this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: countTraining + 1}); // show Сохранитьreturn;  
                        message.success('Тренировка выбрана')
                        message.info('Для подтверждения расписания нажмите "Сохранить"')

                        fdata.frozenTraining = fdata.frozenTraining - 1;
                        this.props.onSaveUserEdit(fdata);

                 
                       
                        //this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: 1}); // show Сохранить
                    
               // this.props.onCreateAbonement(fillTrainingWeek(id, abonementIntervals.countTraining, buf, [...this.state.apiPatients]))
                
            }
            
            else{

                this.timeEvent = idEvent;
                this.props.onMasterFreeOnDate(Math.floor(+idEvent / 1000), this.props.chooseArrMasters);
                this.setState({isShowFreeTrainers : true});
                message.info('Выберите одного из тренеров')
            }  
        }
           
       
    }

    setChoosenTrainer = (idMaster) => { // выбор одного из тренеров
        const { profileStudent: fdata, isPushBtnTrialTraining} = this.props;
        let start = null,
            end = null;
       
        if(isPushBtnTrialTraining === 'trial'){
            debugger;
            let {trainerList} = this.props;
            for(let i = 0; i < trainerList.length; i++){
                    if(trainerList[i].idMaster === idMaster){
                        let trainer= {...trainerList[i]};
                        trainer.start = new Date(this.trialTime); //idEvent ~ time


                        this.setState({apiPatients : [ trainer]})
                         // apiPatients.push(trainer);
                        i = Infinity;
                    }
            }
           

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

        this.props.onGetTheMasterInterval(dateStart, dateEnd, idMaster, chooseWeekdays)
            .then(() => {
                this.setState({theMasterSelect: true})
            });
       
        this.props.onSetChooseTheMasterByStudent(idMaster);
        if(this.props.isPushBtnTrialTraining === 'trial') this.props.onSetPushTrialTraining('first_trainer');
        this.setState({isShowFreeTrainers : false});  

        message.success('Тренер выбран');
        message.info('Выберите дату тренировки выбранного тренера');
        // this.setState({isShowFreeTrainers : false});
    }

    fillTrainingWeek = () => { // создание абонемента
        
        const {id, abonementIntervals, currDiscipline, disciplines, isPushBtnTrialTraining} = this.props;
        message.success("Тренировки распределены по расписанию");
        
        this.setState({ sendingModal: true, theMasterSelect: false}); // убрать интервалы


        let buf = 'vocals';

        for(let el in disciplines){
        
            if(disciplines[el].code === currDiscipline.code){
                buf = el;
            }
        }

        if(isPushBtnTrialTraining){
            this.props.onSetPushTrialTraining('choose_trial');
        }

        const newFrozen = +this.props.profileStudent.frozenTraining - (+abonementIntervals.countTraining);
        let profile = {...this.props.profileStudent};
        profile.frozenTraining = newFrozen;
        this.props.onSaveUserEdit(profile);

console.log('this.state.apiPatients :', this.state.apiPatients);
        debugger;
        this.props.onCreateAbonement(fillTrainingWeek(id, abonementIntervals.countTraining, buf, [...this.state.apiPatients]))
        .then(() => {
            this.props.onGetAbonementsFilter(id, currDiscipline); // получить уже распредленное время тренировок в абонементе
        });
        this.props.onSetNeedSaveIntervals({visibleTrialModal: false, countTraining: 0}); // убрать Сохранить
        this.setState({apiPatients: []})
        console.log(currDiscipline.code);
        this.props.onGetTrainingTrialStatusByDiscipline(currDiscipline.code, this.props.id)
    }

    transferTraining = (transferDay) => {
        // value - дата куда переносим (TimeSlotGroup)
        // не передаем для коуча и он не может менять расписание
        if(transferDay){
            this.transferDay = {dateStart : Math.floor(+transferDay.getTime() / 1000)}
        }
       
    }
    deleteEvent = (delEvent) => {

        if(delEvent && Object.keys(delEvent).length){
            this.delEvent = delEvent;
            this.setState({modalTransferTraining: true});
        }   
    }


    setTransfer_1_Training = () => {
            const {id, currDiscipline} = this.props;
            const {id: idTraining, idMaster} = this.delEvent.event;

            
            if(this.delEvent){
                    this.props.onTransferTrainining({idTraining, idMaster, ...this.transferDay})
                        .then(() => {
                            this.props.onGetAbonementsFilter(id,currDiscipline);
                        });
            } 

            this.props.onNoSetBtnTraining();
            this.setState({modalTransferTraining: false});   
    }

    onCancelTraining = (transferId, idSubscription) => {
        this.cancelId = transferId; // для переноса в конец
        this.freezeIdSubscription = idSubscription; // для заморозки

        this.setState({modalCancelTraining: true});   
        
    }

    setTransfer_End_Training = () => {
        //this.cancelId 

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
        //this.freezeIdSubscription 

        const {id, currDiscipline} = this.props;
        if(this.freezeIdSubscription) {
            this.props.onFreezeAbonement(this.freezeIdSubscription)
                .then(() => {
                    this.props.onGetAbonementsFilter(id, currDiscipline); 
                })
        }
       
        this.setState({modalCancelTraining: false});   
    }

    setAbonement_Training = () => {
        
        console.log('this.props :', this.props);
        let subs = this.props.allAbonements;
        const {idSubscription, start} = this.delEvent.event;
        const {id, currDiscipline} = this.props;
        let scheduleForWeek = {}; // это POST
        let trainingtime = {}; // это POST
        
        const max = subs.length;
        const curWeek = moment( start.getTime() ).week(); // текущая неделя
        

        for(let i = 0; i < max; i++){
          
            if(subs[i].idSubscription === idSubscription) {
                scheduleForWeek.dateStart = subs[i].dateStart;
                scheduleForWeek.idSubscription = subs[i].idSubscription;
                scheduleForWeek.idStudent = id;//subs[i].idStudent;
                scheduleForWeek.discipline = subs[i].discipline;

                subs[i].training.forEach((item) => {
                        const start = moment(+item.start * 1000);
                        const weekElem = start.week(); // номер недели
                       

                        if (curWeek === weekElem) {

                           if( item.id === this.delEvent.event.id){
                                    const weekDay =  new Date(this.transferDay.dateStart * 1000).getDay(); // номер дня в неделе ( переносимое занятие)

                                    if(!trainingtime.hasOwnProperty(weekDay)){
                                        trainingtime[weekDay] = [];
                                    }
                                    trainingtime[weekDay].push({id: item.id, start: this.transferDay.dateStart })   
                           }
                           else{
                                    const weekDay =  new Date(item.start * 1000).getDay();
                                    if(!trainingtime.hasOwnProperty(weekDay)){
                                        trainingtime[weekDay] = [];
                                    }
                                    trainingtime[weekDay].push({id: item.id, start: item.start })
                           }        
                        }                    
                })
                scheduleForWeek.trainingtime = trainingtime;
                break;                
            }           
        }

        this.setState({modalTransferTraining: false});   

        console.log('scheduleForWeek :', scheduleForWeek);
        this.props.onChangeSubscription(scheduleForWeek, this.props.amountTraining)
            .then(() => this.props.onGetAbonementsFilter(id, currDiscipline));
    }


    setIntervalAndView = (date, view) => {
        const {start, end} = findTimeInterval(date, view);
        this.state.isEditorMode ? this.props.onGetAllIntervals(start, end) : this.props.onGetAllVisits(start, end);

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

        for(let i = 0; i < 7; i++){
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
        this.props.onGetAllUserVisits();

        console.log('currDiscipline', currDiscipline)
        this.props.onGetAbonementsFilter(id, currDiscipline);
        //this.props.onGetAbonementsFilter(id, currDiscipline);

        

        if(this.props.isAdmin) {
            this.props.onGetFreeAndBusyMasterList(start, end);
        }
        if(this.props.mode === 'master'){
            this.props.onGetTrainerTraining(id, start, end, currDiscipline);
        }       
    }

    componentWillUnmount() {
        this.props.clearReceptions();
        this.props.onClearVisits();
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
        const {chooseWeekdays, chooseDiscipline, id, mode, currDiscipline} = this.props;
       

        const {start, end} = this.state.isEditorMode
            ? findTimeInterval(date, 'month')
            : isOnDay ?
                findTimeInterval(date, 'day') : findTimeInterval(date, this.state.view);
        this.state.isEditorMode ? isOnDay ? null : this.props.onGetAllIntervals(start, end) : this.props.onGetAllVisits(start, end);

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

            this.props.onSetWeekInterval({start: Math.floor(+start.getTime() / 100), end:Math.floor(+ end.getTime() / 1000)});

        if(!this.state.sendingModal){
            this.setState({showSpinner: true});
            const dateStart = Math.floor(+start.getTime() / 1000);
            const dateEnd = Math.floor(+end.getTime() / 1000);
            this.props.onGetAvailableInterval(dateStart,dateEnd, chooseWeekdays, chooseDiscipline)   
                .then(() => this.setState({showSpinner: false, sendingModal: true}))
        }
        if(mode === 'master'){
            const dateStart = Math.floor(+start.getTime() / 1000);
            const dateEnd = Math.floor(+end.getTime() / 1000);
            this.props.onGetTrainerTraining(id, dateStart, dateEnd, currDiscipline);
        }
        if(mode === 'master' || mode === 'student'){
            this.props.onGetAbonementsFilter(id, currDiscipline)
        }
        if(this.props.isPushBtnTransfer){

            let idMaster = this.props.profileStudent.mainUser;
            let dateStart1 = Math.floor(+start.getTime() / 1000);
            let dateEnd1 = Math.floor(+end.getTime() / 1000);

            let chooseWeekdays = [1,2,3,4,5,6,7];

            this.props.onGetTheMasterInterval(dateStart1, dateEnd1, idMaster, chooseWeekdays)
                .then(() => {
                    this.setState({theMasterSelect: true})
                });
        }

        
    };

    onAddVisit = (info) => {
        this.props.patients.length === 0 ?
            this.props.onGetDocPatients() : null;

        this.setState({
            newVisitModal: true,
            newVisitData: {
                ...this.state.newVisitData,
                date: info.start,
            }
        })
    };

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
        isEditorMode ? this.props.onGetAllIntervals(start, end) : this.props.onGetAllVisits(start, end);

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
        const {abonementIntervals, trainerList, masterList, allAbonements, id, currDiscipline, isPushBtnTransfer, isPushBtnAdd,isPushBtnTrialTraining} = this.props;
       
        let isNeedSaveIntervals = false
        if(abonementIntervals){
            isNeedSaveIntervals = abonementIntervals.visibleTrialModal;
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

            let minFasol = this.props.min;
            let maxFasol = this.props.max;

            let min = new Date(new Date(1540875600 /*this.props.min*/ * 1000).setFullYear(currY, currM, currD)),
                max = new Date(new Date(1540929600 /*this.props.max*/ * 1000).setFullYear(currY, currM, currD));

            calendar = (<Calendar 
                    /*receptionNum={(arrAbonement && arrAbonement.length) ? arrAbonement.length : apiPatients.length} */
                    selectable
                    onSelectEvent={this.props.onSelectEvent}
                    onSelectSlot={(slot) => this.onAddVisit(slot)}
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
                    minFasol={minFasol}
                    maxFasol={maxFasol}

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

                    />)    
        }
        else if (this.props.mode === 'master') {
            const currDate = this.state.currentDate,
                currY = currDate.getFullYear(),
                currM = currDate.getMonth(),
                currD = currDate.getDate();
            let minFasol = this.props.min;
            let maxFasol = this.props.max;

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
                                  minFasol={minFasol}
                                  maxFasol={maxFasol}
                                  mode = {this.props.mode}
                                  selectDisciplines = {this.props.selectDisciplines}
                                  currDiscipline = {this.props.currDiscipline}
                                  onChangeCurrDiscipline = {(disc) => {
                                        this.props.onChangeCurrDiscipline(disc)
                                        this.props.onGetAbonementsFilter(id, currDiscipline); 
                                }}
                                
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

                let minFasol = this.props.min;
                let maxFasol = this.props.max;

            let min = new Date(new Date(1540875600 /*this.props.min*/ * 1000).setFullYear(currY, currM, currD)),
                max = new Date(new Date(1540929600 /*this.props.max*/ * 1000).setFullYear(currY, currM, currD));
  
            // надо нормальную проверка для коуча и студента

            editorBtn = (<Button btnText='Редактор графика'
                                 onClick={() => this.changeToEditorMode(true)}
                                 type='yellow'
                                 icon='setting_edit'/>)

                            let filterInterval = [];
                            if(this.props.profileStudent.frozenTraining <= 0){
                                filterInterval = [];
                             }
                             else if(isPushBtnTrialTraining === 'trial'){
                                filterInterval = this.props.superFreeInterval;
                             }
                             
                             else if(this.state.theMasterSelect || isPushBtnTransfer || isPushBtnAdd || isPushBtnTrialTraining === 'first_trainer'){
                                filterInterval = this.props.theMasterInterval ;

                             }
                             else if(isNeedSaveIntervals){
                                filterInterval =  this.props.superFreeInterval
                             }

                         
            calendar = (<Calendar 
                                  receptionNum={(Array.isArray(allAbonements) && allAbonements.length) ? allAbonements.length : this.state.apiPatients.length}//{this.props.visits.length}// {apiPatients.length} 
                                  selectable
                                  onSelectEvent={this.props.onSelectEvent}
                                  onSelectSlot={(slot) => this.onAddVisit(slot)}
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

                                  events={(Array.isArray(allAbonements) && allAbonements.length) ? [...allAbonements, ...this.state.apiPatients] : this.state.apiPatients}

                                  intervals={filterInterval}

                                  superFreeInterval = {filterInterval}


                                  selectDisciplines = {this.props.selectDisciplines}
                                  currDiscipline = {this.props.currDiscipline}
                                  onChangeCurrDiscipline = {(disc) => {
                                    this.props.onChangeCurrDiscipline(disc)
                                    this.props.onGetAbonementsFilter(id, disc); 
                                    }}

                                  min= {min}
                                  max= {max}
                                  minFasol={minFasol}
                                  maxFasol={maxFasol}

                                  onPopoverClose={this.eventDeleteHandler}
                                  onPopoverEmail={this.onPatientEmail}

                                  onChange={this.dateChangeHandler}
                                  highlightedDates = {this.prepareDatesForSmallCalendar(this.props.allUserVisits)}

                                  showTransferEvent={this.showTransferEvent} // my
                                  freeTrainers={this.props.fullInfoMasters} //my
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

            />)
        }

        return (
            <Hoc>
                <Card title='Расписание тренировок'>
                        {this.state.showSpinner ? <Spinner /> : null}
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
                    title='Список коучей'
                    visible={this.state.modalMasterList}
                    onCancel={() => this.setState({modalMasterList : false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                >
                <div className="block-free-trainer">
                    <p className="free-trainer">Свободные тренера</p>
                    {this.props.freetrainers && this.props.freetrainers.map((item, index) => {
                        return (<FreeTrainersItem {...item}
                                                key={index}
                                                onGoto= {(id) => this.props.history.push('/app/coach'+id)}
                                                
                        />)
                    })}
                    <p className="free-trainer">Занятые тренера</p>
                    {this.props.busytrainers && this.props.busytrainers.map((item, index) => {
                        return (<FreeTrainersItem {...item}
                                                key={index}
                                                onGoto= {(id) => this.props.history.push('/app/coach'+id)}
                                                
                        />)
                    })}
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

        masterList: state.admin.masterList.interval,
        freetrainers: state.admin.freetrainers,
        busytrainers: state.admin.busytrainers,

        visits:  state.schedules.visits,
        intervals: state.schedules.visIntervals,
        min: state.schedules.min,   // !   1540929600
        max:  state.schedules.max,   // !  1540875600
        schedules:  state.schedules.schedules,  // 1
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

        onAddNewVisit: (obj, start, end) => dispatch(actions.addVisit(obj, start, end)),
        onGetAllVisits: (start, end) => dispatch(actions.getAllVisits(start, end)),
        onGetAllUserVisits: () => dispatch(actions.getAllPatientVisits()),
        onSendMessage: (mess) => dispatch(actions.sendMessage(mess)),
        onCloseCancelModal: (obj) => dispatch(actions.cancelEventsRange(obj)),
        onClearVisits: () => dispatch(actions.clearVisits()),

        onSelectPatient: (id) => dispatch(actions.selectPatient(id)),
        onSelectEvent: (event) => dispatch(actions.selectEvent(event)),
        onEventDelete: () => dispatch(actions.deleteEvent()),

        onCreateAbonement: (data) => dispatch(actions.createAbonement(data)),
        onSetNeedSaveIntervals: (count) => dispatch(actions.setNeedSaveIntervals(count)),
        
        onTransferTrainining: (value) => dispatch(actions.transferTrainining(value)),
        onTransferTraininingToEnd: (value) => dispatch(actions.transferTraininingToEnd(value)),
        onChangeSubscription: (data, amountTraining) => dispatch(actions.changeSubscription(data, amountTraining)),
        onChangeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
        onSetWeekInterval: (interval) => dispatch(actions.setWeekInterval(interval)),

        onGetTrainerTraining: (id, dateMin, dateMax, currDiscipline) => dispatch(actions.getTrainerTraining(id, dateMin, dateMax, currDiscipline)),
        onFreezeAbonement: (idSubscription) => dispatch(actions.freezeAbonement(idSubscription)),
        onGetInfoMasters: (idMaster) => dispatch(actions.getInfoMasters(idMaster)),
        onSetChooseMasterAllInfo: (allInfo) => dispatch(actions.setChooseMasterAllInfo(allInfo)),
        onSetPushTrialTraining: (type) => dispatch(actions.setPushTrialTraining(type)),
        onSetChooseTheMasterByStudent: (master) => dispatch(actions.setChooseTheMasterByStudent(master)),
        onNoSetBtnTraining: () => dispatch(actions.noSetBtnTraining()),
        onGetAbonementsFilter: (idStudent, currDiscipline) => dispatch(actions.getAbonementsFilter(idStudent, currDiscipline)),
        

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
