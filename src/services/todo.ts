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

  const todos = JSON.parse(localStorage.getItem(`todos_${email}`) || '[]')
  setState(todos)
}

export async function createTodo(todo: Omit<Todo, 'id' | 'createdAt'>) {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  if (!todo.description) {
    throw new Error('No payload.')
  }

  const todos: Todo[] = JSON.parse(
    localStorage.getItem(`todos_${email}`) || '[]'
  )
  todos.unshift({
    ...todo,
    createdAt: new Date().toISOString(),
    id: new Date().toISOString(),
  })
  localStorage.setItem(`todos_${email}`, JSON.stringify(todos))
  setState(todos)
}

export async function deleteTodo(todoId: string) {
  await simulateFetch()
  const email = await getSession()
  if (!email) {
    throw new Error('No session.')
  }

  if (!todoId) {
    throw new Error('No payload.')
  }

  const todos: Todo[] = JSON.parse(
    localStorage.getItem(`todos_${email}`) || '[]'
  )
  todos.splice(
    todos.findIndex((todo) => todo.id === todoId),
    1
  )
  localStorage.setItem(`todos_${email}`, JSON.stringify(todos))

  const idx = state.findIndex((todo) => todo.id === todoId)
  setState([...state.slice(0, idx), ...state.slice(idx + 1)])
}

export const todos = state
