import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AddNewPatient from '../';

import {studentsArr} from './mock-data'

storiesOf('Modal - AddNewPatient', module)
    .add('modal', () => (
        <div>
            <AddNewPatient data={studentsArr} visible={true} onAdd={(obj)=>console.log('eee',obj)}/>
        </div>
    ));
