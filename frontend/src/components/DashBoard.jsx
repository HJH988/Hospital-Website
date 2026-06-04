import React from 'react'

const Dashboard = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome Back, Dr. Tan</h1>
        <p className="text-gray-600">
          Here's today's hospital overview.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">Total Patients</h2>
          <p className="text-3xl font-bold mt-2">245</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">Total Scans</h2>
          <p className="text-3xl font-bold mt-2">89</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">Detections</h2>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">Pending Reviews</h2>
          <p className="text-3xl font-bold mt-2">4</p>
        </div>

      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Recent Patients
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span>Sarah Lee</span>
            <span className="text-yellow-600">Pending</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Emma Tan</span>
            <span className="text-green-600">Reviewed</span>
          </div>

          <div className="flex justify-between pb-2">
            <span>Jane Lim</span>
            <span className="text-green-600">Reviewed</span>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Dashboard