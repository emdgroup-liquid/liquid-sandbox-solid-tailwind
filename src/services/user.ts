// **Warning** Do not use in production!
import { simulateFetch } from './utils'

export async function createUser(email: string, password: string) {
  await simulateFetch()
  localStorage.setItem(`user_${email}`, password)
  localStorage.setItem('user_session', 'yes') // Fake session.
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
