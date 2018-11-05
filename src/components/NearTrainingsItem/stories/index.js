import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TableNoHeadItem from '../';

storiesOf('TableNoHeadItem', module)
    .add('TableNoHeadItem', () => (
        <div>
            <TableNoHeadItem 
                name="Иванова А. К." 
                infoText="Консультация по результатам анализа крови." 
                img="https://www.proza.ru/pics/2017/06/03/1990.jpg" 
                time={Date.now()}
                type='chat1'
                title='Сообщения'
                onBegin={()=> console.log('begin')}
                onCancel = {() => console.log('cancel')}
                onGoto = {() => console.log('onGoto')}
            />
        </div>
    ))