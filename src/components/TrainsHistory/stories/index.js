import React from 'react';
import { storiesOf } from '@storybook/react';
import TrainsHistory from '../';

import {historyArr} from './mock-data'

storiesOf('TrainsHistory', module)
    .add('TrainsHistory', () => (
        <div>
            <TrainsHistory data={historyArr}
                        onGotoChat = {(id) => console.log(id)}/>
        </div>
    ))