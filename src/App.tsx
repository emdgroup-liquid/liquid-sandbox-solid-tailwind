import BreakpointHelper from './components/BreakpointHelper/BreakpointHelper'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Recover from './pages/Recover/Recover'
import SignUp from './pages/SignUp/SignUp'
import Terms from './pages/Terms/Terms'
import ToDo from './pages/ToDo/ToDo'
import { Routes, Route } from '@solidjs/router'
import type { Component } from 'solid-js'
import { Show } from 'solid-js'

const App: Component = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <Show when={import.meta.env.VITE_ENV === 'development'}>
        <BreakpointHelper />
      </Show>
      <ld-notification placement="bottom" />
      <div class="relative flex items-center flex-grow">
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/todo" component={ToDo} />
          <Route path="/login" component={Login} />
          <Route path="/recover" component={Recover} />
          <Route path="/signup" component={SignUp} />
          <Route path="/terms" component={Terms} />
        </Routes>
      </div>
      <Routes>
        <Route path="/" component={Footer} />
      </Routes>
    </div>
  )
}

export default App
