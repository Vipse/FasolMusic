import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalContactItem from '../';

const profileDoctor = {
    fio: "Иванова Иван Иванович",
    phone: "+375 29 111 11 11",
    email: "test@test.com",
    country: "Беларусь"
};

storiesOf('CoachPersonalContactItem', module)
    .add('CoachPersonalContactItem', () => (
        <div>
            <CoachPersonalContactItem
                profileDoctor={profileDoctor}
            />
        </div>
    ))