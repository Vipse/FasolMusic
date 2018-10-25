import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPersonalSuggestions from "../index";

storiesOf('CoachPersonalSuggestions', module)
    .add('CoachPersonalSuggestions', () => (
        <div>
            <CoachPersonalSuggestions/>
        </div>
    ))