import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import the consolidated app styles
// Keep legacy index.css (has some global rules) and then load consolidated styles
import './index.css'
import './views/styles/main.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
