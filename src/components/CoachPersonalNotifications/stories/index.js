import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalNotifications from "../index";

storiesOf('CoachPersonalNotifications', module)
    .add('CoachPersonalNotifications', () => (
        <div>
            <CoachPersonalNotifications/>
        </div>
    ))