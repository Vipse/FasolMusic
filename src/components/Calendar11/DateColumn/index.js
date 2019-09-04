import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './styles.css'

class DateColumn extends React.Component{

    renderHeadColumn = () => {

        return (
            <div className="rbc-label rbc-header-eventgutter rbc-clock-icon">    
                <span title className="icon icon-clock">
                </span>
            </div>)
    }

    renderCells = () => {
        const {min, max} = this.props;
        let minMoment = moment(+min);
        let maxMoment = moment(+max);
        let arrReander = [];

        //moment().format('x');
        //moment('2010-10-20').isBefore('2010-10-21'); 
        while (minMoment.isBefore(maxMoment)){
            arrReander.push(
                    <div className="rbc-timeslot-group rbc-timeslot-group-NOT">
                        <div className="rbc-time-slot rbc-eventlabel">
                        <span className="event-body">
                            {minMoment.format('HH:mm')}
                            </span>
                        </div>
                    </div>)
            minMoment.add(1, 'hour')        
        }
        


        return arrReander;
    }

    render() {

        return (
            <div class='rbc-time-eventgutter rbc-time-eventcolumn'>
                {this.renderHeadColumn()}
                {this.renderCells()}
            </div>
        )
    }
}

DateColumn.propTypes = {
};

DateColumn.defaultProps = {
};

export default DateColumn;
