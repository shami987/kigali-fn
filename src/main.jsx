// Wrap your App component with the Provider to make the Redux store available to all components.

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your Tailwind CSS import
import App from './App';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './app/store';    // Import your Redux store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}> {/* Wrap App with Provider */}
            <App />
        </Provider>
    </React.StrictMode>
);