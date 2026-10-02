import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

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
        <p className="text-red-500">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Patient Information</h1>
        <p className="text-gray-600">
          View patient details and detection history.
        </p>
      </div>

      {/* Patient Details */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {patient?.name}
        </h2>

        <div className="space-y-2">
          <p><strong>Age:</strong> {patient?.age}</p>
          <p><strong>Gender:</strong> {patient?.gender}</p>
          <p><strong>Phone:</strong> {patient?.phone}</p>
          <p><strong>Email:</strong> {patient?.email}</p>
        </div>
      </div>

      {/* Medical Notes */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Medical Notes
        </h2>

        <p className="text-gray-700">
          {patient?.medical_notes || 'No medical notes available.'}
        </p>
      </div>



    </div>
  )
}

export default PatientInformation