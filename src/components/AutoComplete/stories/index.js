import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AutoComplete from '../';

import {studentsArr} from './mock-data'
storiesOf('AutoComplete', module)
    .add('Search', () => (
        <div>
           <AutoComplete
              data={studentsArr}
              onAdd = {(id) => console.log('add',id, name)}
              onGoto = {(id) => console.log('goto',id)}
		    />
        </div>
    ))
