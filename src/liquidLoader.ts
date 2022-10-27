import { setAssetPath } from '@emdgroup-liquid/liquid/dist/components'
import '@emdgroup-liquid/liquid/dist/css/liquid.global.css'
import { defineCustomElements } from '@emdgroup-liquid/liquid/dist/loader/'

setAssetPath(window.location.origin)
defineCustomElements()
