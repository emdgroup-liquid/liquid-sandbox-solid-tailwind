import BreakpointHelper from './components/BreakpointHelper/BreakpointHelper'
import CookieConsent from './components/CookieConsent/CookieConsent'
import Footer from './components/Footer/Footer'
import Sidenav from './components/Sidenav/Sidenav'
import { loadComponents } from './liquidLoader'
import AccountSettings from './pages/AccountSettings/AccountSettings'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import NotificationSettings from './pages/NotificationSettings/NotificationSettings'
import Privacy from './pages/Privacy/Privacy'
import Recover from './pages/Recover/Recover'
import SignUp from './pages/SignUp/SignUp'
import Terms from './pages/Terms/Terms'
import Todo from './pages/Todo/Todo'
import { todos } from './services/todo'
import { parsePath } from './utils/path'
import { Outlet, Routes, Route, useLocation } from '@solidjs/router'
import { Show, type Component, createMemo } from 'solid-js'

const App: Component = () => {
  loadComponents(['ld-notification'])

  function WithSidenav() {
    const location = useLocation()
    const pathname = createMemo(() => parsePath(location.pathname))

    return (
      <div class="w-full min-h-screen relative flex bg-neutral-010">
        <Sidenav todos={todos} pathname={pathname} />
        <Outlet />
      </div>
    )
  }

  return (
    <div class="flex flex-col min-h-screen">
      <Show when={import.meta.env.VITE_ENV === 'development'}>
        <BreakpointHelper />
      </Show>
      <ld-notification placement="bottom" />
      <div class="relative flex items-center flex-grow">
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/" component={WithSidenav}>
            <Route path="/todo" component={Todo} />
            <Route path="/todo/due-today" component={Todo} />
            <Route path="/todo/done" component={Todo} />
            <Route path="/account-settings" component={AccountSettings} />
            <Route
              path="/notification-settings"
              component={NotificationSettings}
            />
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
