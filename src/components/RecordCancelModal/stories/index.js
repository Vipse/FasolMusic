import React from 'react';
import {storiesOf} from '@storybook/react';
import RecordCancelModal from '../';


storiesOf('Modal - RecordCancelModal', module)
    .add('modal', () => (
        <div>
            <RecordCancelModal
                visible={true}
                userName='Петров-Иванов Александр Константинович'
                date={new Date(2018,1,4,8,10)}
                isChoosebleTime={false}
                onSave = {(obj) => console.log(obj)}
                doctorName = "Окулистов Педиатр Ортопедович"
                type = "voice"
            />
        </div>
    ));