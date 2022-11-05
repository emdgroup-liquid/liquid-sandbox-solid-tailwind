// **Warning** Do not use in production!
import { simulateFetch } from './utils'

export async function createUser(email: string, password: string) {
  await simulateFetch()
  localStorage.setItem(`user_${email}`, password)
  localStorage.setItem('user_session', email) // Fake session.
}

export async function userExists(email: string) {
  await simulateFetch()
  return !!localStorage.getItem(`user_${email}`)
}

export async function loginUser(email = '', password = '') {
  await simulateFetch()
  const isLoginSuccessful = localStorage.getItem(`user_${email}`) === password
  if (isLoginSuccessful) {
    localStorage.setItem('user_session', email) // Fake session.
    return true
  }
  return false
}

export async function updateUser(
  toUpdate:
    | { email: string; password?: never }
    | { email?: never; password: string }
) {
  await simulateFetch()
  const currentEmail = await getSession()
  if (toUpdate.email) {
    if (toUpdate.email === currentEmail) return
    localStorage.setItem('user_session', toUpdate.email)
    localStorage.setItem(
      `todos_${toUpdate.email}`,
      localStorage.getItem(`todos_${currentEmail}`) || '[]'
    )
    localStorage.removeItem(`todos_${currentEmail}`)
    localStorage.setItem(
      `settings_${toUpdate.email}`,
      localStorage.getItem(`settings_${currentEmail}`) || '[]'
    )
    localStorage.removeItem(`settings_${currentEmail}`)
    localStorage.setItem(
      `user_${toUpdate.email}`,
      localStorage.getItem(`user_${currentEmail}`) || ''
    )
    localStorage.removeItem(`user_${currentEmail}`)
  } else if (toUpdate.password) {
    localStorage.setItem(`user_${currentEmail}`, toUpdate.password)
  }
}

let firstTimeGetSession = true
export async function getSession() {
  if (firstTimeGetSession) {
    await simulateFetch()
    firstTimeGetSession = false
  }
  return localStorage.getItem('user_session')
}

export async function deleteSession() {
  await simulateFetch()
  localStorage.removeItem('user_session')
}
