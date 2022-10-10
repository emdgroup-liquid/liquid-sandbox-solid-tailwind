/* @refresh reload */
import App from './App'
import './index.css'
import './liquidLoader'
import { Router } from '@solidjs/router'
import { render } from 'solid-js/web'

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
)
