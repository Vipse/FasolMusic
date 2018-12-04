import React from 'react';
import { storiesOf } from '@storybook/react';
import PersonalSuggestions from "../index";

storiesOf('PersonalSuggestions', module)
    .add('PersonalSuggestions', () => (
        <div>
            <PersonalSuggestions/>
        </div>
    ))