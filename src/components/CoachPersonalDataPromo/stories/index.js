import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalDataPromo from '../';

const profileCoach = {
    fio: "Иванова Иван Иванович",
    phone: "+375 29 111 11 11",
    email: "test@test.com",
    country: "Беларусь"
};

storiesOf('CoachPersonalDataPromo', module)
    .add('CoachPersonalDataPromo', () => (
        <div>
            <CoachPersonalDataPromo
                profileCoach={profileCoach}
            />
        </div>
    ))