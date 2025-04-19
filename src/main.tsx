import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Espera o DOM estar completamente carregado
window.onload = () => {
  const rootElement = document.getElementById('app')

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  } else {
    console.error('Elemento com id "app" não encontrado!')
  }
}
