import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalDataInfo from '../';

const profileStudent = {
    fio: "Иванова Иван Иванович",
    phone: "+375 29 111 11 11",
    email: "test@test.com",
    country: "Беларусь"
};

storiesOf('CoachPersonalDataInfo', module)
    .add('CoachPersonalDataInfo', () => (
        <div>
            <CoachPersonalDataInfo
                profileStudent={profileStudent}
            />
        </div>
    ))