import React from 'react'
import { 
  Route, 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements } from 'react-router-dom'

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
    <>

      <Route path='/login' element={<LoginPage />} />

      <Route path='/' element={<MainLayout />} >
        <Route index element={<DashBoardPage />} />
        <Route path='/patientslist' element={<PatientListPage />} />
        <Route path='/addpatient' element={<AddPatientPage />} />
        <Route path='/breastcancer' element={<BreastCancerPage />} />
        <Route path='/patientinfo/:id' element={<PatientInfoPage />} />
        <Route path='/editinfo/:id' element={<EditInfoPage />} />
      </Route>
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />
}

export default App