import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalChangePassword from "../index";

storiesOf('CoachPersonalChangePassword', module)
    .add('CoachPersonalChangePassword', () => (
        <div>
            <CoachPersonalChangePassword/>
        </div>
    ))