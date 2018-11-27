import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PersonalDataTime from '../';

const profileCoach = {
    fio: "Иванова Иван Иванович",
    phone: "+375 29 111 11 11",
    email: "test@test.com",
    country: "Беларусь"
};

storiesOf('PersonalDataTime', module)
    .add('PersonalDataTime', () => (
        <div>
            <PersonalDataTime
                profile={profileCoach}
            />
        </div>
    ))