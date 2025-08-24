import React from "react";
import {createRoot} from "react-dom/client";


import App from "./pages/admin/App";

import '../assets/css/bootstrap.css';
import '../assets/css/admin.css';


document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('syno-wp-react-admin') === null || typeof document.getElementById('syno-wp-react-admin') === 'undefined') {
        console.log('Root element not found');
        return;
    }
    const root = createRoot(document.getElementById('syno-wp-react-admin'));
    root.render(<App />);
    console.log('Admin React App rendered');
});
