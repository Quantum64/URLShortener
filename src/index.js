import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import compression from './compression'

const target = window.location.pathname.substr(1);
if (target.length > 0) {
    let url = compression.expand(decodeURI(target))
    if (!compression.validate(url)) {
        alert("Could not redirect you to a valid URL.");
        window.location.replace(window.location.origin);
    } else {
        window.location.replace(url);
    }
} else {
    ReactDOM.render(<App />, document.getElementById('root'));
}

