import React, { useState } from 'react'

const API_URL = 'http://localhost:3000'
const PATIENT_URL = `${API_URL}/patients`

const SystemTestPage = () => {
  const [tests, setTests] = useState({
    backend: { status: 'Not tested', message: '' },
    database: { status: 'Not tested', message: '' },
    authentication: { status: 'Not tested', message: '' },
    patients: { status: 'Not tested', message: '' },
    invalidToken: { status: 'Not tested', message: '' },
    patientCreate: { status: 'Not tested', message: '' },
    patientRead: { status: 'Not tested', message: '' },
    patientUpdate: { status: 'Not tested', message: '' },
    patientDelete: { status: 'Not tested', message: '' },
  })

  const [loading, setLoading] = useState({})

  // Update the displayed status of a test.
  const updateTest = (testName, status, message) => {
    setTests((previous) => ({
      ...previous,
      [testName]: { status, message },
    }))
  }

  // Run a test and handle errors.
  const runTest = async (testName, testFunction) => {
    setLoading((previous) => ({
      ...previous,
      [testName]: true,
    }))

    updateTest(testName, 'Testing...', '')

    try {
      const result = await testFunction()
      updateTest(testName, result.status, result.message)
    } catch (error) {
      updateTest(testName, 'Failed', error.message)
    } finally {
      setLoading((previous) => ({
        ...previous,
        [testName]: false,
      }))
    }
  }

  // Get the saved authentication token.
  const getHeaders = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('Please log in before running this test.')
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  // Safely read a JSON response.
  const readResponse = async (response) => {
    const text = await response.text()

    if (!text) {
      return {}
    }

    try {
      return JSON.parse(text)
    } catch {
      throw new Error('The server returned an invalid JSON response.')
    }
  }

  // Create a temporary patient for an individual CRUD test.
  const createTemporaryPatient = async (headers) => {
    const temporaryPatient = {
      name: `CRUD Test ${Date.now()}`,
      age: 30,
      gender: 'Male',
      phone: '00000000',
      email: 'crud-test@example.com',
      medical_notes: 'Temporary record created by system test',
    }

    const response = await fetch(PATIENT_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(temporaryPatient),
    })

    const data = await readResponse(response)

    if (!response.ok) {
      throw new Error(
        `Could not create temporary patient: ${
          data.error || `HTTP ${response.status}`
        }`
      )
    }

    if (data.id == null) {
      throw new Error('The created patient response did not contain an ID.')
    }

    return {
      id: data.id,
      patient: temporaryPatient,
    }
  }

  // Attempt to clean up a temporary patient.
  const cleanupTemporaryPatient = async (patientID, headers) => {
    if (patientID == null) {
      return
    }

    try {
      const response = await fetch(`${PATIENT_URL}/${patientID}`, {
        method: 'DELETE',
        headers,
      })

      // The record is already gone, so cleanup is complete.
      if (response.status === 404) {
        return
      }

      if (!response.ok) {
        console.error(
          `Could not clean up temporary patient ${patientID}.`,
          `HTTP ${response.status}`
        )
      }
    } catch (error) {
      console.error(
        `Could not clean up temporary patient ${patientID}:`,
        error
      )
    }
  }

  // --------------------------------------------------
  // TEST 1: Backend API
  // --------------------------------------------------
  const testBackend = () =>
    runTest('backend', async () => {
      const response = await fetch(`${API_URL}/`)

      const data = await readResponse(response)

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}.`)
      }

      if (data.status !== 'success') {
        throw new Error('Unexpected backend response.')
      }

      return {
        status: 'Passed',
        message: data.message || 'Backend is responding.',
      }
    })

  // --------------------------------------------------
  // TEST 2: Database Connection
  // Uses the existing patient endpoint.
  // --------------------------------------------------
  const testDatabase = () =>
    runTest('database', async () => {
      const headers = getHeaders()

      const response = await fetch(PATIENT_URL, { headers })

      const data = await readResponse(response)

      if (!response.ok) {
        throw new Error(
          data.error || `Patient query failed: HTTP ${response.status}.`
        )
      }

      if (!Array.isArray(data)) {
        throw new Error('Unexpected patient list response.')
      }

      return {
        status: 'Passed',
        message: 'Patient records were queried successfully.',
      }
    })

  // --------------------------------------------------
  // TEST 3: Authentication
  // --------------------------------------------------
  const testAuthentication = () =>
    runTest('authentication', async () => {
      const headers = getHeaders()

      const response = await fetch(PATIENT_URL, { headers })

      if (response.status === 401) {
        throw new Error('Token is invalid or expired. Please log in again.')
      }

      if (!response.ok) {
        throw new Error(
          `Protected endpoint returned HTTP ${response.status}.`
        )
      }

      return {
        status: 'Passed',
        message: 'The saved token accessed a protected endpoint.',
      }
    })

  // --------------------------------------------------
  // TEST 4: Patient List
  // --------------------------------------------------
  const testPatients = () =>
    runTest('patients', async () => {
      const headers = getHeaders()

      const response = await fetch(PATIENT_URL, { headers })

      const data = await readResponse(response)

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to retrieve patients: HTTP ${response.status}.`
        )
      }

      if (!Array.isArray(data)) {
        throw new Error('Expected a list of patients.')
      }

      return {
        status: 'Passed',
        message: `Successfully retrieved ${data.length} patient record(s).`,
      }
    })

  // --------------------------------------------------
  // TEST 5: Invalid Token
  // --------------------------------------------------
  const testInvalidToken = () =>
    runTest('invalidToken', async () => {
      const response = await fetch(PATIENT_URL, {
        headers: {
          Authorization: 'Bearer invalid.test.token',
        },
      })

      if (response.status === 401) {
        return {
          status: 'Passed',
          message: 'The backend correctly rejected the invalid token.',
        }
      }

      if (response.ok) {
        throw new Error('Security issue: the backend accepted an invalid token.')
      }

      throw new Error(
        `Expected HTTP 401, but received HTTP ${response.status}.`
      )
    })

  // --------------------------------------------------
  // TEST 6: Create Patient
  // --------------------------------------------------
  const testPatientCreate = () =>
    runTest('patientCreate', async () => {
      const headers = getHeaders()
      let patientID = null

      try {
        const created = await createTemporaryPatient(headers)

        patientID = created.id

        return {
          status: 'Passed',
          message: 'Patient was created successfully.',
        }
      } finally {
        await cleanupTemporaryPatient(patientID, headers)
      }
    })

  // --------------------------------------------------
  // TEST 7: Read Patient
  // --------------------------------------------------
  const testPatientRead = () =>
    runTest('patientRead', async () => {
      const headers = getHeaders()
      let patientID = null

      try {
        const created = await createTemporaryPatient(headers)

        patientID = created.id

        const response = await fetch(
          `${PATIENT_URL}/${patientID}`,
          { headers }
        )

        const data = await readResponse(response)

        if (!response.ok) {
          throw new Error(
            data.error || `READ failed: HTTP ${response.status}.`
          )
        }

        if (
          String(data.id) !== String(patientID) ||
          data.name !== created.patient.name
        ) {
          throw new Error('Retrieved patient data did not match.')
        }

        return {
          status: 'Passed',
          message: 'Patient was retrieved and verified successfully.',
        }
      } finally {
        await cleanupTemporaryPatient(patientID, headers)
      }
    })

  // --------------------------------------------------
  // TEST 8: Update Patient
  // --------------------------------------------------
  const testPatientUpdate = () =>
    runTest('patientUpdate', async () => {
      const headers = getHeaders()
      let patientID = null

      try {
        const created = await createTemporaryPatient(headers)

        patientID = created.id

        const updatedPatient = {
          ...created.patient,
          name: `${created.patient.name} Updated`,
          age: 31,
        }

        // Send the update request.
        const updateResponse = await fetch(
          `${PATIENT_URL}/${patientID}`,
          {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatedPatient),
          }
        )

        const updateData = await readResponse(updateResponse)

        if (!updateResponse.ok) {
          throw new Error(
            updateData.error ||
              `UPDATE failed: HTTP ${updateResponse.status}.`
          )
        }

        // Read the patient again to verify that the changes persisted.
        const verifyResponse = await fetch(
          `${PATIENT_URL}/${patientID}`,
          { headers }
        )

        const readData = await readResponse(verifyResponse)

        if (!verifyResponse.ok) {
          throw new Error(
            `Could not verify updated patient: HTTP ${verifyResponse.status}.`
          )
        }

        if (
          readData.name !== updatedPatient.name ||
          Number(readData.age) !== updatedPatient.age
        ) {
          throw new Error('Updated patient values were not saved correctly.')
        }

        return {
          status: 'Passed',
          message: 'Patient information was updated and verified.',
        }
      } finally {
        await cleanupTemporaryPatient(patientID, headers)
      }
    })

  // --------------------------------------------------
  // TEST 9: Delete Patient
  // --------------------------------------------------
  const testPatientDelete = () =>
    runTest('patientDelete', async () => {
      const headers = getHeaders()
      let patientID = null

      try {
        const created = await createTemporaryPatient(headers)

        patientID = created.id

        // Delete the temporary patient.
        const deleteResponse = await fetch(
          `${PATIENT_URL}/${patientID}`,
          {
            method: 'DELETE',
            headers,
          }
        )

        const deleteData = await readResponse(deleteResponse)

        if (!deleteResponse.ok) {
          throw new Error(
            deleteData.error ||
              `DELETE failed: HTTP ${deleteResponse.status}.`
          )
        }

        // The deletion succeeded, so cleanup is no longer needed.
        const deletedID = patientID
        patientID = null

        // Confirm that the patient no longer exists.
        const verifyResponse = await fetch(
          `${PATIENT_URL}/${deletedID}`,
          { headers }
        )

        if (verifyResponse.status !== 404) {
          throw new Error(
            `Expected HTTP 404 after deletion, received HTTP ${verifyResponse.status}.`
          )
        }

        return {
          status: 'Passed',
          message: 'Patient was deleted and its absence was verified.',
        }
      } finally {
        await cleanupTemporaryPatient(patientID, headers)
      }
    })

  // --------------------------------------------------
  // Test cards displayed on the page
  // --------------------------------------------------
  const testItems = [
    {
      key: 'backend',
      title: 'Backend API',
      description: 'Checks whether the Go server responds.',
      action: testBackend,
    },
    {
      key: 'database',
      title: 'Database Connection',
      description: 'Checks whether patient records can be queried.',
      action: testDatabase,
    },
    {
      key: 'authentication',
      title: 'Authentication',
      description: 'Checks whether your saved JWT is accepted.',
      action: testAuthentication,
    },
    {
      key: 'patients',
      title: 'Patient List',
      description: 'Checks whether the patient endpoint returns a list.',
      action: testPatients,
    },
    {
      key: 'invalidToken',
      title: 'Invalid Token',
      description: 'Checks whether the backend rejects invalid tokens.',
      action: testInvalidToken,
    },
    {
      key: 'patientCreate',
      title: 'Create Patient',
      description: 'Checks whether a patient record can be created.',
      action: testPatientCreate,
    },
    {
      key: 'patientRead',
      title: 'Read Patient',
      description: 'Checks whether an individual patient can be retrieved.',
      action: testPatientRead,
    },
    {
      key: 'patientUpdate',
      title: 'Update Patient',
      description: 'Checks whether patient information can be updated.',
      action: testPatientUpdate,
    },
    {
      key: 'patientDelete',
      title: 'Delete Patient',
      description: 'Checks whether a patient can be deleted.',
      action: testPatientDelete,
    },
  ]

  const getStatusStyle = (status) => {
    if (status === 'Passed') return 'text-green-600'
    if (status === 'Failed') return 'text-red-600'
    if (status === 'Testing...') return 'text-blue-600'
    return 'text-gray-500'
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-2">
        System Health & Testing
      </h1>

      <p className="text-gray-600 mb-6">
        Check whether your hospital system components are working.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testItems.map((item) => (
          <div
            key={item.key}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>

              <span
                className={`font-semibold text-sm ${getStatusStyle(
                  tests[item.key].status
                )}`}
              >
                {tests[item.key].status}
              </span>
            </div>

            <button
              onClick={item.action}
              disabled={loading[item.key]}
              className="mt-5 bg-blue-600 hover:bg-blue-700
                         disabled:bg-blue-300 text-white
                         px-4 py-2 rounded-lg"
            >
              {loading[item.key] ? 'Testing...' : 'Run Test'}
            </button>

            {tests[item.key].message && (
              <p className="mt-4 text-sm text-gray-700">
                {tests[item.key].message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemTestPage