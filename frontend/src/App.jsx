import React from 'react'
import Sidebar from './components/Sidebar'
import Login from './components/login'
import DashBoard from './components/DashBoard'
import PatientInfo from './components/PatientInfo'

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <PatientInfo />
    </div>
  )
}

export default App