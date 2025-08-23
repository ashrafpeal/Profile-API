import React from 'react';
import ReactDOM from 'react-dom';

import App from './pages/frontend/App';

// add css file
import '../assets/css/frontend.css';

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('syno-wp-react-frontend') === null || typeof document.getElementById('syno-wp-react-frontend') === 'undefined') {
        console.log('Root element not found');
        return;
    }
    ReactDOM.render(<App />, document.getElementById('syno-wp-react-frontend'));
    console.log('Frontend React App rendered');
});