import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

window.addEventListener('error', (e: any) => {
 console.error('[GLOBAL ERROR]', e.message, e.filename, e.lineno)
})

window.addEventListener('unhandledrejection', (e: any) => {
 console.error('[UNHANDLED]', e.reason)
})

try {
 const rootEl = document.getElementById('root')
 if (!rootEl) {
 document.body.innerHTML = '<pre style="color:red;padding:40px;font-size:16px;">ERROR: No #root element found in HTML</pre>'
 throw new Error('No #root element')
 }
 ReactDOM.createRoot(rootEl).render(
 <React.StrictMode>
 <App />
 </React.StrictMode>
 )
 console.log('[MOUNT OK] App rendered successfully')
} catch (err: any) {
 console.error('[MOUNT FAIL]', err.message, err.stack)
 document.body.innerHTML = '<pre style="color:red;padding:40px;font-size:16px;">[MOUNT FAIL] ' + err.message + '\n\n' + (err.stack || '') + '</pre>'
}
