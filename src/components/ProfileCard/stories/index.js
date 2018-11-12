import React from 'react';
import { storiesOf } from '@storybook/react';
import DoctorProfileCard from '../';

storiesOf('DoctorProfileCard', module)
    .add('sort / not short', () => (
        <div>
            <strong>default: </strong>
            <div style={{border:'dashed 1px', width: 342, display: 'inline-block',}}>
            <DoctorProfileCard img="https://www.proza.ru/pics/2017/06/03/1990.jpg"
                               name='Иванов Иван Иванович'
                               specialty={["терапевт","хирург","Массажист"]}
                               rateValue={3.8}
                               timesRated={57}/>
            </div>

            <strong style={{marginLeft: 50}}>short: </strong>
            <div style={{border:'dashed 1px', width: 172, display: 'inline-block',}}>
            <DoctorProfileCard img="https://www.proza.ru/pics/2017/06/03/1990.jpg"
                               name='Иванов Иван Иванович'
                               specialty={["терапевт","хирург"]}
                               rateValue={4.4}
                               timesRated={34}
                               online
                               short/>
            </div>
        </div>
    ));