import React from 'react'

const AddPatient = () => {
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

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">

        <form className="space-y-4">

          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              placeholder="Enter patient's name"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Age
            </label>
            <input
              type="number"
              className="w-full border rounded-lg p-3"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Gender
            </label>
            <select className="w-full border rounded-lg p-3">
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
              className="w-full border rounded-lg p-3"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Medical Notes
            </label>
            <textarea
              rows="4"
              className="w-full border rounded-lg p-3"
              placeholder="Enter medical notes"
            />
          </div>

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