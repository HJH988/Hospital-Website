import React from 'react'
import Sidebar from './components/Sidebar'
import Login from './components/login'
import DashBoard from './components/DashBoard'

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <DashBoard />
    </div>
  )
}

export default App