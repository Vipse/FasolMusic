import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalNotifications from "../index";

const profileCoach = {
    notifications: {
        email: ["Тип 1", "Тип 2", "Тип 3", "Тип 4"],
        phone: ["Тип 1", "Тип 2", "Тип 3", "Тип 4", "Тип 5", "Тип 6"]
    }
}

storiesOf('CoachPersonalNotifications', module)
    .add('CoachPersonalNotifications', () => (
        <div>
            <CoachPersonalNotifications
                profileCoach={profileCoach}
            />
        </div>
    ))