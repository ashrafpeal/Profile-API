import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './pages/frontend/App';

// add css file
import '../assets/css/bootstrap.css';
import '../assets/css/frontend.css';

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('profile-api-frontend') === null || typeof document.getElementById('profile-api-frontend') === 'undefined') {
        console.log('Root element not found');
        return;
    }
    const root = createRoot(document.getElementById('profile-api-frontend'));
    root.render(<App />);
    // console.log('Frontend React App rendered');
});