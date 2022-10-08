/* @refresh reload */
import App from './App'
import './index.css'
import { setAssetPath } from '@emdgroup-liquid/liquid/dist/components'
import '@emdgroup-liquid/liquid/dist/css/liquid.global.css'
import { Router } from '@solidjs/router'
import { render } from 'solid-js/web'

// Load liquid components.
setAssetPath(window.location.origin)
// TODO: load components lazily where needed.
const modules = await Promise.all([
  import('@emdgroup-liquid/liquid/dist/components/ld-bg-cells'),
  import('@emdgroup-liquid/liquid/dist/components/ld-breadcrumbs'),
  import('@emdgroup-liquid/liquid/dist/components/ld-crumb'),
  import('@emdgroup-liquid/liquid/dist/components/ld-badge'),
  import('@emdgroup-liquid/liquid/dist/components/ld-button'),
  import('@emdgroup-liquid/liquid/dist/components/ld-checkbox'),
  import('@emdgroup-liquid/liquid/dist/components/ld-icon'),
  import('@emdgroup-liquid/liquid/dist/components/ld-input'),
  import('@emdgroup-liquid/liquid/dist/components/ld-input-message'),
  import('@emdgroup-liquid/liquid/dist/components/ld-label'),
  import('@emdgroup-liquid/liquid/dist/components/ld-loading'),
  import('@emdgroup-liquid/liquid/dist/components/ld-link'),
  import('@emdgroup-liquid/liquid/dist/components/ld-notification'),
  import('@emdgroup-liquid/liquid/dist/components/ld-option'),
  import('@emdgroup-liquid/liquid/dist/components/ld-option-internal'),
  import('@emdgroup-liquid/liquid/dist/components/ld-progress'),
  import('@emdgroup-liquid/liquid/dist/components/ld-select-popper'),
  import('@emdgroup-liquid/liquid/dist/components/ld-select'),
  import('@emdgroup-liquid/liquid/dist/components/ld-sidenav'),
  import('@emdgroup-liquid/liquid/dist/components/ld-sidenav-header'),
  import('@emdgroup-liquid/liquid/dist/components/ld-sidenav-heading'),
  import('@emdgroup-liquid/liquid/dist/components/ld-sidenav-navitem'),
  import('@emdgroup-liquid/liquid/dist/components/ld-sidenav-separator'),
  import('@emdgroup-liquid/liquid/dist/components/ld-sidenav-slider'),
  import('@emdgroup-liquid/liquid/dist/components/ld-sidenav-toggle-outside'),
  import('@emdgroup-liquid/liquid/dist/components/ld-sr-only'),
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
