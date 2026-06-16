// frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // O tus estilos principales

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Deja a <App /> sola, SIN <BrowserRouter> aquí, porque ya lo pusimos dentro de App.tsx */}
    <App />
  </React.StrictMode>,
)