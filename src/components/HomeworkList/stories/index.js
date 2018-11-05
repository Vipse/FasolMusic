import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import HistoryReceptionsTabs from '../';

import {historyArr} from './mock-data'

storiesOf('HistoryReceptionsTabs', module)
    .add('HistoryReceptionsTabs', () => (
        <div>
            <HistoryReceptionsTabs data={historyArr} 
                                    onGoto={(id) => console.log(id)}
                                    onGotoChat = {(id) => console.log(id)}
            />
        </div>
    ))