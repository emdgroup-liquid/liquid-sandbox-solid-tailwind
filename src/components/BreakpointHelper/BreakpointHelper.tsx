import breakpoints from '../../breakpoints'
import styles from './BreakpointHelper.module.css'
import { For, type Component } from 'solid-js'

const BreakpointHelper: Component = () => {
  return (
    <div class={styles.BreakpointHelper}>
      <For each={Object.keys(breakpoints)}>
        {(key) => (
          <div
            class={styles.Breakpoint}
            style={{
              width: `calc(${breakpoints[key]} + 1px)`,
            }}
          >
            <b>{key.toUpperCase()}</b> ({breakpoints[key]})
          </div>
        )}
      </For>
    </div>
  )
}

export default BreakpointHelper
