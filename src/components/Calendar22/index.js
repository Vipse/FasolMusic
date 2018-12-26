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
                true ? // this.props.isUser
                    <Calendar
                        events = {this.changeEvents()}
                        isUser={true} // это для коуча
                        
                        {...this.props}

                   />
                    :
                    <Calendar
                        events = {this.changeEvents()}
                        
                            //  schedules={this.changeSchedule()} 
                            // обычные интервалы и экстренные и переводит в Date
        
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
    showTransferEvent: PropTypes.func,
    freeTrainers: PropTypes.object,
    showModalTransferEvent: PropTypes.func,
    setChoosenTrainer: PropTypes.func,
    isNeedSaveIntervals: PropTypes.bool,
    fillTrainingWeek: PropTypes.func,
    isShowFreeTrainers: PropTypes.bool,
    transferTraining: PropTypes.func,
    deleteEvent: PropTypes.func,
    onCancelTraining: PropTypes.func,
    trainerTraining: PropTypes.object,
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
    trainerTraining: {},
};


export default BigCalendar;