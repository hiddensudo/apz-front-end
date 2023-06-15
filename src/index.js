import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Замінити HashRouter на BrowserRouter
import { I18nextProvider } from 'react-i18next';
import i18n from './localisation/i18n'; // Файл з налаштуваннями ініціалізації react-i18next
import App from './App';

ReactDOM.render(
    <BrowserRouter>
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
