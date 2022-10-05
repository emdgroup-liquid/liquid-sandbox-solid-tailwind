import type { Component } from 'solid-js'
import Footer from './components/Footer/Footer'
import { Routes, Route } from '@solidjs/router'
import Home from './pages/Home/Home'
import SignUp from './pages/SignUp/SignUp'

const App: Component = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <ld-notification placement="bottom" />
      <div class="relative flex items-center" style="min-height: 80vh">
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/sign-up" component={SignUp} />
        </Routes>
        <ld-bg-cells class="block absolute inset-0 -z-10" />
      </div>
      <Footer />
    </div>
  )
}

export default App
