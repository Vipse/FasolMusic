import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import Spinner from "../Spinner";
import Card from "antd/es/card";

class RecordTrainCarousel extends React.Component {

    state = {
        loadingDate: moment().utcOffset('+0300').startOf('week'),
        weekStart: moment().utcOffset('+0300').startOf('week')
    };

    componentDidMount() {
        const {weekStart} = this.state;
        this.props.onGetIntervals(weekStart.format('X'), moment(weekStart).add(1, 'weeks').format('X'));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {intervals, trainerTrainings, isStudentPage} = this.props;
        const {loadingDate} = this.state;

        if (loadingDate &&
            (isStudentPage || (intervals && intervals.dateStart === loadingDate.format('X'))) &&
            trainerTrainings && trainerTrainings.dateStart === loadingDate.format('X')
        ) this.setState({loadingDate: null});

        if (prevState.loadingDate !== loadingDate) {
            const {weekStart} = this.state;
            this.props.onGetIntervals(weekStart.format('X'), moment(weekStart).add(1, 'weeks').format('X'));
        }
    }

    nextCarouselItem = (e) => {
        const {weekStart} = this.state;
        const nextWeekStart = moment(weekStart).add(1, 'weeks');
        e.preventDefault();
        this.setState({
            loadingDate: nextWeekStart,
            weekStart: nextWeekStart
        });
    };

    prevCarouselItem = (e) => {
        const {weekStart} = this.state;
        const prevWeekStart = moment(weekStart).subtract(1, 'weeks');
        e.preventDefault();
        this.setState({
            loadingDate: prevWeekStart,
            weekStart: prevWeekStart
        });
    };

    renderAvailableAppointments = (trainerTrainings, intervals = {}) => {
        const availableHoursArea = [8, 23];
        const {weekStart, loadingDate} = this.state;
        const {isAdmin, studentID} = this.props;
        const curTime = moment().utcOffset("+03:00");
        let curWeekBegin = weekStart;

        if (loadingDate) return <Spinner size="large"/>;

        let headers = [];
        let timeIntervals = [];

        for (let i = 0; i < 7; i++) {
            let curDayBegin = moment(curWeekBegin).add(i, 'days');
            let time = [];

            let dayIntervals = intervals[moment(curDayBegin).format('X')];
            
            let curDayTrainerTrainings = trainerTrainings[moment(curDayBegin).format('X')];

            let ownTrains = [];
            if (curDayTrainerTrainings)
                for (let train in curDayTrainerTrainings) {
                    if (!+curDayTrainerTrainings[train].allInfo.isBooking && (isAdmin
                        || (+curDayTrainerTrainings[train].allInfo.idStudent === +studentID)))
                        ownTrains.push(curDayTrainerTrainings[train].allInfo.date);
                }

            for (let i = availableHoursArea[0]; i < availableHoursArea[1]; i++) {
                let curHourBegin = moment(curDayBegin).add(i, 'hours');
                let isAvailable = curTime < curHourBegin
                    && dayIntervals && dayIntervals.some((item) => item.start <= curHourBegin.format('X')
                        && moment(curHourBegin).endOf('hour').format('X') <= item.end);

                let isOwn = ownTrains.length ?
                    ownTrains.indexOf(moment(curHourBegin).format('X')) !== -1 : false;

                let curHourTraining = null;
                if (curDayTrainerTrainings)
                    for (let train in curDayTrainerTrainings)
                        if (curDayTrainerTrainings[train].allInfo && curDayTrainerTrainings[train].allInfo.date === curHourBegin.format('X')) {
                            curHourTraining = curDayTrainerTrainings[train];
                            break;
                        }
            
                time.push({
                    timestamp: curHourBegin.format('X'),
                    type: 'default',
                    isComplete:curHourTraining && curHourTraining.allInfo.isComplete,
                    isBooking: curHourTraining && curHourTraining.allInfo.isBooking,
                    isAvailable,
                    isOwn,
                    idTraining: curHourTraining && curHourTraining.allInfo.idTraining,
                    idSubscription: curHourTraining && curHourTraining.allInfo.idSubscription,
                    studentName: curHourTraining && curHourTraining.allInfo.fio,
                    idStudent: curHourTraining && curHourTraining.allInfo.idStudent,
                    idMaster: curHourTraining && curHourTraining.allInfo.idMaster
                });
            }

            headers.push(curDayBegin.format('ddd, D MMM'));
            timeIntervals.push(time);
        }

        let timesColumnArr = [];
        for (let i = availableHoursArea[0]; i < availableHoursArea[1]; i++)
            timesColumnArr.push(<div>{moment(i, 'H').format('H:mm')}</div>);
      
        return <div className='table-main-row'>
            <div className={isAdmin ? "table-main-times-admin" : 'table-main-times'}>{timesColumnArr}</div>
            {headers.map((item, indexDay) =>
                <div className='table-main-col' key={indexDay + 1}>
                    <div className='table-main-day' key={indexDay + 1}>{item}</div>
                    {timeIntervals[indexDay]
                         .map((item, indexTime) => <div className={isAdmin ? "table-main-time table-main-time-admin" : "table-main-time"}>
                                <div className = { this.getCellType(item) }
                                     key={indexTime + 1}
                                     onClick={item.isAvailable ?
                                         e => this.props.handleTrainModal(e, false, isAdmin)
                                         : (item.isOwn || item.isBooking) ? e => this.props.handleTrainModal(e, true, isAdmin, item)
                                             : null}
                                     data-timestamp={item.timestamp}
                                     data-interval-type={item.type}
                                >
                                <span>{ this.getCellName(item) }</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    };

    getCellName = (item) => {
        const {isAdmin, studentID} = this.props;
        let isNeed = false;
        
        if (item.isOwn || item.isBooking) {
            if (isAdmin) isNeed = true;
            else if (studentID == item.idStudent) isNeed = true;
        }

        if (isNeed === true && item.studentName !== null && item.studentName !== undefined && item.studentName!=="" && item.studentName !== " ") {
            let name = item.studentName.substring(0,
                                                    item.studentName.indexOf('@') > 0 ? 
                                                        item.studentName.indexOf('@') 
                                                        : item.studentName.length
                                                 )

            if (name.indexOf(" ") < 0) {
                name = name.substring(0,12) + " " + name.substring(12,name.length);
            }
               
            return name;
          
        }
        else return undefined
    }

   
    getCellType = (item) => {
        const {isAdmin, studentID} = this.props;

        if ( item.isBooking ) {
            if ( isAdmin ) return "bookingTime-admin";
            else if ( studentID == item.idStudent ) return "bookingTime"; 
            else return ""
        }
        else if ( item.isOwn ){
            if (item.isComplete) return isAdmin ? "completeTime-admin":"completeTime";
            else return isAdmin ? 'reservedTime' : 'ownTime';
        }
        else if ( item.isAvailable ) {
            return isAdmin ? 'adminAvaiableTime' : 'availableTime'
        }
        else return "";

    }

    render() {
        const {weekStart} = this.state;
        const {intervals, trainerTrainings, isAdmin, isStudentPage} = this.props;
        const rootClass = cn('train-carousel');
        return (
            <Card title={isAdmin ? "Расписание тренировок" : isStudentPage ? "Расписание тренировок" : "Записаться на тренировку"}>
                <div className={rootClass}>
                    <div>
                        <div className='table-header'>
                            <Button className='btn-prev'
                                    btnText=''
                                    size='icon'
                                    type='icon'
                                    icon='arrow_left'
                                    svg
                                    onClick={this.prevCarouselItem}
                            />
                            {weekStart.format('D MMMM') + ' - ' + moment(weekStart).endOf('week').format('D MMMM')}
                            <Button className='btn-next'
                                    btnText=''
                                    size='icon'
                                    type='icon'
                                    icon='arrow_right'
                                    svg
                                    onClick={this.nextCarouselItem}
                            />
                        </div>
                        <div className={isAdmin ? "table-main table-main-admin" : "table-main"}>
                            {this.renderAvailableAppointments(trainerTrainings, intervals)}
                        </div>
                        <div className="table-footer">
                            <div className="type">
                                <div className='type-color-booking'/>
                                <div className='type-name'>Забронированная тренировка</div>
                            </div>
                            {isAdmin ?
                                <div className="type">
                                    <div className='type-color-reserved'/>
                                    <div className='type-name'>Есть тренировка</div>
                                </div> :
                                <div className="type">
                                    <div className='type-color-own'/>
                                    <div className='type-name'>Ваша тренировка</div>
                                </div>
                            }
                            <div className="type">
                                <div className='type-color-complete'/>
                                <div className='type-name'>Завершенная тренировка  </div>
                            </div>
                           
                            {!isStudentPage && <div className="type">
                                <div className='type-color-available'/>
                                <div className='type-name'>Свободно</div>
                            </div>}
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

RecordTrainCarousel.propTypes = {
    doctorRate: PropTypes.number,
    carouselDays: PropTypes.array,
};

RecordTrainCarousel.defaultProps = {
    doctorRate: 0,
    carouselDays: [],
};

export default RecordTrainCarousel
