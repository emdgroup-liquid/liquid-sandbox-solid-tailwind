import { createStore } from 'solid-js/store'

const [todos, setTodos] = createStore([
  { id: 1, title: 'Thing I have to do', done: false },
  { id: 2, title: 'Learn a New Framework', done: false },
])
