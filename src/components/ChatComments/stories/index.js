import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ChatComments from '../';

storiesOf('ChatComments', module)
    .add('default', () => (
        <div>
            <ChatComments 
                comments="Жалоба пациента или Комментарий. Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Вдали от всех живут они в буквенных домах." 
                files={[
                    {
                        btnText: 'Прикрепленный файл с длинным предлинным названием.doc',
                        href: '#',
                    },
                    {
                        btnText: 'Прикрепленный файл с длинным предлинным названием.doc',
                        href: '#',
                    },
                    {
                        btnText: 'Прикрепленный файл с длинным предлинным названием.doc',
                        href: '#',
                    },
                    {
                        btnText: 'Прикрепленный файл с длинным предлинным названием.doc',
                        href: '#',
                    }
                ]}
            />
            <ChatComments 
                comments="" 
                files={[]}
            />
        </div>
    ))