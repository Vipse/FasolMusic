import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'

import './style.css'
import '../../icon/style.css'

class PatientNearRecordItem extends React.Component{

    render(){
        const { doctorName, doctorSpecialty, dateDay, dateMonth, time } = this.props;
        const rootClass = cn('record-item');
        console.log(this.props.start, this.props.end, "START END")
        return (
            <div className={rootClass}>
                <div className='record-item-date'>
                    <span>{moment(+this.props.start*1000).format("DD")}</span>
                    <span>{moment(+this.props.start*1000).format("MMMM")}</span>
                </div>
                <div className='record-item-info'>
                   <div className='record-item-time'>{moment(+this.props.start*1000).format("H:mm")} - {moment(+this.props.end*1000).format("H:mm")}</div>
                   <div className='record-item-doctor__name'>{doctorName}</div>
                   <div className='record-item-doctor__specialty'>{doctorSpecialty}</div>
                </div>
            </div>
        )
    }
}

PatientNearRecordItem.propTypes = {
    doctorName: PropTypes.string,
    doctorSpecialty: PropTypes.string,
    dateDay: PropTypes.string,
    dateMonth: PropTypes.string,
    time: PropTypes.string,
};

PatientNearRecordItem.defaultProps = {
    doctorName: '',
    doctorSpecialty: '',
    dateDay: '',
    dateMonth: '',
    time: '',
};

export default PatientNearRecordItem