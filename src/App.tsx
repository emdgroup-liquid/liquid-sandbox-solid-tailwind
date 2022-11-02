import BreakpointHelper from './components/BreakpointHelper/BreakpointHelper'
import CookieConsent from './components/CookieConsent/CookieConsent'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Privacy from './pages/Privacy/Privacy'
import Recover from './pages/Recover/Recover'
import SignUp from './pages/SignUp/SignUp'
import Terms from './pages/Terms/Terms'
import Todo from './pages/Todo/Todo'
import { Routes, Route } from '@solidjs/router'
import { Show, type Component } from 'solid-js'

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
          <Route path="/todo">
            <Route path="/" component={Todo} />
            <Route path="/due-today" component={Todo} />
            <Route path="/done" component={Todo} />
          </Route>
          <Route path="/login" component={Login} />
          <Route path="/recover" component={Recover} />
          <Route path="/signup" component={SignUp} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
        </Routes>
      </div>
      <Routes>
        <Route path="/" component={Footer} />
      </Routes>
      <CookieConsent />
    </div>
  )
}

export default App
