import React from 'react';
import {storiesOf} from '@storybook/react';
import NewVisitModalPage from '../';

const students = [{
        name: 'name1'
    }, {
        name: 'name2'
    }, {
        name: 'name3'
    },];

storiesOf('Modal - NewVisitModalPage', module)
    .add('modal', () => (
        <div>
            <NewVisitModalPage visible={true}
                               userName='Петров-Иванов Александр Константинович'
                               defaultDate={new Date(2018, 1, 4, 8, 10)}
                               students={students}
                               onSave={(obj) => console.log(obj)}
                               availableArea={[
                                   {
                                       from : 1395985227000,
                                       to   : 1395990227000,
                                       type: "chat"
                                   },
                                   {
                                       from : 1396005227000,
                                       to   : 1396010327000,
                                       type: "voice"
                                   },
                                   {
                                       from : 1396020027000,
                                       to   : 1396025327000,
                                       type: "video"
                                   }
                               ]}
            />
        </div>
    ));
