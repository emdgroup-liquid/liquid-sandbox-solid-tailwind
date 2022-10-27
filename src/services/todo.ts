// **Warning** Do not use in production!
import { getSession } from './user'
import { simulateFetch } from './utils'

export async function createTodo(todo: { description: string }) {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  if (!todo.description) {
    throw new Error('No payload.')
  }

  const todos = JSON.parse(localStorage.getItem(`todos_${email}`) || '[]')
  todos.push(todo)
  localStorage.setItem(`todos_${email}`, JSON.stringify(todos))
}

export async function getTodos() {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  const todos = JSON.parse(localStorage.getItem(`todos_${email}`) || '[]')
  return todos
}
