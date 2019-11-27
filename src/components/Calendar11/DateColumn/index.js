import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './styles.css'
import DateColumnItem from '../DateColumnItem'

class DateColumn extends React.Component{

    renderHeadColumn = () => {

        return (
            <div className="rbc-label rbc-header-eventgutter rbc-clock-icon">    
                <span className="icon icon-clock">
                </span>
            </div>)
    }

    renderCells = () => {
        const {min, max} = this.props;
        let minMoment = moment(+min);
        let maxMoment = moment(+max);
        let arrReander = [];

        while (minMoment.isBefore(maxMoment)){
            arrReander.push(
                <DateColumnItem 
                    key={minMoment.format('X')} //timestamp
                    date={minMoment.format('x')} 
                />
            )
            minMoment.add(1, 'hour')        
        }
        
        return arrReander;
    }

    render() {

        return (
            <div className='rbc-time-eventgutter rbc-time-eventcolumn'>
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
