import React from 'react';
import {storiesOf} from '@storybook/react';
import PaymentEditModal from '../';


storiesOf('Modal - PaymentEditModal', module)
    .add('modal', () => (
        <div>
            <PaymentEditModal
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