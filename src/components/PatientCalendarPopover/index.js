import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '../Button'

import Icon from '../Icon'
import './style.css'
import {message, Modal} from "antd";


const PatientCalendarPopover = (props) => {

  	const { appointmentNum, appointmentSpec, appointmentName, appointmentDate, appointmentType, appointmentText, appointmentTypeTitle, calendarItem, onGoto, onGotoName} = props;

    const cancelApp = (id) => {
        Modal.confirm({
            title: `Вы действительно хотите отменить приём?`,
            width: '445px',
            okText: 'Да',
            cancelText: 'Нет',
            onOk() {
                props.cancelAppByPatient(id).then((res)=>{
                    if(res.data.code === 200) {
                        message.success("Приём успешно отменен")
                    }
                })
            },
        });
    };


    return (
    	<div className='popover-calendar'>
			<div className='popover-calendar-title'>Приёмы</div>
			{calendarItem.map((item, index)=>
				<div className='popover-calendar-item' key={index+1}>
					<div className='popover-calendar-num'><span>{index+1}</span></div>
					<div className='popover-calendar-block'>
						<div className='popover-calendar-speciality'>
							{item.event.doctorSpecialty}
						</div>
                        {/*item.event.id есть для перехода*/}
						<div onClick={() => props.onGotoName()} className='popover-calendar-name go-to'>
							{item.event.doctorName}
						</div>
						<div className='popover-calendar-info'>
							<div className='popover-calendar-date'>
                                {moment(item.event.start).format("DD MMMM HH:mm")} - {moment(item.event.end).format("HH:mm")}
                            </div>
							<div className='popover-calendar-type'>
                                 <Icon
                                     type={item.event.type === "video" ? "video-camera" : item.event.type === "voice" ?
                                     "telephone" : "chat1"}
                                     size={17}
                                     svg
                                     title={item.appointmentTypeTitle} />
                                {+moment(item.event.start).format('X') - 10800 > +moment().format('X') && <Icon
                                     type="circle_close"
                                     size={17}
                                     svg
                                     title="Отменить приём"
                                     style={{marginLeft:"10px", cursor:"pointer"}}
                                     onClick={()=>cancelApp(item.event.id)}
                                />}
                            </div>
						</div>
						<div className='popover-calendar-text'>{item.appointmentText}</div>
					</div>
				</div>
			)}
		</div>
    );
};

PatientCalendarPopover.propTypes ={
    calendarItem: PropTypes.array,
    onGoto: PropTypes.func,
    onGotoName: PropTypes.func,
};

PatientCalendarPopover.defaultProps = {
    calendarItem: [],
    onGoto: () => {},
    onGotoName: () => {},
};

export default PatientCalendarPopover
