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
import ReceptionsScheduleModal from "../../components/ReceptionsScheduleModal";
import Modal from './../../components/Modal/index';
import * as actions from '../../store/actions'
import './styles.css'
import {findTimeInterval} from '../../helpers/timeInterval'
import {timePeriod} from './mock-data'

import { apiPatients, apiTrainers, fasolIntervals} from './mock-data';
import { fillTrainingWeek } from './shedule';


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

            isShowFreeTrainers: false, 
            amountTraining: true,
            modalTransferTraining: false,
        }
    };


    showTransferEvent = (id) => { // нажатие на крестик
        this.deleteId = id;
    }

    showModalTransferEvent = (idEvent) => { // нажатие на желтую область -> появление свободных тренеров
        this.timeEvent = idEvent;
        this.setState({isShowFreeTrainers : true});
    }

    setChoosenTrainer = (idMaster) => { // выбор одного из тренеров

        for(let i = 0; i < apiTrainers.length; i++){
   
            if(apiTrainers[i].idMaster === idMaster){
                let trainer= {...apiTrainers[i]};
                trainer.start = new Date(this.timeEvent);
 
                apiPatients.push(trainer);
                i = Infinity;
            }
        }

        if( apiPatients.length === this.props.abonementIntervals.countTraining){
            this.setState({amountTraining : false});
        }

        this.timeEvent = null;
        this.setState({isShowFreeTrainers : false});
    }

    fillTrainingWeek = () => { // создание абонемента
       
        this.setState({amountTraining : false, sendingModal: true}); // убрать интервалы

        this.props.onCreateAbonement(fillTrainingWeek(this.props.abonementIntervals.countTraining))
        .then(() => {
            this.props.onGetAbonements(); // получить уже распредленное время тренировок в абонементе
        });

        this.props.onSetNeedSaveIntervals({visibleTrialModal: false, countTraining: 0}); // убрать Сохранить

    }

    transferTraining = (transferDay) => {
        // value - дата куда переносим (TimeSlotGroup)
        // не передаем для коуча и он не может менять расписание
        console.log('transferDay :', transferDay);
        if(transferDay){
            this.transferDay = {dateStart : Math.floor(+transferDay.getTime() / 1000)}
            console.log("transfertraining", transferDay);
        }
       
    }
    deleteEvent = (delEvent) => {

        if(delEvent && Object.keys(delEvent).length){
            this.delEvent = delEvent;
            this.setState({modalTransferTraining: true});
        }   
    }

    setTransfer_1_Training = () => {
            const {id: idTraining, idMaster} = this.delEvent.event;
            if(this.delEvent){
                    this.props.onTransferTrainining({idTraining, idMaster, ...this.transferDay})
                        .then(() => {
                            this.props.onGetAbonements(); 
                        });
            } 
            this.setState({modalTransferTraining: false});   
    }

    setTransfer_End_Training = () => {

        if(this.delEvent){
                this.props.onTransferTraininingToEnd({idTraining : this.delEvent.event.id})
                    .then(() => {
                        this.props.onGetAbonements(); 
                    });
        } 
        this.setState({modalTransferTraining: false});   
    }


    setAbonement_Training = () => {

        const {subscriptions: subs} = this.props.allAbonements;
        const {idSubscription, start} = this.delEvent.event;
        let scheduleForWeek = {}; // это POST
        let trainingtime = {}; // это POST
        
        const max = subs.length;
        const curWeek = moment( start.getTime() ).week(); // текущая неделя
        

        for(let i = 0; i < max; i++){
            if(subs[i].idSubscription === idSubscription) {
                scheduleForWeek.dateStart = subs[i].dateStart;
                scheduleForWeek.idSubscription = subs[i].idSubscription;
                scheduleForWeek.idStudent = '1234';//subs[i].idStudent;
                scheduleForWeek.discipline = subs[i].discipline;

                subs[i].training.forEach((item) => {
                        const start = moment(+item.start * 1000);
                        const weekElem = start.week(); // номер недели
                       

                        if (curWeek === weekElem) {

                           if( item.id === this.delEvent.event.id){
                                    const weekDay =  new Date(this.transferDay.dateStart * 1000).getDay(); // номер дня в неделе ( переносимое занятие)
                                    
                            console.log('this.tansferDay :', this.transferDay.dateStart);
                            console.log('weekDay :', weekDay);

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
        this.props.onChangeSubscription(scheduleForWeek);
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

    componentDidMount() {
        this.setIntervalAndView(this.state.currentDate, 'week');
        this.props.onGetAllUserVisits();
        this.props.onGetAbonements();
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
      
        let isNeedSaveIntervals = false
        if(this.props.abonementIntervals){
            isNeedSaveIntervals = this.props.abonementIntervals.visibleTrialModal;
            this.countTraining = this.props.abonementIntervals.countTraining; //кол-во трень в абоменте
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
        if (this.props.isUser) {
            calendar = (<Calendar receptionNum={this.getCountOfReceptionsAtCurMonth()}
                                  isUser = {true}
                                  events = {apiPatients}//{this.props.allUserVisits} //
                                  onNavigate={this.dateChangeHandler}
                                  date={this.state.currentDate}

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
                

                console.log('min :', min);
                console.log('max :', max);
            // надо нормальную проверка для коуча и студента
        
            // let checkFreeTrainers = this.state.isShowFreeTrainers ? apiTrainers : []

            let freeTrainers = (this.timeEvent && this.state.isShowFreeTrainers) ? 
                    {idEvent: this.timeEvent, freeTrainers: apiTrainers} : null
   

                    console.log('this.props.allAbonements :', this.props.allAbonements);
                    let arrAbonement = null;
                    let iterator = 0; 

                    if(this.props.allAbonements){
                        arrAbonement = [];
                        let {subscriptions} = this.props.allAbonements;
                        let max = subscriptions.length;
                        for(let i = 0; i < max; i++){
                            
                            for(let j = 0; j < subscriptions[i].training.length; j++){

                                iterator++
                                arrAbonement.push(
                                    {
                                        id:             subscriptions[i].training[j].id,
                                        avatar:         "https://appdoc.by/media/userDocuments/avatars/3095/IMG_4788.JPG",
                                        fio:            'Дисциплина - ' + subscriptions[i].discipline + ' #'+iterator,
                                        idMaster:       subscriptions[i].training[j].idMaster,
                                        discipline:     'Дисциплина - ' + subscriptions[i].discipline + ' #'+iterator,
                                        comment:        "Строгий полицейский",
                                        start:          new Date(subscriptions[i].training[j].start * 1000),
                                        status:         subscriptions[i].training[j].status,
                                        isBooking:      subscriptions[i].training[j].isBooking,

                                        idSubscription: subscriptions[i].idSubscription, // для поиска
                                    })
                            }
                        }
                    }
            editorBtn = (<Button btnText='Редактор графика'
                                 onClick={() => this.changeToEditorMode(true)}
                                 type='yellow'
                                 icon='setting_edit'/>)

                                 console.log('QQQ this.props :', this.props);
            calendar = (<Calendar 
                                    receptionNum={(arrAbonement && arrAbonement.length) ? arrAbonement.length : apiPatients.length}//{this.props.visits.length}// {apiPatients.length} 
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
                                  step={50}
                                        events={(arrAbonement && arrAbonement.length) ? arrAbonement : apiPatients} //{this.props.visits}
                                  intervals={ this.state.amountTraining ? this.props.freeIntervals : []}
                                  
                                  min= {min}
                                  max= {max}
                                  minFasol={minFasol}
                                  maxFasol={maxFasol}

                                  onPopoverClose={this.eventDeleteHandler}
                                  onPopoverEmail={this.onPatientEmail}

                                  onChange={this.dateChangeHandler}
                                  highlightedDates = {this.prepareDatesForSmallCalendar(this.props.allUserVisits)}

                                  showTransferEvent={this.showTransferEvent} // my
                                  freeTrainers={freeTrainers} //my
                                  showModalTransferEvent={this.showModalTransferEvent}
                                  setChoosenTrainer={this.setChoosenTrainer}
                                  isNeedSaveIntervals={isNeedSaveIntervals}
                                  fillTrainingWeek = {this.fillTrainingWeek}
                                  isShowFreeTrainers = {this.state.isShowFreeTrainers}
                                  transferTraining = {this.transferTraining} // drag and drop
                                  deleteEvent = {this.deleteEvent} // drag and drop
                                  setAbonement_Training = {this.setAbonement_Training}

            />)
        }

      
       console.log('this.props.min :', this.props.min);
       console.log('this.props.max :', this.props.max);

        return (
            <Hoc>
                <Row className="row-schedule" style={{margin: 0, marginTop: -7, borderTop: 7}}>
                    <Col span={24} className='schedule-title'>
                        Расписание тренировок
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {calendar}
                     />
                    </Col>
                </Row>

                <Modal 
                    title='Сообщение'
                    visible={this.state.sendingModal}
                    onClick={() => this.setState({sendingModal: false})}
                    onCancel={() => this.setState({sendingModal: false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                >

                    <div className="schedule-message-modal"> 
                        <p>Тренировки распределены по календарю</p>
                    </div>
                    
                </Modal>

                <Modal 
                    title='Сообщение'
                    visible={this.state.modalTransferTraining}
                    onCancel={() => this.setState({modalTransferTraining : false})}
                    width={360}
                    className="schedule-message-modal-wrapper"
                >
                        <div className="schedule-message-modal"> 
                            <Button btnText='Перенести 1 треню'    
                                onClick= {this.setTransfer_1_Training}
                                type='yellow'
                            />
                        </div>
                        <div className="schedule-message-modal"> 
                            <Button btnText='Перенести треню в конец'    
                                onClick= {this.setTransfer_End_Training}
                                type='yellow'
                            />
                        </div>    

                        <div className="schedule-message-modal"> 
                            <Button btnText='Новое расписание'    
                                onClick= {this.setAbonement_Training}
                                type='yellow'
                            />
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

        patients:  state.patients.docPatients,
        freeIntervals:  state.patients.freeIntervals,
        abonementIntervals: state.patients.abonementIntervals,
        countTraining: state.patients.countTraining,
        isUser:  state.auth.mode === "user",
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
        onGetAbonements: (idStudent) => dispatch(actions.getAbonements(idStudent)),
        onTransferTrainining: (value) => dispatch(actions.transferTrainining(value)),
        onTransferTraininingToEnd: (value) => dispatch(actions.transferTraininingToEnd(value)),
        onChangeSubscription: (data) => dispatch(actions.changeSubscription(data)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
