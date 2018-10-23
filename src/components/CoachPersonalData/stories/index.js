import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalData from '../';

storiesOf('CoachPersonalData', module)
    .add('CoachPersonalData', () => (
        <div>
            <CoachPersonalData
                secondname="Иванова" 
                firstname="Иван" 
                patronymic="Иванович" 
                phone="+375 29 111 11 11" 
                email="test@test.com" 
                oldPassword="1111" 
                newPassword="" 
            />
        </div>
    ))