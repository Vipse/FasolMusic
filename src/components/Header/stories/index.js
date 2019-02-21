import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Header from '../';

import {notificationArr, patientsArr} from './mock-data'

storiesOf('Header', module)
    .add('Header', () => (
        <div>
            <Header 
                content="15.09.2017"
                data={patientsArr}
                notifications = {notificationArr}
                getNotifId = {(id) => console.log('notif id:', id)}
                getNotifications={() => console.log('getNotifications')}
                onAdd = {(id, name) => console.log('add',id, name)}
                onGoto = {(id) => console.log('goto',id)}
                findName = {(name) => console.log(name)}
                logout={() => alert()}
            />

            <Header 
                content="15.09.2017"
                data={patientsArr}
                notifications = {notificationArr}
                getNotifId = {(id) => console.log('notif id:', id)}
                getNotifications={() => console.log('getNotifications')}
                onAdd = {(id, name) => console.log('add',id, name)}
                onGoto = {(id) => console.log('goto',id)}
                findName = {(name) => console.log(name)}
                logout={() => alert()}
                onEmergCall={() => console.log('onEmergCall')}
                isUser={true}
            />
        </div>
    ))