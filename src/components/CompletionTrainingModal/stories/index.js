import React from 'react';
import { storiesOf } from '@storybook/react';
import CompletionTrainingModal from '../';

storiesOf('Modal - CompletionTrainingModal', module)
    .add('modal', () => (
        <div>
            <CompletionTrainingModal visible={true} onComplete={(e) => console.log(e)}/>
        </div>
    ));