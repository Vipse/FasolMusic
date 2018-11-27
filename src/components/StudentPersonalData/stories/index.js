import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StudentPersonalData from '../';

storiesOf('StudentPersonalData', module)
    .add('StudentPersonalData', () => (
        <div>
            <StudentPersonalData
                secondname="Иванова" 
                firstname="Иван" 
                patronymic="Иванович" 
                phone="+375 29 111 11 11" 
                email="test@test.com"
            />
        </div>
    ))