import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

const PatientInformation = () => {

  const { id } = useParams()

  const [patient, setPatient] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {

    fetch(`http://localhost:3000/patients/${id}`)
      .then(response => {

        if (!response.ok) {
          throw new Error('Patient not found')
        }

        return response.json()
      })
      .then(data => {
        console.log('Patient received:', data)
        setPatient(data)
      })
      .catch(error => {
        console.error('Error fetching patient:', error)
        setError('Failed to load patient information')
      })

  }, [id])


  // Loading state
  if (!patient && !error) {
    return (
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <p>Loading patient information...</p>
      </div>
    )
  }


  // Error state
  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        <p className="text-red-500 mb-4">
          {error}
        </p>

        <Link
          to="/patientslist"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Patient List
        </Link>

      </div>
    )
  }


  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Patient Information
          </h1>

          <p className="text-gray-600">
            View patient details and detection history.
          </p>
        </div>

        <div className="flex gap-2">

          <Link
            to="/patientslist"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Back
          </Link>

          <Link
            to={`/editinfo/${patient.id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Edit Patient
          </Link>

        </div>

      </div>


      {/* Patient Details */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h2 className="text-xl font-semibold mb-6">
          Patient Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="font-medium mt-1">
              {patient.name}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Age
            </p>

            <p className="font-medium mt-1">
              {patient.age}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Gender
            </p>

            <p className="font-medium mt-1">
              {patient.gender}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-medium mt-1">
              {patient.phone}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-medium mt-1">
              {patient.email}
            </p>
          </div>

        </div>

      </div>


      {/* Medical Notes */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Medical Notes
        </h2>

        <p className="text-gray-700">
          {patient.medical_notes || 'No medical notes available.'}
        </p>

      </div>

    </div>
  )
}

export default PatientInformation