import React, { useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const DashBoard = () => {
  
  const [totalPatients, setTotalPatients] = useState(0)

  useEffect(() => {
    fetch('http://localhost:3000/patients')
      .then(response => response.json())
      .then(data => {
        setTotalPatients(data.length)
      })
      .catch(error => {
        console.error('Error fetching patients:', error)
      })
  }, [])

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Welcome Back, Dr. Tan
        </h1>

        <p className="text-gray-600 mt-1">
          Here's today's hospital overview.
        </p>
      </div>


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

        {/* Total Patients */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Total Patients
          </h2>

          <p className="text-3xl font-bold mt-2">
            {totalPatients}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Registered patients
          </p>
        </div>


        {/* Total Scans */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Total Scans
          </h2>

          <p className="text-3xl font-bold mt-2">
            89
          </p>

          <p className="text-sm text-gray-500 mt-2">
            AI scans performed
          </p>
        </div>


        {/* Detections */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Detections
          </h2>

          <p className="text-3xl font-bold mt-2">
            12
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Requires attention
          </p>
        </div>


        {/* Pending Reviews */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Pending Reviews
          </h2>

          <p className="text-3xl font-bold mt-2">
            4
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Awaiting review
          </p>
        </div>

      </div>


      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-semibold">
              Recent Patients
            </h2>

            <Link
              to="/patientslist"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </Link>

          </div>


          <div className="space-y-4">

            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">
                  Sarah Lee
                </p>

                <p className="text-sm text-gray-500">
                  Age 45
                </p>
              </div>

              <span className="text-yellow-600 text-sm font-medium">
                Pending
              </span>
            </div>


            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">
                  Emma Tan
                </p>

                <p className="text-sm text-gray-500">
                  Age 38
                </p>
              </div>

              <span className="text-green-600 text-sm font-medium">
                Reviewed
              </span>
            </div>


            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  Jane Lim
                </p>

                <p className="text-sm text-gray-500">
                  Age 51
                </p>
              </div>

              <span className="text-green-600 text-sm font-medium">
                Reviewed
              </span>
            </div>

          </div>

        </div>


        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Quick Actions
          </h2>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Link
              to="/addpatient"
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <p className="font-semibold">
                Add Patient
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Create a new patient record
              </p>
            </Link>


            <Link
              to="/patientslist"
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <p className="font-semibold">
                Patient List
              </p>

              <p className="text-sm text-gray-500 mt-1">
                View and manage patients
              </p>
            </Link>


            <Link
              to="/breastcancer"
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <p className="font-semibold">
                Breast Cancer Scan
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Perform an AI scan
              </p>
            </Link>


            <Link
              to="/patientslist"
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <p className="font-semibold">
                Review Patients
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Review patient records
              </p>
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default DashBoard