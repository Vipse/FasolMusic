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
    

    
    render() {
        if(this.props.isAdmin) {
            return <Calendar
                masterList = {this.props.masterList}
                isAdmin
                {...this.props}
            />
        }

        return (
            <Calendar
                events={this.props.events}
                {...this.props}

            />
        );
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
    isAdmin: PropTypes.bool,
    showMasterList: PropTypes.func,
};


BigCalendar.defaultProps = {
    isUser: false,
    events: [],
    schedules: [],
    intervals: [],
    receptionNum: 0,
    onPopoverClose: () => {},
    onPopoverEmail: () => {},
    trainerTraining: {},
    isAdmin: false,
};


export default BigCalendar;