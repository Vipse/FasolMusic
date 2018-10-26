import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalProfile from "../index";

storiesOf('CoachPersonalProfile', module)
    .add('CoachPersonalProfile', () => (
        <div>
            <CoachPersonalProfile/>
        </div>
    ))