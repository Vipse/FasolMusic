import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import { LocaleProvider } from 'antd'
import ruRU from 'antd/lib/locale-provider/ru_RU';
import 'moment/locale/ru';
import "./styles/fonts.css"
import "./icon/style.css"
import './index.css';
import '../node_modules/antd/dist/antd.css'
import '../node_modules/react-scrollbar/dist/css/scrollArea.css'

import { CookiesProvider } from 'react-cookie';

import { store, history } from './store'

import Root from './containers/Root'
import registerServiceWorker from './registerServiceWorker';

const rootElement = document.getElementById('root');

ReactDOM.render(
    <CookiesProvider>
        <LocaleProvider locale={ruRU}>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Root/>
                </ConnectedRouter>
            </Provider>
        </LocaleProvider>
    </CookiesProvider>,
    rootElement);
registerServiceWorker();
