import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './pages/frontend/App';

// add css file
import '../assets/css/bootstrap.css';
import '../assets/css/frontend.css';

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('syno-wp-react-frontend') === null || typeof document.getElementById('syno-wp-react-frontend') === 'undefined') {
        console.log('Root element not found');
        return;
    }
    const root = createRoot(document.getElementById('syno-wp-react-frontend'));
    root.render(<App />);
    console.log('Frontend React App rendered');
});