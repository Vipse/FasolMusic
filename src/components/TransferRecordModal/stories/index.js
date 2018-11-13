import React from 'react';
import {storiesOf} from '@storybook/react';
import TransferRecordModal from '../';


storiesOf('Modal - TransferRecordModal', module)
    .add('modal', () => (
        <div>
            <TransferRecordModal
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