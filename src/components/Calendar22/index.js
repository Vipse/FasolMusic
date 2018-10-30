import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment';

import Calendar from './libr/Calendar'
import momentLocalizer from './libr/localizers/moment.js'

import './react-big-calendar.css'
import './style.css'

moment.locale('ru');
momentLocalizer(moment);

class BigCalendar extends React.Component{
    
    //сервер_дата -> moment_дата
    //private
    changeIntervalDate = (start, end) => { 
        return {
            start: new Date((+start)*1000),
            end: new Date((+end)*1000),
        }
    };

    changeSchedule = () => {
        return this.props.schedules ? this.props.schedules.map((sched)=>{
                const {intervalOb,intervalEx} = sched;
                let newIntervalOb = [];
                for(let i = 0, len = intervalOb.length; i < len; i++){
                    let interv = intervalOb[i];
                    newIntervalOb.push(this.changeIntervalDate(interv.start, interv.end))
                }

                let newIntervalEx = [];
                for(let i = 0, len = intervalEx.length; i < len; i++){
                    let interv = intervalEx[i];
                    newIntervalEx.push(this.changeIntervalDate(interv.start, interv.end))
                }

                return {
                    ...sched,
                    intervalOb: newIntervalOb,
                    intervalEx: newIntervalEx,
                }

            }) : [];
    };

    changeEvents = () => {
        return this.props.events ? this.props.events.map((event) => {
                return {
                    ...event,
                    ...this.changeIntervalDate(event.start, event.end),
                }
            }) : [];
    };
    
    render() {
        return (<div>
            {
                true ?
                    <Calendar
                            isUser={true} // это для коуча
                            defaultView={'week'}
                            onView={() => {}}
                          
                            events = {this.changeEvents()}
                            {...this.props}

                            />
                    :
                    <Calendar
                            defaultView={'week'}
                            schedules={this.changeSchedule()}
    
                            events = {this.changeEvents()}
                            {...this.props}

                            />
            }
        </div>);
    }
}

BigCalendar.propTypes = {
    isUser: PropTypes.bool,
    events: PropTypes.array,
    schedules: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            isEditable: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            intervalOb: PropTypes.array,
            intervalEx: PropTypes.array,
        })
    ),
    intervals: PropTypes.array,
    receptionNum: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    onPopoverClose: PropTypes.func,
    onPopoverEmail: PropTypes.func,
    gotoEditor: PropTypes.func,
};


BigCalendar.defaultProps = {
    isUser: false,
    events: [],
    schedules: [],
    intervals: [],
    receptionNum: 0,
    onPopoverClose: () => {},
    onPopoverEmail: () => {},
    gotoEditor: () => {},
};


export default BigCalendar;