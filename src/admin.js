import React from "react";
import ReactDom from "react-dom";

import App from "./pages/admin/App";

import '../assets/css/admin.css';


document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('syno-wp-react-admin') === null || typeof document.getElementById('syno-wp-react-admin') === 'undefined') {
        console.log('Root element not found');
        return;
    }
    ReactDOM.render(<App />, document.getElementById('syno-wp-react-admin'));
    console.log('Admin React App rendered');
});
