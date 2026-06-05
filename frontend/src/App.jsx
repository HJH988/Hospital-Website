import React from 'react'
import Sidebar from './components/Sidebar'
import Login from './components/login'
import DashBoard from './components/DashBoard'
import PatientInfo from './components/PatientInfo'
import AddPatient from './components/AddPatient'

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <AddPatient />
    </div>
  )
}

export default App