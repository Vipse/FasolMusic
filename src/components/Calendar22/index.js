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


export default BigCalendar;