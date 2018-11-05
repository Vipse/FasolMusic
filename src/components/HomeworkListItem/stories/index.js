import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import HistoryReceptionsItem from '../';

import {filesArr} from './mock-data'

storiesOf('HistoryReceptionsItem', module)
    .add('HistoryReceptionsItem', () => (
        <div>
            <HistoryReceptionsItem 
                name="Иванова А. К."
                date="15.09.2017"
                time="15:00-16:00"
                type='chat1'
                title='Чат'
                diagnostic='Сахарный диабет'
                comments='Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
                price='112 руб.'
                conclusion='Lorem ipsum dolor sit amet, consectetuer adipiscing elit'
                conclusionDownloadName='Заключение 252525.pdf'
                review='Lorem ipsum dolor sit amet, consectetuer...'

                onGoto = {(id) => console.log(id)}
                onGotoChat = {(id) => console.log('toChat',id)}
                data={filesArr}
            />
        </div>
    ))