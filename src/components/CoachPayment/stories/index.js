import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CoachPayment from "../index";
import {filesArr} from "../../CoachPayment/stories/mock-data";

storiesOf('CoachPayment', module)
    .add('CoachPayment', () => (
        <div>
            <CoachPayment
                filesList={filesArr}
            />
        </div>
    ))