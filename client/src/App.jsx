import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [patients, setPatients] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.status))
      .catch((err) => setError(err.message))

    fetch('/api/v1/patients')
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-bold mb-4">Hospital Dashboard</h1>

        <p className="mb-2">
          API status: <span className="font-semibold">{health ?? 'loading...'}</span>
        </p>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <h2 className="text-lg font-semibold mb-3">Patients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Ailment</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 && (
                <tr>
                  <td className="p-2 border text-center" colSpan="4">
                    {health ? 'No patients found.' : 'Loading patients...'}
                  </td>
                </tr>
              )}
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="p-2 border">{patient.id}</td>
                  <td className="p-2 border">{patient.name}</td>
                  <td className="p-2 border">{patient.age}</td>
                  <td className="p-2 border">{patient.ailment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
