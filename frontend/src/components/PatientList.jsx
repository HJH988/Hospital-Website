import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const PatientList = () => {

  const [patients, setPatients] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/patients')
      .then(response => response.json())
      .then(data => {
        console.log("Patients received:", data)
        setPatients(data)
      })
      .catch(error => {
        console.error('Error fetching patients:', error)
      })
  }, [])

  const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    'Are you sure you want to delete this patient?'
  )

  if (!confirmDelete) {
    return
  }

  try {

    const response = await fetch(
      `http://localhost:3000/patients/${id}`,
      {
        method: 'DELETE'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error(data)
      return
    }

    console.log('Patient deleted:', data)

    // Remove patient from the screen
    setPatients(
      patients.filter(patient => patient.id !== id)
    )

  } catch (error) {

    console.error('Error deleting patient:', error)

  }
}

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
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t">
                <td className="p-4">{patient.name}</td>
                <td className="p-4">{patient.age}</td>
                <td className="p-4">{patient.gender}</td>
                <td className="p-4">{patient.phone}</td>

                <td className="p-4 space-x-2">

                  <Link
                    to={`/patientinfo/${patient.id}`}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </Link>

                  <Link
                    to={`/editinfo/${patient.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}

export default PatientList