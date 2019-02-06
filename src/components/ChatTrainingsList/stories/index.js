import React from 'react';
import { storiesOf } from '@storybook/react';
import ChatTrainingsList from '../';

import {scheduleArr} from './mock-data'

storiesOf('ChatTrainingsList', module)
    .add('ChatTrainingsList', () => (
        <div>
            <ChatTrainingsList data={scheduleArr}
                onAdd = {() => console.log('eee')}
                onGoto = {(val) => console.log('[onGoto]',val)}
                onBegin = {(val) => console.log('[onBegin]',val)}
                onCancel = {(val) => console.log('[onCancel]',val)}
                />
        </div>
    ))