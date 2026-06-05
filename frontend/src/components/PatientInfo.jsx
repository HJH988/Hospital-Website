import React from 'react'

const PatientInformation = () => {
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
          Sarah Lee
        </h2>

        <div className="space-y-2">
          <p><strong>Age:</strong> 45</p>
          <p><strong>Gender:</strong> Female</p>
          <p><strong>Phone:</strong> 91234567</p>
          <p><strong>Email:</strong> sarah@gmail.com</p>
        </div>
      </div>

      {/* Medical Notes */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Medical Notes
        </h2>

        <p className="text-gray-700">
          Previous breast examination completed.
          Follow-up mammogram recommended.
        </p>
      </div>



    </div>
  )
}

export default PatientInformation