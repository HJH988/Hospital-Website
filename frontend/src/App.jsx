import React from 'react'
import Sidebar from './components/Sidebar'
import Login from './components/login'
import DashBoard from './components/DashBoard'
import PatientInfo from './components/PatientInfo'
import AddPatient from './components/AddPatient'
import EditInfo from './components/EditInfo'
import PatientList from './components/PatientList'

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <PatientList />
    </div>
  )
}

export default App