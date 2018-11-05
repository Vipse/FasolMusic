import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPayment from "../index";

storiesOf('CoachPayment', module)
    .add('CoachPayment', () => (
        <div>
            <CoachPayment/>
        </div>
    ))