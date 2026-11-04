import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const PatientList = () => {
  // State variables for patients and search query
  // patients store the patient records fetched from the backend
  // search stores the current search query entered by the user
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  // Fetch patients from the backend when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Retrieve the token from local storage for authentication
        const token = localStorage.getItem('token')
        // Make a GET request to the backend to fetch patient records
        const response = await fetch('http://localhost:3000/patients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // Parse the response as JSON
        const data = await response.json()
        // Check if the response was successful
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch patients')
        }
        // Log the received patient data for debugging purposes
        console.log('Patients received:', data)
        // Update the state with the fetched patient records
        setPatients(data)

      } catch (error) {
        console.error('Error fetching patients:', error)
      }
    }

    fetchPatients()
  }, [])
  // Filter patients based on the search query entered by the user
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  )
  // Function to handle the deletion of a patient record
  const handleDelete = async (id) => {
  // Confirm with the user before proceeding with the deletion
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this patient?'
  )
  // If the user cancels the deletion, exit the function
  if (!confirmDelete) {
    return
  }
  // Proceed with the deletion if the user confirms
  try {
    // Retrieve the token from local storage for authentication
    const token = localStorage.getItem('token')
    // Make a DELETE request to the backend to delete the patient record
    const response = await fetch(
      `http://localhost:3000/patients/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    // Parse the response as JSON
    const data = await response.json()
    // Check if the response was successful
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
  // Render the component
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
        {/* Add Patient Button */}
        <Link to="/addpatient" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Patient
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        {/* // Input field for searching patients by name */}
        <input
          type="text"
          placeholder="Search patient by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            {filteredPatients.map((patient) => (
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