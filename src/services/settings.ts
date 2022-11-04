// **Warning** Do not use in production!
import { getSession } from './user'
import { simulateFetch } from './utils'
import { createStore } from 'solid-js/store'

const [state, setState] = createStore({
  notificationsEnabled: true,
})

const defaultSettings = { notificationsEnabled: true }

export async function initStore() {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  setState(
    JSON.parse(
      localStorage.getItem(`settings_${email}`) ||
        JSON.stringify(defaultSettings)
    )
  )
}

export async function updateSettings(key: string, value: string | boolean) {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  const settings = JSON.parse(
    localStorage.getItem(`settings_${email}`) || JSON.stringify(defaultSettings)
  )
  settings[key] = value
  localStorage.setItem(`settings_${email}`, JSON.stringify(settings))

  setState((s) => ({ ...s, ...{ [key]: value } }))
}

export const settings = state
