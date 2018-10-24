import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalDataSkill from '../';

const profileStudent = {
    fio: "Иванова Иван Иванович",
    phone: "+375 29 111 11 11",
    email: "test@test.com",
    country: "Беларусь"
};

storiesOf('CoachPersonalDataSkill', module)
    .add('CoachPersonalDataSkill', () => (
        <div>
            <CoachPersonalDataSkill
                profileStudent={profileStudent}
            />
        </div>
    ))