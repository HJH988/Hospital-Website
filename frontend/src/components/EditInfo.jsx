import React from 'react'

const EditInfo = () => {
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

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">

        <form className="space-y-4">

          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Sarah Lee"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Age
            </label>
            <input
              type="number"
              defaultValue="45"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Gender
            </label>
            <select
              defaultValue="Female"
              className="w-full border rounded-lg p-3"
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
              defaultValue="91234567"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="sarah@gmail.com"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Medical Notes
            </label>
            <textarea
              rows="4"
              defaultValue="Previous breast examination completed. Follow-up mammogram recommended."
              className="w-full border rounded-lg p-3"
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