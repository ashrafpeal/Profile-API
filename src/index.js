import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const root = createRoot(document.getElementById('syno_wp_react'));
root.render(<App />);
// This code is the entry point for the React application, rendering the App component into the root element of the HTML.