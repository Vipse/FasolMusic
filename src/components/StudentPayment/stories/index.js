import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StudentPayment from "../index";

storiesOf('StudentPayment', module)
    .add('StudentPayment', () => (
        <div>
            <StudentPayment/>
        </div>
    ))