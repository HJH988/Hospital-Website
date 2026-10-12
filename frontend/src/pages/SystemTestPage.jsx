import React, { useState } from 'react'

const SystemTestPage = () => {
  const [tests, setTests] = useState({
    backend: { status: 'Not tested', message: '' },
    database: { status: 'Not tested', message: '' },
    authentication: { status: 'Not tested', message: '' },
    patients: { status: 'Not tested', message: '' },
    invalidToken: { status: 'Not tested', message: '' },
  })

  const [loading, setLoading] = useState({})

  const updateTest = (testName, status, message) => {
    setTests((previous) => ({
      ...previous,
      [testName]: { status, message },
    }))
  }

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

  // Test 1: Backend API
  const testBackend = () =>
    runTest('backend', async () => {
      const response = await fetch('http://localhost:3000/')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.status !== 'success') {
        throw new Error('Unexpected backend response')
      }

      return {
        status: 'Passed',
        message: data.message,
      }
    })

  // Test 2: Database Connection
  // Uses the existing patient endpoint to verify a database query.
  const testDatabase = () =>
    runTest('database', async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        return {
          status: 'Not tested',
          message: 'Please log in before testing the database.',
        }
      }

      const response = await fetch(
        'http://localhost:3000/patients',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Could not query patient records.'
        )
      }

      if (!Array.isArray(data)) {
        throw new Error('Unexpected response from patient endpoint.')
      }

      return {
        status: 'Passed',
        message: 'Patient records were queried successfully.',
      }
    })

  // Test 3: Authentication
  // Checks whether the saved JWT can access a protected endpoint.
  const testAuthentication = () =>
    runTest('authentication', async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        return {
          status: 'Failed',
          message: 'No token found. Please log in first.',
        }
      }

      const response = await fetch(
        'http://localhost:3000/patients',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401) {
        throw new Error('Token is invalid or expired.')
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

  // Test 4: Patient List
  const testPatients = () =>
    runTest('patients', async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Please log in before testing patient records.')
      }

      const response = await fetch(
        'http://localhost:3000/patients',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve patients.')
      }

      if (!Array.isArray(data)) {
        throw new Error('Expected a list of patients.')
      }

      return {
        status: 'Passed',
        message: `Successfully retrieved ${data.length} patient record(s).`,
      }
    })

    const testInvalidToken = () =>
  runTest('invalidToken', async () => {
    const response = await fetch('http://localhost:3000/patients', {
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
    }
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