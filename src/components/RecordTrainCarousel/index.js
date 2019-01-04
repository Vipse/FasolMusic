import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import NewVisitModalPage from '../NewVisitModalPage'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import {Alert, message} from 'antd'
import Spinner from "../Spinner";
import Card from "antd/es/card";

class RecordTrainCarousel extends React.Component {

    state = {
        loading: true,
        modalVisible: false,
        isFull: false,
        rowCount: 4,
        carouselStep: 0,
    };

    componentDidMount() {
        if (this.props.intervals)
            this.setState({loading: false});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.intervals !== this.props.intervals)
            this.setState({loading: false});
    }

    setModalVisible(modalVisible) {
        this.setState({modalVisible});
    }

    dateClickHandler = (e) => {
        let timestamp = e.target.getAttribute("data-timestamp");
        let type = e.target.getAttribute("data-interval-type");
        let docs = e.target.getAttribute("data-docs");
        this.props.newVisitVisible && this.props.newVisitVisible(true, this.props.id, this.props.doctorName, timestamp, type);


        if (this.props.makeActive) {
            if (e.target.classList.contains("activeTime")) {
                e.target.classList.remove("activeTime");
                this.props.makeActive(null, null);
                return
            }
            this.props.makeActive(timestamp, type, docs);
            e.target.parentNode.parentNode.childNodes.forEach((item) => item.childNodes.forEach(item => item.classList.remove("activeTime")));
            e.target.classList.toggle("activeTime");
        }
    };

    nextCarouselItem = (e) => {
        e.preventDefault();
        if (this.state.carouselStep < 7) {
            this.setState({
                carouselStep: this.state.carouselStep + 1
            })
        }
    };

    prevCarouselItem = (e) => {
        e.preventDefault();
        if (this.state.carouselStep > 0) {
            this.setState({
                carouselStep: this.state.carouselStep - 1
            })
        }
    };

    findWorkIntervalsForDay = (dayOfWeek) => {
        const {trainingTime} = this.props;
        let workIntervalsForDay = [];
        trainingTime.some(item => {
            if (+item.day[0].value === dayOfWeek) {
                workIntervalsForDay[0] = moment(item.datestart * 1000).hours();
                workIntervalsForDay[1] = moment(item.dateend * 1000).hours();
                return true;
            }
            else return false;
        });
        return workIntervalsForDay;
    };

    renderAvailableAppointments = (intervals) => {
        const curTime = moment();
        let curWeekBegin = moment().startOf('week');

        if (!intervals) {
            return
        }

        let headers = [];
        let timeIntervals = [];

        for (let i = 0; i < 30; i++) {
            let curDayBegin = moment(curWeekBegin).add(i, 'days');
            let time = [];
            if (intervals[moment(curDayBegin).format('X')]) {
                let dayIntervals = intervals[moment(curDayBegin).format('X')];
                let workTimeIntervals = this.findWorkIntervalsForDay(moment(curDayBegin).day());
                for (let i = workTimeIntervals[0]; i < workTimeIntervals[1]; i++) {
                    let curHourBegin = moment(curDayBegin).add(i, 'hours');
                    let isActive = curTime < curHourBegin
                        && dayIntervals.some((item) => item.start <= curHourBegin.format('X')
                            && moment(curHourBegin).endOf('hour').format('X') <= item.end);
                    time.push({
                        timeToDisplay: curHourBegin.format('H:mm'),
                        timestamp: curHourBegin.format('X'),
                        type: 'default',
                        isActive: isActive,
                        ordered: false
                    });
                }
            }

            if (time.length) {
                headers.push(curDayBegin.format('ddd D MMMM'));
                timeIntervals.push(time);
            }
        }

        return headers.map((item, indexDay) =>
            <div className='train-carousel-col' key={indexDay + 1}>
                <div className='train-carousel-day' key={indexDay + 1}>{item}</div>
                {(this.state.rowCount ? timeIntervals[indexDay].slice(0, this.state.rowCount) : timeIntervals[indexDay])
                    .map((item, indexTime) =>
                        <div
                            className={item.isActive ? 'train-carousel-time' : 'train-carousel-time unAvailableTime'}
                            onClick={item.isActive ? () => {this.props.handleOrderTrain(item)} : null}
                            key={indexTime + 1}
                            data-timestamp={item.timestamp}
                            data-interval-type={item.type}
                            data-docs={item.docs}
                        >
                            {item.timeToDisplay}
                        </div>
                    )
                }
            </div>
        )
    };

    render() {
        const {loading} = this.state;
        const {intervals} = this.props;
        const rootClass = (intervals && JSON.stringify(intervals) !== '{}') ? cn('train-carousel') : cn('train-carousel no-intervals');
        return (
            <Card title="Записаться на тренировку">
                {loading ? <Spinner/> :
                    <div className={rootClass}>
                        {JSON.stringify(intervals) === '{}' ? (<span className="no-schedule">Коуч ещё не определил расписание</span>)
                            :
                            (<div>
                                    <div className='train-carousel-slide'>
                                        <Button className='btn-prev'
                                                btnText=''
                                                size='icon'
                                                type='icon'
                                                icon='arrow_left'
                                                svg
                                                onClick={this.prevCarouselItem}
                                        />
                                        <div className="schedule">
                                            <div className="carouselPosition"
                                                 style={{transform: `translateX(-${this.state.carouselStep * 50 / Object.keys(intervals).length}%)`}}>
                                                {this.renderAvailableAppointments(intervals)}
                                            </div>
                                        </div>
                                        <Button className='btn-next'
                                                btnText=''
                                                size='icon'
                                                type='icon'
                                                icon='arrow_right'
                                                svg
                                                onClick={this.nextCarouselItem}
                                        />
                                        {/*this.props.shouldChooseTime && <Alert message="Выберите время" type="error" style={{marginTop: "10px"}}/>*/}
                                    </div>
                                    <div className="table-footer"
                                         key="btn"
                                    >
                                        <Button size='link'
                                                type='link'
                                                title='Показать ещё'
                                                icon={this.state.isFull ? 'circle_arrow_up' : 'circle_arrow_down'}
                                                onClick={() => this.setState({
                                                    rowCount: this.state.rowCount === 4 ? 0 : 4,
                                                    isFull: !this.state.isFull
                                                })}/>
                                    </div>
                                    <NewVisitModalPage
                                        visible={this.state.modalVisible}
                                        onOk={() => this.setModalVisible(false)}
                                        onCancel={() => this.setModalVisible(false)}
                                    />
                                </div>
                            )}
                    </div>}
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