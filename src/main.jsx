// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { UserProvider } from './contexts/UserContext.jsx'; // ✅ import this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider> {/* ✅ wrap App with provider */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
