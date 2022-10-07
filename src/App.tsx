import type { Component } from 'solid-js'
import { Routes, Route } from '@solidjs/router'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Recover from './pages/Recover/Recover'
import SignUp from './pages/SignUp/SignUp'
import Dashboard from './pages/Dashboard/Dashboard'

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
        <Routes>
          <Route
            path="/"
            element={
              <ld-bg-cells
                style={{
                  '--ld-bg-cells-layer-translation-x': '-90%',
                  '--ld-bg-cells-layer-translation-y': '30%',
                  '--ld-bg-cells-layer-size': '330%',
                  '--ld-bg-cells-secondary-layer-size': '190%',
                  '--ld-bg-cells-secondary-layer-translation-y': '-10%',
                  '--ld-bg-cells-secondary-layer-translation-x': '-30%',
                }}
                three-layers
                class="block absolute inset-0 -z-10"
              />
            }
          />
        </Routes>
      </div>
      <Routes>
        <Route path="/" component={Footer} />
      </Routes>
    </div>
  )
}

export default App
