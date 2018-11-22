import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PersonalDataContact from '../';

const profileCoach = {
    fio: "Иванова Иван Иванович",
    phone: "+375 29 111 11 11",
    email: "test@test.com",
    country: "Беларусь"
};

storiesOf('PersonalDataContact', module)
    .add('PersonalDataContact', () => (
        <div>
            <PersonalDataContact
                profile={profileCoach}
            />
        </div>
    ))