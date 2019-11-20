import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import BigCalendar from '../';


const events1 = [
    {
        id: 6,
        fio: 'Иванова Александра',
        start: new Date(2018, 0, 12, 10, 30, 0, 0).getTime()/1000,
        end: new Date(2018, 0, 12, 10, 50, 0, 0).getTime()/1000,
        comment: 'Pre-meeting meeting, to prepare for the meeting',
        type: 'video'
    },
    {
        id: 7,
        fio: 'Иванова Александра',
        start: new Date(2018, 0, 11, 12, 0, 0, 0).getTime()/1000,
        end: new Date(2018, 0, 11, 12, 10, 0, 0).getTime()/1000,
        comment: 'Power lunch',
        type: 'video'
    },
    {
        id: 8,
        fio: 'Иванова Александра',
        start: new Date(2018, 0, 12, 9, 0, 0, 0).getTime()/1000,
        end: new Date(2018, 0, 12, 9, 10, 0, 0).getTime()/1000,
        comment: 'Most important meal of the day',
        type: 'video'
    },
    {
        id: 9,
        fio: 'Иванова Александра',
        start: new Date(2018, 0, 12, 9, 30, 0, 0).getTime()/1000,
        end: new Date(2018, 0, 12, 9, 35, 0, 0).getTime()/1000,
        comment: 'Most important meal of the day',
        type: 'video'
    },
    {
        id: 10,
        fio: 'Иванова Александра',
        start: new Date(2018, 0, 12, 10, 0, 0, 0).getTime()/1000,
        end: new Date(2018, 0, 12, 10, 5, 0, 0).getTime()/1000,
        comment: 'Most important meal of the day',
        type: 'video'
    },
    {
        id: 11,
        fio: 'Иванова-Петрова Александра',
        start: new Date(2018, 0, 13, 9, 0, 0).getTime()/1000,
        end: new Date(2018, 0, 13, 9, 5, 0).getTime()/1000,
        comment: 'Most important meal of the day',
        type: 'video'
    },
    {
        id: 12,
        fio: 'Иванова Александра',
        start: new Date(2018, 0, 23, 8, 0, 0).getTime()/1000,
        end: new Date(2018, 0, 23, 8, 10, 0).getTime()/1000,
        comment: 'Most important meal of the day',
        type: 'video'
    },
    {
        id: 13,
        fio: 'Иванова Александра',
        start: new Date(2018, 0, 23, 8, 10, 0).getTime()/1000,
        end: new Date(2018, 0, 23, 8, 15, 0).getTime()/1000,
        comment: 'Most important meal of the day',
        type: 'video'
    },
    {
        id: 14,
        fio: 'Петров Виталий',
        start: new Date(2018, 0, 25, 8, 40, 0).getTime()/1000,
        end: new Date(2018, 0, 25, 8, 50, 0).getTime()/1000,
        comment: 'Most important meal of the day',
        type: 'video'
    },
];
const intervals = [{
    start: new Date(2018, 0, 23, 8, 0, 0).getTime()/1000,
    end: new Date(2018, 0, 23, 9, 0, 0).getTime()/1000,
},{
    start: new Date(2018, 0, 23, 10, 0, 0).getTime()/1000,
    end: new Date(2018, 0, 23, 11, 0, 0).getTime()/1000,
},{
    start: new Date(2018, 0, 24, 9, 0, 0).getTime()/1000,
    end: new Date(2018, 0, 24, 10, 0, 0).getTime()/1000,
},{
    start: new Date(2018, 0, 25, 8, 10, 0).getTime()/1000,
    end: new Date(2018, 0, 25, 9, 0, 0).getTime()/1000,
},{
    start: new Date(2018, 0, 25, 9, 30, 0).getTime()/1000,
    end: new Date(2018, 0, 25, 10, 0, 0).getTime()/1000,
}];

const schedules2 = [
    {
        date:1527022800,
        id_doc:2697,
        isEditable: '1',
        intervalOb: [],
        intervalEx: [],
        intervalTime: "0",
        type: "chat",
        isDayOff: "0"
    },
    {
        id: 12,
        isEditable: '0',
        intervalOb: [{
            start: new Date(2018, 0, 23, 8, 0, 0).getTime()/1000,
            end: new Date(2018, 0, 23, 9, 0, 0).getTime()/1000,
        },{
            start: new Date(2018, 0, 23, 10, 0, 0).getTime()/1000,
            end: new Date(2018, 0, 23, 11, 0, 0).getTime()/1000,
        }],
        intervalEx: [],
    },
    {
        id: 12,
        isEditable: '0',
        intervalOb: [{
            start: new Date(2018, 0, 24, 9, 0, 0).getTime()/1000,
            end: new Date(2018, 0, 24, 10, 0, 0).getTime()/1000,
        }],
        intervalEx: [],
    },
    {
        id: 13,
        isEditable: '1',
        intervalOb: [{
            start: new Date(2018, 0, 25, 8, 10, 0).getTime()/1000,
            end: new Date(2018, 0, 25, 9, 0, 0).getTime()/1000,
        },{
            start: new Date(2018, 0, 25, 9, 30, 0).getTime()/1000,
            end: new Date(2018, 0, 25, 10, 0, 0).getTime()/1000,
        }],
        intervalEx: [{
            start: new Date(2018, 0, 25, 10, 30, 0).getTime()/1000,
            end: new Date(2018, 0, 25, 11, 0, 0).getTime()/1000,
        }],
    },
];
const schedules1 = [
    {
        date:1527022800,
        id_doc:2697,
        isEditable: '1',
        intervalOb: [],
        intervalEx: [],
        intervalTime: "0",
        type: "chat",
        isDayOff: "0"
    },
    {
        id: 12,
        isEditable: '0',
        intervalOb: [{
            start: new Date(2018, 0, 15, 8, 30, 0).getTime()/1000,
            end: new Date(2018, 0, 15, 10, 0, 0).getTime()/1000,
        },{
            start: new Date(2018, 0, 15, 12, 0, 0).getTime()/1000,
            end: new Date(2018, 0, 15, 13, 30, 0).getTime()/1000,
        },{
            start: new Date(2018, 0, 15, 18, 0, 0).getTime()/1000,
            end: new Date(2018, 0, 15, 19, 0, 0).getTime()/1000,
        }],
        intervalEx: [],
    },
    {
        id: 12,
        isEditable: '0',
        intervalOb: [{
            start: new Date(2018, 0, 25, 8, 30, 0).getTime()/1000,
            end: new Date(2018, 0, 25, 10, 0, 0).getTime()/1000,
        },{
            start: (new Date(2018, 0, 25, 12, 0, 0)).getTime()/1000,
            end: new Date(2018, 0, 25, 13, 30, 0).getTime()/1000,
        },{
            start: new Date(2018, 0, 25, 18, 0, 0).getTime()/1000,
            end: new Date(2018, 0, 25, 19, 0, 0).getTime()/1000,
        }],
        intervalEx: [],
    },
    {
        id: 13,
        isEditable: '1',
        intervalOb: [{
            start: new Date(2018, 1, 8, 8, 30, 0).getTime()/1000,
            end: new Date(2018, 1, 8, 9, 30, 0).getTime()/1000,
        },{
            start: new Date(2018, 1, 8, 13, 0, 0).getTime()/1000,
            end: new Date(2018, 1, 8, 18, 30, 0).getTime()/1000,
        }],
        intervalEx: [{
            start: new Date(2018, 1, 8, 14, 30, 0).getTime()/1000,
            end: new Date(2018, 1, 8, 15, 0, 0).getTime()/1000,
        },{
            start: new Date(2018, 1, 8, 17, 0, 0).getTime()/1000,
            end: new Date(2018, 1, 8, 17, 30, 0).getTime()/1000,
        }],
    },
    {
        id: 15,
        isEditable: '0',
        intervalOb: [{
            start: new Date(2018, 1, 7, 8, 30, 0).getTime()/1000,
            end: new Date(2018, 1, 7, 9, 30, 0).getTime()/1000,
        },{
            start: new Date(2018, 1, 7, 13, 0, 0).getTime()/1000,
            end: new Date(2018, 1, 7, 18, 30, 0).getTime()/1000,
        }],
        intervalEx: [{
            start: new Date(2018, 1, 7, 17, 0, 0).getTime()/1000,
            end: new Date(2018, 1, 7, 17, 30, 0).getTime()/1000,
        }],
    },
];


const patientEvent = [
    {
        id: 6,
        fio: 'Иванова Александра',
        doctorType: "терапевт",
        start: new Date(2018, 5, 12, 10, 30, 0, 0).getTime()/1000,
        end: new Date(2018, 5, 12, 10, 50, 0, 0).getTime()/1000,
        type: 'video',
        comment: 'Pre-meeting meeting, to prepare for the meeting',
    },
    {
        id: 7,
        fio: 'Иванова Александра',
        doctorType: "терапевт какой-то там",
        start: new Date(2018, 5, 12, 11, 30, 0, 0).getTime()/1000,
        end: new Date(2018, 5, 12, 11, 50, 0, 0).getTime()/1000,
        type: 'voice',
        comment: 'Pre-meeting meeting, to prepare for the meeting',
    },
    {
        id: 7,
        fio: 'Иванова А Ф',
        doctorType: "терапевт",
        start: new Date(2018, 5, 12, 11, 50, 0, 0).getTime()/1000,
        end: new Date(2018, 5, 12, 11, 55, 0, 0).getTime()/1000,
        type: 'voice',
        comment: 'Pre-meeting meeting, to prepare for the meeting',
    },
    {
        id: 9,
        fio: 'Иванова Александра',
        doctorType: "терапевт какой-то там",
        start: new Date(2018, 5, 13, 11, 30, 0, 0).getTime()/1000,
        end: new Date(2018, 5, 13, 11, 50, 0, 0).getTime()/1000,
        type: 'voice',
        comment: 'Pre-meeting meeting, to prepare for the meeting',
    },
    {
        id: 8,
        fio: 'Иванов Александр',
        doctorType: "терапевт",
        start: new Date(2018, 5, 29, 10, 30, 0, 0).getTime()/1000,
        end: new Date(2018, 5, 29, 10, 50, 0, 0).getTime()/1000,
        type: 'chat',
        comment: 'Pre-meeting meeting, to prepare for the meeting',
    },
]

storiesOf('Calendar22', module)
    .add('default', () => (
        <div style={{backgroundColor: '#cccbcb', padding: 20}}>
            <BigCalendar receptionNum={23}
                         selectable

                         onSelectEvent={action('Receive 1 obj')}

                         min={new Date(new Date().setHours(9,0,0,0))}
                         max={new Date(new Date().setHours(23,0,0,0))}
                         step = {60}
                         events = {events1}
                         intervals={intervals}
                         defaultDate={new Date(2018, 0, 22)}
                         onPopoverClose={action('onPopoverClose')}
                         onPopoverEmail={action('onPopoverEmail')}
                         onGotoPatient={(id) => console.log('goto patient', id)}
                         onNavigate={(date) => console.log('navigate',date)}
            />
        </div>
    ))
    .add('editor', () => (
        <div style={{backgroundColor: '#cccbcb', padding: 20}}>
            <BigCalendar receptionNum={23}
                         selectable
                         editor

                         onMonthSelect={(date,schedule) => {
                             if(date.length !== 0) console.log(date, schedule)
                         }}
                         schedules={schedules1}
            />
        </div>
    ))
    .add('user', () => (
        <div style={{backgroundColor: '#cccbcb', padding: 20}}>
            <BigCalendar receptionNum={23}
                         isUser = {true}
                         
                         events={patientEvent}
            />
        </div>
    ));