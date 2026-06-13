import React from 'react'

const BreastCancer = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">
        Breast Cancer Detection
      </h1>

      {/* Image Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

        {/* Upload Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Mammogram
          </h2>

          <div className="bg-gray-300 rounded-xl h-96 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition">
            <p className="text-xl font-semibold">
              Drag & Drop Image Here
            </p>
          </div>
        </div>

        {/* Result Image Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Mammogram Results
          </h2>

          <div className="bg-gray-300 rounded-xl h-96 flex items-center justify-center">
            <p className="text-gray-600">
              Detection Output
            </p>
          </div>
        </div>

      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">

        <h2 className="text-2xl font-semibold mb-4">
          Detection Results
        </h2>

        <div className="space-y-4">

          <p className="text-lg">
            <strong>Result:</strong>{' '}
            <span className="text-red-600 font-bold">
              Malignant
            </span>
          </p>

          <p className="text-lg">
            <strong>Confidence:</strong> 97%
          </p>

        </div>

        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
          Run Detection
        </button>

      </div>

    </div>
  )
}

export default BreastCancer