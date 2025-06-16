import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ResetSession from './ResetSession';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ResetSession>
      <App />
    </ResetSession>
  </React.StrictMode>
);
