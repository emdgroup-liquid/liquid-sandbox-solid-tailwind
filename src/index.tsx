/* @refresh reload */
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'

import { setAssetPath } from '@emdgroup-liquid/liquid/dist/components'

import '@emdgroup-liquid/liquid/dist/css/liquid.global.css'

import './index.css'
import App from './App'

// Load liquid components.
setAssetPath(window.location.origin)
const modules = await Promise.all([
  import('@emdgroup-liquid/liquid/dist/components/ld-bg-cells'),
  import('@emdgroup-liquid/liquid/dist/components/ld-breadcrumbs'),
  import('@emdgroup-liquid/liquid/dist/components/ld-crumb'),
  import('@emdgroup-liquid/liquid/dist/components/ld-button'),
  import('@emdgroup-liquid/liquid/dist/components/ld-checkbox'),
  import('@emdgroup-liquid/liquid/dist/components/ld-icon'),
  import('@emdgroup-liquid/liquid/dist/components/ld-input'),
  import('@emdgroup-liquid/liquid/dist/components/ld-input-message'),
  import('@emdgroup-liquid/liquid/dist/components/ld-label'),
  import('@emdgroup-liquid/liquid/dist/components/ld-link'),
  import('@emdgroup-liquid/liquid/dist/components/ld-notification'),
  import('@emdgroup-liquid/liquid/dist/components/ld-option'),
  import('@emdgroup-liquid/liquid/dist/components/ld-option-internal'),
  import('@emdgroup-liquid/liquid/dist/components/ld-select-popper'),
  import('@emdgroup-liquid/liquid/dist/components/ld-select'),
  import('@emdgroup-liquid/liquid/dist/components/ld-stepper'),
  import('@emdgroup-liquid/liquid/dist/components/ld-step'),
  import('@emdgroup-liquid/liquid/dist/components/ld-tooltip'),
  import('@emdgroup-liquid/liquid/dist/components/ld-tooltip-popper'),
  import('@emdgroup-liquid/liquid/dist/components/ld-typo'),
])
modules.forEach((module) => {
  module.defineCustomElement()
})

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
)
