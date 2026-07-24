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


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />} >
      <Route index element={<DashBoardPage />} />
    </Route>
    // <Route path='/' element={<DashBoardPage />} />
    // <Route path='/' element={<LoginPage />} />

  )
);

const App = () => {
  return <RouterProvider router={router} />
}

export default App