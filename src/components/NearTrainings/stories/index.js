import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TableNoHead from '../';

import {scheduleArr} from './mock-data'

storiesOf('TableNoHead', module)
    .add('TableNoHead', () => (
        <div>
            <TableNoHead data={scheduleArr} 
                onAdd = {() => console.log('eee')}
                onGoto = {(val) => console.log('[onGoto]',val)}
                onBegin = {(val) => console.log('[onBegin]',val)}
                onCancel = {(val) => console.log('[onCancel]',val)}
                />
        </div>
    ))