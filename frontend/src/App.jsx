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
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import DashBoardPage from './pages/DashBoardPage'
import PatientListPage from './pages/PatientListPage'
import AddPatientPage from './pages/AddPatientPage'
import BreastCancerPage from './pages/BreastCancerPage'
import PatientInfoPage from './pages/PatientInfoPage'
import EditInfoPage from './pages/EditInfoPage'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />} >
      <Route index element={<DashBoardPage />} />
      <Route path='/patientslist' element={<PatientListPage />} />
      <Route path='/addpatient' element={<AddPatientPage />} />
      <Route path='/breastcancer' element={<BreastCancerPage />} />
      <Route path='/patientinfo' element={<PatientInfoPage />} />
      <Route path='/editinfo' element={<EditInfoPage />} />
    </Route>

  )
);

const App = () => {
  return <RouterProvider router={router} />
}

export default App