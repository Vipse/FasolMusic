import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StudentPersonalProfile from "../index";

storiesOf('StudentPersonalProfile', module)
    .add('StudentPersonalProfile', () => (
        <div>
            <StudentPersonalProfile/>
        </div>
    ))