import React from 'react';
import {storiesOf} from '@storybook/react';
import PromoVideoModal from '../';


storiesOf('Modal - PromoVideoModal', module)
    .add('modal', () => (
        <div>
            <PromoVideoModal
                visible={true}
            />
        </div>
    ));