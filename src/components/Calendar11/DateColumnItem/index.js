import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './styles.css'

class DateColumnItem extends React.Component {

    getClassNameOfNow = () => {
        const {date} = this.props;
        const fdate  = moment(+date);

        if(moment().hour() === fdate.hour() && moment().week() === fdate.week()){
            return 'rbc-now'
        }
        return         
    }

    render() {
        const {date} = this.props;
        const fdate  = moment(+date);


        return (
            <div className="rbc-timeslot-group rbc-timeslot-group-NOT">
                <div className={`rbc-time-slot rbc-eventlabel ${this.getClassNameOfNow()}`}>
                    <span className="event-body">
                        {fdate.format('HH:mm')}
                    </span>
                </div>
            </div>
        )
    }
}



export default DateColumnItem;
