import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalNotifications from "../index";

const profileDoctor = {
    notifications: {
        email: ["Тип1", "Тип2", "Тип3", "Тип4"],
        phone: ["Тип1", "Тип2", "Тип3", "Тип4", "Тип5", "Тип6"]
    }
}

storiesOf('CoachPersonalNotifications', module)
    .add('CoachPersonalNotifications', () => (
        <div>
            <CoachPersonalNotifications
                profileDoctor={profileDoctor}
            />
        </div>
    ))