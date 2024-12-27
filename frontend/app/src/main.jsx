import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

function registerServiceWorker() {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/serviceWorker.js')
  .then(registration => {
    if (registration.active) {
      console.log('Service worker active');
    }
  })
  .catch(error => {
    console.error("Failed to register service worker");
  })
}

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)