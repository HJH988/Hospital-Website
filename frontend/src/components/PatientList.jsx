import React from 'react'
import { Link } from 'react-router-dom'

const PatientList = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Patients
          </h1>
          <p className="text-gray-600">
            Manage patient records.
          </p>
        </div>

        <Link to="/addpatient" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Patient
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Search patient by name..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Age</th>
              <th className="text-left p-4">Gender</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-t">
              <td className="p-4">Sarah Lee</td>
              <td className="p-4">45</td>
              <td className="p-4">Female</td>
              <td className="p-4">91234567</td>
              <td className="p-4 space-x-2">
                <Link to="/patientinfo" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                  View
                </Link>

                <Link to="/editinfo" className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                  Edit
                </Link>

                <Link className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </Link>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-4">Emma Tan</td>
              <td className="p-4">52</td>
              <td className="p-4">Female</td>
              <td className="p-4">98765432</td>
              <td className="p-4 space-x-2">
                <Link to="/patientinfo" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                  View
                </Link>

                <Link to="/editinfo" className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                  Edit
                </Link>

                <Link className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </Link>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-4">Jane Lim</td>
              <td className="p-4">38</td>
              <td className="p-4">Female</td>
              <td className="p-4">87654321</td>
              <td className="p-4 space-x-2">
                <Link to="/patientinfo" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                  View
                </Link>

                <Link to="/editinfo" className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                  Edit
                </Link>

                <Link className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </Link>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default PatientList