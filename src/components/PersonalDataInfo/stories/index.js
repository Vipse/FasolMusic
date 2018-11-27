import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PersonalDataInfo from '../';

const profileCoach = {
    fio: "Иванова Иван Иванович",
    phone: "+375 29 111 11 11",
    email: "test@test.com",
    country: "Беларусь"
};

storiesOf('PersonalDataInfo', module)
    .add('PersonalDataInfo', () => (
        <div>
            <PersonalDataInfo
                profile={profileCoach}
            />
        </div>
    ))