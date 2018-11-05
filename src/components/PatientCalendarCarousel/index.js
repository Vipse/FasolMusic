import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import NewVisitModalPage from '../NewVisitModalPage'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import {Alert} from 'antd'

class PatientCalendarCarousel extends React.Component {

    state = {
        modalVisible: false,
        isFull: false,
        rowCount: 4,
        intervals: [],
        carouselStep: 0,
    };

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
        e.preventDefault()
        if (this.state.carouselStep < this.props.intervals.length - 3) {
            this.setState({
                carouselStep: this.state.carouselStep + 1
            })
        }
    };
    prevCarouselItem = (e) => {
        e.preventDefault()
        if (this.state.carouselStep > 0) {
            this.setState({
                carouselStep: this.state.carouselStep - 1
            })
        }
    };


    renderAvailableAppointments = (intervals) => {
        if (!intervals) {
            return
        }


        let headers = [];
        let timeIntervals = [];

        if (this.props.isOnFreeAppointments) {
            for (let i = 0; i < intervals.length; i++) {
                let time = [];
                for (let key in intervals[i]) {
                    headers.push(moment(+key * 1000).format('ddd D MMMM'));
                    for (let appKey in intervals[i][key]) {
                        time.push({
                            timeToDisplay: moment(+appKey * 1000).format('H:mm'),
                            timestamp: +appKey,
                            //type: intervals[i].type,
                            isActive: true,
                            docs: intervals[i][key][appKey]["doc"].join(" ")
                        })
                    }
                }
                timeIntervals.push(time);

            }
        } else {

            for (let i = 0; i < intervals.length; i++) {
                let time = [];
                if (intervals[i].intervalOb.length) {
                    for (let j = 0; j < intervals[i].intervalOb.length; j++) {
                        for (let t = +intervals[i].intervalOb[j].start; t < +intervals[i].intervalOb[j].end; t += intervals[i].interval * 60) {
                            if(+t >= +moment().format("X")+1800) {
                                time.push({
                                    timeToDisplay: moment(+t * 1000).format('H:mm'),
                                    timestamp: +t,
                                    type: intervals[i].type,
                                    isActive: intervals[i].intervalOb[j].active,
                                    isAfterAnalyses: +intervals[i].interval === 5
                                });
                            }
                        }
                    }
                    if(time.length) {
                        headers.push(moment(this.props.intervals[i].date * 1000).format('ddd D MMMM'));
                        timeIntervals.push(time);
                    }
                }
            }
        }

        return headers.map((item, indexDay) =>
            <div className='calendar-carousel-col' key={indexDay + 1}>
                <div className='calendar-carousel-day' key={indexDay + 1}>{item}</div>
                {this.state.rowCount ?
                    timeIntervals[indexDay].slice(0, this.state.rowCount).map((item, indexTime) =>
                        <div className={!item.isActive ? 'calendar-carousel-time unAvailableTime'
                            : item.isAfterAnalyses ? 'calendar-carousel-time afterAnalyses' : 'calendar-carousel-time'}
                             onClick={item.isActive ? (e) => this.dateClickHandler(e) : null}
                             key={indexTime + 1}
                             data-timestamp={item.timestamp}
                             data-interval-type={item.type}
                             data-docs={item.docs}
                        >
                            {item.timeToDisplay}
                        </div>
                    )
                    :
                    timeIntervals[indexDay].map((item, indexTime) =>
                        <div className={!item.isActive ? 'calendar-carousel-time unAvailableTime'
                            : item.isAfterAnalyses ? 'calendar-carousel-time afterAnalyses' : 'calendar-carousel-time'}
                             onClick={item.isActive ? (e) => this.dateClickHandler(e) : null}
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
        const intervals = this.props.intervals;
        const rootClass = intervals.length ? cn('calendar-carousel') : cn('calendar-carousel no-intervals');
        return (
            <div className={rootClass}>
                {!intervals.length ? (<span className="no-schedule">Доктор ещё не определил расписание</span>)
                    :
                    (<div>
                            <div className='calendar-carousel-slide'>

                                <Button className='btn-prev'
                                        btnText=''
                                        size='icon'
                                        type='icon'
                                        icon='arrow_left'
                                        svg
                                        onClick={this.prevCarouselItem}
                                />
                                <Button className='btn-next'
                                        btnText=''
                                        size='icon'
                                        type='icon'
                                        icon='arrow_right'
                                        svg
                                        onClick={this.nextCarouselItem}
                                />
                                <div className="carouselPosition"
                                     style={{transform: `translateX(-${this.state.carouselStep * 33}%)`}}>
                                    {this.renderAvailableAppointments(intervals)}
                                </div>
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
                            {this.props.shouldChooseTime && <Alert message="Выберите время" type="error" style={{marginTop: "10px"}}/>}
                            <NewVisitModalPage
                                visible={this.state.modalVisible}
                                onOk={() => this.setModalVisible(false)}
                                onCancel={() => this.setModalVisible(false)}
                            />
                        </div>
                    )}
            </div>
        )
    }
}

PatientCalendarCarousel.propTypes = {
    doctorRate: PropTypes.number,
    carouselDays: PropTypes.array,
};

PatientCalendarCarousel.defaultProps = {
    doctorRate: 0,
    carouselDays: [],
};

export default PatientCalendarCarousel