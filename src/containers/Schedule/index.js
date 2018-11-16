/* eslint-disable */
import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux';
import Hoc from '../../hoc'
import Row from "../../components/Row";
import Col from "../../components/Col";
import Button from "../../components/Button";
import Calendar from "../../components/Calendar22";
import SmallCalendar from "../../components/SmallCalendar";
import CancelVisitModal from "../../components/CancelVisitModal";
import NewVisitModal from "../../components/NewVisitModal";
import NewMessageModal from "../../components/NewMessageModal";
import ReceptionsScheduleModal from "../../components/ReceptionsScheduleModal";
import WarningModal from "../../components/WarningModal";
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
            warningModal: false,
            receptionData: {
                dates: [],
                currentSched: {},
            
            },

            isTransferEvent: false,
            isShowFreeTrainers: false
        }
    };


    showTransferEvent = (id) => { // нажатие на крестик
        this.setState({isTransferEvent : true});
        this.deleteId = id;
    }
    showModalTransferEvent = (idEvent) => { // нажатие на желтую область -> появление свободных тренеров
        // запомнить куда нужно отправить free trainers
       
        if(!this.isShowFreeTrainers2){
            this.idEvent = idEvent;
            this.setState({isShowFreeTrainers : true});
        } 
        else{
            this.idEvent = null;
            this.isShowFreeTrainers2 = false;
            this.setState({isShowFreeTrainers : false});
        }
       
    }

    setChoosenTrainer = (id, time) => {

        this.idEvent = null;
        this.isShowFreeTrainers2 = 2;
        this.setState({ isTransferEvent: false});

        this.deleteId = null;


        for(let i = 0; i < apiTrainers.length; i++){
   
            if(apiTrainers[i].id === id){
                let trainer= {...apiTrainers[i]};
                trainer.start = new Date(time);
                apiPatients.push(trainer);
                break;
            }
        }
        console.log('this.countTraining :',   this.props.abonementIntervals.countTraining);
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
        this.setState({warningModal: true});
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
            isNeedSaveIntervals = this.props.abonementIntervals.isNeedSaveIntervals;
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

            let min = new Date(new Date(this.props.min * 1000).setFullYear(currY, currM, currD)),
                max = new Date(new Date(this.props.max * 1000).setFullYear(currY, currM, currD));
                
            // надо нормальную проверка для коуча и студента
        
            let checkIntervals = this.state.isTransferEvent ? 
            fasolIntervals//this.props.intervals 
            : []
            let checkFreeTrainers = this.state.isShowFreeTrainers ? apiTrainers : []
            if(this.isShowFreeTrainers2 == 2) checkFreeTrainers = [];

            //console.log('this.props.intervals  :', this.props.intervals );
            let freeTrainers = this.idEvent ? 
                    {idEvent: this.idEvent, freeTrainers: checkFreeTrainers} : null

                   
                    
            editorBtn = (<Button btnText='Редактор графика'
                                 onClick={() => this.changeToEditorMode(true)}
                                 type='yellow'
                                 icon='setting_edit'/>)
            calendar = (<Calendar receptionNum={apiPatients.length}//{this.props.visits.length}// {apiPatients.length} 
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
                                        events={apiPatients} //{this.props.visits}
                                  intervals={this.props.freeIntervals}
                                  min={min}
                                  max={max}
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
                                  fillTrainingWeek = {fillTrainingWeek}
            />)
        }

        
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
                <CancelVisitModal visible={this.state.cancelModal}
                                  {...this.props.cancelData}
                                  onSave={(obj) => {
                                      this.props.onCloseCancelModal(obj);
                                      this.setState({cancelModal: false, warningModal: true});
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
                <WarningModal visible={this.state.warningModal}
                              onClick={() => this.setState({warningModal: false})}
                              message='Изменения всупят в силу после проверки администратором'/>
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        patients: state.patients.docPatients,
        freeIntervals: state.patients.freeIntervals,
        abonementIntervals: state.patients.abonementIntervals,
        countTraining: state.patients.countTraining,
        isUser: state.auth.mode === "user",
        visits: state.schedules.visits,
        intervals: state.schedules.visIntervals,
        min: state.schedules.min,
        max: state.schedules.max,
        schedules: state.schedules.schedules,
        chosenData: state.schedules.chosenData,
        cancelData: state.schedules.cancelData,
        allUserVisits: state.schedules.allUserVisits,
        emergencyAvailable: state.doctor.emergencyAvailable
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
