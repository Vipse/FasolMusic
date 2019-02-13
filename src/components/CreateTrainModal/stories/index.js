import React from 'react';
import {storiesOf} from '@storybook/react';
import CreateTrainModal from '../';


storiesOf('Modal - CreateTrainModal', module)
    .add('modal', () => (
        <div>
            <CreateTrainModal
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