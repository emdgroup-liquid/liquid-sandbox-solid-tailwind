// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next
import tailwindConfig from '../../../tailwind.config.js'
import styles from './BreakpointHelper.module.css'
import type { Component } from 'solid-js'
import { For } from 'solid-js'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig)

const breakpoints = { ...fullConfig.theme?.screens } as {
  [key: string]: string
}

const BreakpointHelper: Component = () => {
  return (
    <div class={styles.BreakpointHelper}>
      <For each={Object.keys(breakpoints)}>
        {(key) => (
          <div
            class={styles.Breakpoint}
            style={{
              width: `${parseInt(breakpoints[key]) + 1}px`,
            }}
          >
            <b>{key.toUpperCase()}</b> ({breakpoints[key] + 1}px)
          </div>
        )}
      </For>
    </div>
  )
}

export default BreakpointHelper
