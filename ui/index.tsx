import React from 'react';
import { render } from 'react-dom';
import App from '@ui/App';
import { Provider } from 'react-redux';
import store from '@app/store/store';
import ConfigContext from '@ui/contexts/ConfigContext';

if(module.hot)
    module.hot.accept();

const root = document.getElementById('app');

render(
    <Provider store={store}>
        <ConfigContext>
            <App />
        </ConfigContext>
    </Provider>, root);
