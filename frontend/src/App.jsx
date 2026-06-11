import React from 'react'
import Sidebar from './components/Sidebar'
import Login from './components/login'
import DashBoard from './components/DashBoard'
import PatientInfo from './components/PatientInfo'
import AddPatient from './components/AddPatient'
import EditInfo from './components/EditInfo'

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <EditInfo />
    </div>
  )
}

export default App