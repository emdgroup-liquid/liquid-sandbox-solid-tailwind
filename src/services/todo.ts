// **Warning** Do not use in production!
import { getSession } from './user'
import { simulateFetch } from './utils'
import { createStore } from 'solid-js/store'

const [state, setState] = createStore([] as Todo[])

export async function initStore() {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  setState(JSON.parse(localStorage.getItem(`todos_${email}`) || '[]'))
}

export async function createTodo(todo: Omit<Todo, 'id' | 'createdAt'>) {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  const todos: Todo[] = JSON.parse(
    localStorage.getItem(`todos_${email}`) || '[]'
  )
  const todoWithMeta = {
    ...todo,
    createdAt: new Date().toISOString(),
    id: new Date().toISOString(),
  }
  todos.unshift(todoWithMeta)
  localStorage.setItem(`todos_${email}`, JSON.stringify(todos))

  setState((t) => [todoWithMeta, ...t])
}

export async function deleteTodo(todoId: string) {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  const todos: Todo[] = JSON.parse(
    localStorage.getItem(`todos_${email}`) || '[]'
  )
  const idx = todos.findIndex((t) => t.id === todoId)
  todos.splice(idx, 1)
  localStorage.setItem(`todos_${email}`, JSON.stringify(todos))

  setState((t) => {
    return [...t.slice(0, idx), ...t.slice(idx + 1)]
  })
}

export async function updateTodo(todo: Omit<Todo, 'createdAt'>) {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  const todos: Todo[] = JSON.parse(
    localStorage.getItem(`todos_${email}`) || '[]'
  )
  const idx = todos.findIndex((t) => t.id === todo.id)
  const updatedTodo = { ...todos[idx], ...todo }
  todos[idx] = updatedTodo
  localStorage.setItem(`todos_${email}`, JSON.stringify(todos))

  setState(idx, { ...updatedTodo })
}

export const todos = state
