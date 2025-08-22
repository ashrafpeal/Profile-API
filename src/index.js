import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

// add css file
import '../assets/css/main.css';

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('syno_wp_react') === null || typeof document.getElementById('syno_wp_react') === 'undefined') {
        console.log('Root element not found');
        return;
    }
    ReactDOM.render(<App />, document.getElementById('syno_wp_react'));
});
// This code is the entry point for the React application, rendering the App component into the root element of the HTML.