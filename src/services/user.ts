async function simulateFetch() {
  await new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 250))
}

export async function createUser(email: string, password: string) {
  await simulateFetch()
  localStorage.setItem(`user_${email}`, password)
}

export async function userExists(email: string) {
  await simulateFetch()
  return !!localStorage.getItem(`user_${email}`)
}

export async function loginUser(email = '', password = '') {
  await simulateFetch()
  const isLoginSuccessful = localStorage.getItem(`user_${email}`) === password
  if (isLoginSuccessful) {
    localStorage.setItem('user_session', 'yes') // Fake session.
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
  return !!localStorage.getItem('user_session')
}

export async function deleteSession() {
  await simulateFetch()
  localStorage.getItem('user_session')
}
