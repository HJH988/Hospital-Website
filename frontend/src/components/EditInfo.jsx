import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const EditInfo = () => {
  // State variables
  const { id } = useParams()
  // navigate function to redirect after successful update
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

  const [loading, setLoading] = useState(true)

useEffect(() => {
    // 1. Get the JWT token from localStorage
    const token = localStorage.getItem('token')
    // Fetch patient id data from the backend
    fetch(`http://localhost:3000/patients/${id}`, {
      headers: {
        // 2. Add Authorization header
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Patient not found')
        }

        return response.json()
      })
      .then(data => {
        console.log('Patient received:', data)
        // Populate the form with the fetched patient data
        setPatient({
          name: data.name,
          age: data.age,
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          medical_notes: data.medical_notes
        })

        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching patient:', error)
        setError('Failed to load patient information')
        setLoading(false)
      })

  }, [id])
  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target

    setPatient({
      ...patient,
      [name]: value
    })
  }
// Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    try {
      // 1. Get the JWT token from localStorage
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:3000/patients/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 2. Add Authorization header
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...patient,
            age: Number(patient.age)
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update patient')
        return
      }

      console.log('Patient updated:', data)

      // Go back to patient list
      navigate('/patientslist')

    } catch (error) {
      console.error('Error updating patient:', error)
      setError('Could not connect to the server')
    }
  }


  // Loading screen
  if (loading) {

    return (
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        <p>
          Loading patient information...
        </p>

      </div>
    )
  }


  // Error screen
  if (error && !patient.name) {

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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Edit Patient Information
        </h1>
        <p className="text-gray-600">
          Update the patient's details below.
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

        <form 
          onSubmit={handleSubmit}
          className="space-y-4"
        >

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
              placeholder="Enter full name"
              required
            />
          </div>

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

          <div>
            <label className="block font-medium mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

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
              placeholder="Enter email address"
            />
          </div>

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
              placeholder="Enter any medical notes"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Update Patient
          </button>

        </form>
      </div>

    </div>
  )
}

export default EditInfo