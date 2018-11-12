import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PatientTable from '../';
import moment from "moment/moment";

import {patientArr} from './mock-data'

storiesOf('PatientTable', module)
    .add('PatientTable', () => (
        <div>
            <PatientTable data={patientArr}
                        onAdd={() => console.log('eee')}
                        onGoto={(id) => console.log('goto', id)}
                        onSearch={(a) => console.log(a)}
                        onNewMessage={(obj) => console.log('e ',obj)}
                        onNewVisit={(obj) => console.log('e ',obj)}
                        onDelete={(obj) => console.log('e ',obj)}
                        onChangeDate={(curDate) => { //в продакшне фун-ия передача на верх ( в Patients )
                            let m = moment(curDate);
                            console.log("currentTime", m.format('MMMM Do YYYY, h:mm:ss a'))}}

                        availableArea={[
                            {
                                from : 1395985227000,
                                to   : 1395990227000
                            },
                            {
                                from : 1396005227000,
                                to   : 1396010327000
                            },
                            {
                                from : 1396020027000,
                                to   : 1396025327000
                            }
                        ]}  />
        </div>
    ))
