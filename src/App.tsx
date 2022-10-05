import type { Component } from 'solid-js'
import Footer from './components/Footer/Footer'
import { Routes, Route } from '@solidjs/router'
import Home from './pages/Home/Home'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'

const App: Component = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <ld-notification placement="bottom" />
      <div class="relative flex items-center" style="min-height: 80vh">
        <div class="container mx-auto px-ld-24 pt-ld-40 pb-24 relative max-w-2xl">
          <Routes>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
          </Routes>
        </div>
        <ld-bg-cells class="block absolute inset-0 -z-10" />
      </div>
      <Footer />
    </div>
  )
}

export default App
