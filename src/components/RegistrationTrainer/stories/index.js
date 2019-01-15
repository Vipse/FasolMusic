import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MemoryRouter } from 'react-router';

import Login from '../';

storiesOf('Login', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('Login', () => (
        <div>
            <Login onSubmit={action('Submit values:')}/>
        </div>
    ))