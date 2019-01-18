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
        loadingDate: moment().startOf('week'),
        weekStart: moment().startOf('week')
    };

    componentDidMount() {
        const {weekStart} = this.state;
        this.props.onGetIntervals(weekStart.format('X'), moment(weekStart).add(1, 'weeks').format('X'));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.intervals && this.props.trainerTrainings && this.state.loadingDate &&
            this.props.intervals.dateStart === this.state.loadingDate.format('X') &&
            this.props.trainerTrainings.dateStart === this.state.loadingDate.format('X')
        ) this.setState({loadingDate: null});

        if (prevState.loadingDate !== this.state.loadingDate) {
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

    renderAvailableAppointments = (intervals, trainerTrainings) => {
        const availableHoursArea = [8, 23];
        const {weekStart, loadingDate} = this.state;
        const {isAdmin, myID} = this.props;
        const curTime = moment();
        let curWeekBegin = weekStart;

        if (loadingDate) return <Spinner size="large"/>;

        let headers = [];
        let timeIntervals = [];

        for (let i = 0; i < 7; i++) {
            let curDayBegin = moment(curWeekBegin).add(i, 'days');
            let time = [];

            let dayIntervals = intervals[moment(curDayBegin).format('X')];

            let curDayTrainerTrainings = trainerTrainings[moment(curDayBegin).format('X')];
            let ownTrains = curDayTrainerTrainings ? curDayTrainerTrainings.map((item) => {
                if (isAdmin || item.allInfo.idStudent === myID)
                    return item.allInfo.date;
            }) : [];

            for (let i = availableHoursArea[0]; i < availableHoursArea[1]; i++) {
                let curHourBegin = moment(curDayBegin).add(i, 'hours');
                let isAvailable = curTime < curHourBegin
                    && dayIntervals && dayIntervals.some((item) => item.start <= curHourBegin.format('X')
                        && moment(curHourBegin).endOf('hour').format('X') <= item.end);

                let isOwn = ownTrains.length ?
                    ownTrains.indexOf(moment(curHourBegin).format('X')) !== -1 : false;

                let curHourTraining = curDayTrainerTrainings ? curDayTrainerTrainings.find(item =>
                    item.allInfo && item.allInfo.date === curHourBegin.format('X')) : null;

                time.push({
                    timestamp: curHourBegin.format('X'),
                    type: 'default',
                    isAvailable,
                    isOwn,
                    idTraining: curHourTraining && curHourTraining.allInfo.idTraining,
                    idSubscription: curHourTraining && curHourTraining.allInfo.idSubscription
                });
            }

            headers.push(curDayBegin.format('ddd, D MMM'));
            timeIntervals.push(time);
        }

        let timesColumnArr = [];
        for (let i = availableHoursArea[0] + 1; i < availableHoursArea[1] + 1; i++)
            timesColumnArr.push(<div>{moment(i, 'H').format('H:mm')}</div>);

        return <div className='table-main-row'>
            <div className='table-main-times'>{timesColumnArr}</div>
            {headers.map((item, indexDay) =>
                <div className='table-main-col' key={indexDay + 1}>
                    <div className='table-main-day' key={indexDay + 1}>{item}</div>
                    {timeIntervals[indexDay]
                        .map((item, indexTime) =>
                            <div className='table-main-time'>
                                <div
                                    className={item.isAvailable ? 'availableTime'
                                        : item.isOwn ? isAdmin ? 'reservedTime' : 'ownTime' : ''}
                                    key={indexTime + 1}
                                    onClick={item.isAvailable ?
                                        e => this.props.handleTrainModal(e, item, false, isAdmin)
                                        : (item.isOwn) ? e => this.props.handleTrainModal(e, item, true, isAdmin)
                                            : null}
                                    data-timestamp={item.timestamp}
                                    data-interval-type={item.type}
                                    data-id-training={item.idTraining}
                                    data-id-subscription={item.idSubscription}
                                />
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    };

    render() {
        const {weekStart} = this.state;
        const {intervals, trainerTrainings, isAdmin} = this.props;
        const rootClass = cn('train-carousel');
        return (
            <Card title="Записаться на тренировку">
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
                        <div className="table-main">
                            {this.renderAvailableAppointments(intervals, trainerTrainings)}
                        </div>
                        <div className="table-footer">
                            <div className="type">
                                <div className='type-color-available'/>
                                <div className='type-name'>Свободно</div>
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