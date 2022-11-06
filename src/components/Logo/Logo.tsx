import '@emdgroup-liquid/liquid/dist/css/ld-typo.css'
import { useNavigate } from '@solidjs/router'
import { type JSX, type Component } from 'solid-js'

interface LogoProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  to?: string
  slot?: string
  style?: JSX.CSSProperties
  variant?: HTMLLdTypoElement['variant']
}

const Logo: Component<LogoProps> = (props) => {
  const navigate = useNavigate()

  return (
    <div
      role="banner"
      class={props.class}
      classList={{
        ...props.classList,
        [`ld-typo ld-typo--${props.variant || 'b5'}`]: true,
      }}
      slot={props.slot}
      style={{ ...props.style, 'line-height': '0.66' }}
    >
      <a
        onClick={(ev) => {
          ev.preventDefault()
          navigate(props.to || '/')
        }}
        class="contents cursor-pointer"
      >
        <abbr class="text-vc" aria-label="Uxer Experience, Stragegy and Design">
          UXSD
        </abbr>{' '}
        <span aria-label="To-Do" class="text-vy whitespace-nowrap">
          TO&hairsp;DO
        </span>
      </a>
    </div>
  )
}

export default Logo
