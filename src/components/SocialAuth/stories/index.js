import React from 'react';
import { storiesOf } from '@storybook/react';
import SocialAuth from '../';

storiesOf('SocialAuth', module)
    .add('SocialAuth', () => (
        <div>
            <SocialAuth/>
        </div>
    ))