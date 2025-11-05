import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SleepScheduleProvider } from './SleepScheduleContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SleepScheduleProvider>
      <App />
    </SleepScheduleProvider>
  </StrictMode>,
)
