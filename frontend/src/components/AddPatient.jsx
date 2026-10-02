import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddPatient = () => {

  const navigate = useNavigate()

  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    medical_notes: ''
  })

  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setPatient({
      ...patient,
      [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    try {
      const response = await fetch('http://localhost:3000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...patient,
          age: Number(patient.age)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create patient')
        return
      }

      console.log('Patient created:', data)

      // Go back to patient list
      navigate('/patientslist')

    } catch (error) {
      console.error('Error creating patient:', error)
      setError('Could not connect to the server')
    }
  }

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Add New Patient
        </h1>

        <p className="text-gray-600">
          Enter the patient's information below.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 max-w-2xl">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={patient.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Enter patient's name"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block font-medium mb-2">
              Age
            </label>

            <input
              type="number"
              name="age"
              value={patient.age}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Enter age"
              min="0"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium mb-2">
              Gender
            </label>

            <select
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-2">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={patient.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Enter phone number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={patient.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Enter email"
            />
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block font-medium mb-2">
              Medical Notes
            </label>

            <textarea
              name="medical_notes"
              value={patient.medical_notes}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg p-3"
              placeholder="Enter medical notes"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Save Patient
          </button>

        </form>

      </div>

    </div>
  )
}

export default AddPatient