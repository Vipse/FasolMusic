import React from 'react';
import {storiesOf} from '@storybook/react';
import RecordCompleteModal from '../';


storiesOf('Modal - RecordCompleteModal', module)
    .add('modal', () => (
        <div>
            <RecordCompleteModal
                visible={true}
                userName='Петров-Иванов Александр Константинович'
                date="21 декабря"
                time="14:22"
                onSave = {(obj) => console.log(obj)}
                doctorName = "Окулистов Педиатр Ортопедович"
                type = "voice"
            />
        </div>
    ));