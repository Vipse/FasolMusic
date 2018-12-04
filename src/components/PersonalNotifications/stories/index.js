import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PersonalNotifications from "../index";

storiesOf('PersonalNotifications', module)
    .add('PersonalNotifications', () => (
        <div>
            <PersonalNotifications/>
        </div>
    ))