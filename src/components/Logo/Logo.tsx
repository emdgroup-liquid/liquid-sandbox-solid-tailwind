import type { Component } from 'solid-js'

interface LogoProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  href?: string
  tag?: HTMLLdTypoElement['tag']
  variant?: HTMLLdTypoElement['variant']
}

const Logo: Component<LogoProps> = (props) => {
  return (
    <ld-typo
      role="banner"
      class={props.class}
      classList={props.classList}
      tag={props.tag || 'h1'}
      variant={props.variant || 'b5'}
    >
      <a href={props.href} class="contents">
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
