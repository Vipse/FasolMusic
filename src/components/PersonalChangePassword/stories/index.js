import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PersonalChangePassword from "../index";

storiesOf('PersonalChangePassword', module)
    .add('PersonalChangePassword', () => (
        <div>
            <PersonalChangePassword/>
        </div>
    ))