import React from 'react';
import {storiesOf} from '@storybook/react';
import SendSuggestionsModal from '../';


storiesOf('Modal - SendSuggestionsModal', module)
    .add('modal', () => (
        <div>
            <SendSuggestionsModal
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