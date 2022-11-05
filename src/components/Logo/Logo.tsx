import { useNavigate } from '@solidjs/router'
import { type JSX, type Component } from 'solid-js'

interface LogoProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  href?: string
  slot?: string
  style?: JSX.CSSProperties
  tag?: HTMLLdTypoElement['tag']
  variant?: HTMLLdTypoElement['variant']
}

const Logo: Component<LogoProps> = (props) => {
  const navigate = useNavigate()

  return (
    <ld-typo
      role="banner"
      class={props.class}
      classList={props.classList}
      slot={props.slot}
      style={props.style}
      tag={props.tag || 'h1'}
      variant={props.variant || 'b5'}
    >
      <a
        onClick={() => navigate(props.href || '/')}
        class="contents cursor-pointer"
      >
        <abbr class="text-vc" aria-label="Uxer Experience, Stragegy and Design">
          UXSD
        </abbr>{' '}
        <span aria-label="To-Do" class="text-vy whitespace-nowrap">
          TO&hairsp;DO
        </span>
      </a>
    </ld-typo>
  )
}

export default Logo
