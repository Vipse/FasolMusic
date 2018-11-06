import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'

import './style.css'
import '../../icon/style.css'
import Button from "../Button";
import {Modal, message} from "antd";

class PatientNearRecordItem extends React.Component{

    cancelApp = () => {
        const id = this.props.id;
        const that = this;
        Modal.confirm({
            title: `Вы действительно хотите отменить приём?`,
            width: '445px',
            okText: 'Да',
            cancelText: 'Нет',
            onOk() {
                that.props.cancelAppByPatient(id).then((res)=>{
                    if(res.data.code === 200) {
                        message.success("Приём успешно отменен")
                    }
                })
            },
        });
    };
    render(){
        const { doctorName, doctorSpecialty, dateDay, dateMonth, time } = this.props;
        const rootClass = cn('record-item');

        return (
            <div className={rootClass}>
                <div className='record-item-date'>
                    <span>{moment(+this.props.start*1000).format("DD")}</span>
                    <span>{moment(+this.props.start*1000).format("MMMM")}</span>
                </div>
                <div className='record-item-info'>
                   <div className='record-item-time'>{moment(+this.props.start*1000).format("H:mm")} - {moment(+this.props.end*1000).format("H:mm")}</div>
                   <div className='record-item-doctor__name'>{doctorName}</div>
                    {+moment(this.props.start*1000).format('X') - 10800 > +moment().format('X') && <div className='record-item-cancelApp'>
                       <Button
                           onClick={this.cancelApp}
                           size='file'
                           btnText='Отменить прием'
                           type='link'
                           icon='circle_close'
                           svg
                           iconSize={18}
                           style={{color: "#111", padding: "0"}}
                       />
                   </div>}

                   {/*<div className='record-item-doctor__specialty'>{doctorSpecialty}</div>
                   <div className='record-item-doctor__specialty'>{doctorSpecialty}</div>*/}
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
