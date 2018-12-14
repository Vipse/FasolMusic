import React from 'react';
import { storiesOf } from '@storybook/react';
import RecordTrainCarousel from '../';
import {timeIntervals} from './mock-data'

storiesOf('RecordTrainCarousel', module)
    .add('RecordTrainCarousel', () => (
        <div>
            <RecordTrainCarousel
            	intervals={timeIntervals}
                newVisitVisible = {(a)=>console.log("addNewDoctorVisible", a)}
             />
        </div>
    ))