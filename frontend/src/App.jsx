import React from 'react'
import { 
  Route, 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements } from 'react-router-dom'

// import Sidebar from './components/Sidebar'
// import Login from './components/login'
// import DashBoard from './components/DashBoard'
// import PatientInfo from './components/PatientInfo'
// import AddPatient from './components/AddPatient'
// import EditInfo from './components/EditInfo'
// import PatientList from './components/PatientList'
// import BreastCancer from './components/BreastCancer'

import LoginPage from './pages/LoginPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<LoginPage />} />
    <Route path='/Dashboard' element={<DashBoard />} />
  )
)

const App = () => {
  return <RouterProvider router={router} />
}

export default App