import breakpoints from '../../breakpoints'
import { deleteSession } from '../../services/user'
import Logo from '../Logo/Logo'
import { useNavigate } from '@solidjs/router'
import { Component, createSignal, onCleanup, onMount, Show } from 'solid-js'

interface SidenavProps {
  ref?: (el: HTMLLdSidenavElement) => void
}

const Sidenav: Component<SidenavProps> = (props) => {
  let sidenavRef: HTMLLdSidenavElement

  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = createSignal(false)

  const maxWidthQuery = `(max-width: ${breakpoints.lg})`
  const mediaQuery = window.matchMedia(maxWidthQuery)
  const [isScreenNarrow, setIsScreenNarrow] = createSignal(
    window.matchMedia(maxWidthQuery).matches
  )

  const logout = async () => {
    setLoggingOut(true)
    await deleteSession()
    setLoggingOut(false)
    navigate('/login', { replace: true })
  }

  const onMediaQueryChange = () => {
    const isNarrow = window.matchMedia(maxWidthQuery).matches
    setIsScreenNarrow(isNarrow)
    if (isNarrow) sidenavRef.collapsed = true
  }

  onMount(async () => {
    mediaQuery.addEventListener('change', onMediaQueryChange, { passive: true })
  })

  onCleanup(() => {
    mediaQuery.removeEventListener('change', onMediaQueryChange)
  })

  return (
    <>
      <ld-sidenav-toggle-outside class="z-10" />
      <ld-sidenav
        breakpoint={breakpoints.xs}
        ref={(el: HTMLLdSidenavElement) => {
          sidenavRef = el
          if (props.ref) props.ref(el)
        }}
        collapse-trigger="mouseout"
        collapsed
        collapsible={isScreenNarrow()}
        narrow
        class="z-10 lg:relative"
      >
        <ld-sidenav-header href="/todo" slot="header">
          <Logo
            class="leading-7"
            slot="logo"
            style={{ width: '10rem' }}
            tag="span"
            variant="b6"
          />
        </ld-sidenav-header>
        <ld-sidenav-slider label="To-Do">
          <ld-sidenav-heading>Your tasks</ld-sidenav-heading>
          <ld-sidenav-navitem rounded selected={true}>
            <ld-icon slot="icon" name="calendar" /> Upcomming{' '}
            <ld-badge class="ml-ld-4 origin-left scale-75 text-vc-100">
              12 <ld-sr-only>total</ld-sr-only>
            </ld-badge>
          </ld-sidenav-navitem>
          <ld-sidenav-navitem rounded>
            <ld-icon slot="icon" name="attention" /> Due today
          </ld-sidenav-navitem>
          <ld-sidenav-navitem rounded>
            <ld-icon slot="icon" name="checkmark" /> Done{' '}
            <ld-badge class="ml-ld-4 origin-left scale-75 text-vc-100">
              1234 <ld-sr-only>total</ld-sr-only>
            </ld-badge>
          </ld-sidenav-navitem>
          <ld-sidenav-separator />
          <ld-sidenav-heading>Preferences</ld-sidenav-heading>
          <ld-sidenav-navitem rounded>
            <ld-icon slot="icon" name="conversation" /> Notification settings
          </ld-sidenav-navitem>
          <ld-sidenav-navitem rounded>
            <ld-icon slot="icon" name="user" /> Account settings
          </ld-sidenav-navitem>
        </ld-sidenav-slider>
        <ld-sidenav-navitem
          aria-busy={loggingOut()}
          onClick={logout}
          slot="bottom"
          rounded
        >
          <Show
            when={loggingOut()}
            fallback={
              <ld-icon slot="icon">
                <svg
                  style={{
                    transform: 'translateY(-3.5%) scale(0.8)',
                  }}
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M423.26 92a41.94 41.94 0 0 0-59.32 1.77 41.96 41.96 0 0 0 1.78 59.32c32.08 30.21 49.75 71.24 49.75 115.5 0 87.93-71.54 159.48-159.47 159.48S96.53 356.52 96.53 268.59c0-44.26 17.66-85.29 49.75-115.5a41.96 41.96 0 0 0 1.78-59.32 41.93 41.93 0 0 0-59.32-1.78c-48.4 45.57-76.15 109.94-76.15 176.6C12.59 402.8 121.79 512 256 512c134.21 0 243.41-109.2 243.41-243.41 0-66.66-27.75-131.03-76.15-176.6z"
                  />
                  <path
                    fill="currentColor"
                    d="M256 268.59c23.18 0 41.97-15.03 41.97-33.57V33.57C297.97 15.03 279.17 0 256 0c-23.18 0-41.97 15.03-41.97 33.57v201.45c0 18.54 18.8 33.57 41.97 33.57z"
                  />
                </svg>
              </ld-icon>
            }
          >
            <ld-loading style={{ transform: 'scale(0.75)' }} slot="icon" />
          </Show>
          Log out
        </ld-sidenav-navitem>
      </ld-sidenav>
      <div class="hidden xs:block lg:hidden" style={{ width: '4rem' }} />
    </>
  )
}

export default Sidenav
