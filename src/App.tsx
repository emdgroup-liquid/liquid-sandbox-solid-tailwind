import Footer from './components/Footer/Footer'
import Dashboard from './pages/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Recover from './pages/Recover/Recover'
import SignUp from './pages/SignUp/SignUp'
import { Routes, Route } from '@solidjs/router'
import type { Component } from 'solid-js'

const App: Component = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <ld-notification placement="bottom" />
      <div class="relative flex items-center flex-grow">
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/recover" component={Recover} />
          <Route path="/signup" component={SignUp} />
        </Routes>
      </div>
      <Routes>
        <Route path="/" component={Footer} />
      </Routes>
    </div>
  )
}

export default App
