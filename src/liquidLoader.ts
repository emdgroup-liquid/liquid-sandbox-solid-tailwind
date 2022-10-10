import { setAssetPath } from '@emdgroup-liquid/liquid/dist/components'
import { LdBadge } from '@emdgroup-liquid/liquid/dist/components/ld-badge'
import { LdBgCells } from '@emdgroup-liquid/liquid/dist/components/ld-bg-cells'
import { LdButton } from '@emdgroup-liquid/liquid/dist/components/ld-button'
import { LdIcon } from '@emdgroup-liquid/liquid/dist/components/ld-icon'
import { LdInputMessage } from '@emdgroup-liquid/liquid/dist/components/ld-input-message'
import { LdLabel } from '@emdgroup-liquid/liquid/dist/components/ld-label'
import { LdLink } from '@emdgroup-liquid/liquid/dist/components/ld-link'
import { LdLoading } from '@emdgroup-liquid/liquid/dist/components/ld-loading'
import { LdNotification } from '@emdgroup-liquid/liquid/dist/components/ld-notification'
import { LdProgress } from '@emdgroup-liquid/liquid/dist/components/ld-progress'
import { LdSidenav } from '@emdgroup-liquid/liquid/dist/components/ld-sidenav'
import { LdSidenavHeader } from '@emdgroup-liquid/liquid/dist/components/ld-sidenav-header'
import { LdSidenavHeading } from '@emdgroup-liquid/liquid/dist/components/ld-sidenav-heading'
import { LdSidenavNavitem } from '@emdgroup-liquid/liquid/dist/components/ld-sidenav-navitem'
import { LdSidenavSeparator } from '@emdgroup-liquid/liquid/dist/components/ld-sidenav-separator'
import { LdSidenavSlider } from '@emdgroup-liquid/liquid/dist/components/ld-sidenav-slider'
import { LdSidenavToggleOutside } from '@emdgroup-liquid/liquid/dist/components/ld-sidenav-toggle-outside'
import { LdSrOnly } from '@emdgroup-liquid/liquid/dist/components/ld-sr-only'
import { LdStep } from '@emdgroup-liquid/liquid/dist/components/ld-step'
import { LdStepper } from '@emdgroup-liquid/liquid/dist/components/ld-stepper'
import { LdTypo } from '@emdgroup-liquid/liquid/dist/components/ld-typo'
import '@emdgroup-liquid/liquid/dist/css/liquid.global.css'

// Load liquid components.
setAssetPath(window.location.origin)

// TODO: load components lazily where needed.
;[
  LdBgCells,
  LdBadge,
  LdButton,
  LdIcon,
  LdInputMessage,
  LdLabel,
  LdLoading,
  LdLink,
  LdNotification,
  LdProgress,
  LdSidenav,
  LdSidenavHeader,
  LdSidenavHeading,
  LdSidenavNavitem,
  LdSidenavSeparator,
  LdSidenavSlider,
  LdSidenavToggleOutside,
  LdSrOnly,
  LdStepper,
  LdStep,
  LdTypo,
]
