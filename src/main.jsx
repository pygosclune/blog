import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { NextUIProvider } from '@nextui-org/react'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background w-screen h-screen p-8 flex items-start justify-center">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>,
)
