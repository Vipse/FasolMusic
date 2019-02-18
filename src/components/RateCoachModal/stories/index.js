import React from 'react';
import { storiesOf } from '@storybook/react';
import RateCoachModal from '../';

storiesOf('Modal - RateCoachModal', module)
    .add('modal', () => (
        <div>
            <RateCoachModal visible={true} onComplete={(e) => console.log(e)}/>
        </div>
    ));