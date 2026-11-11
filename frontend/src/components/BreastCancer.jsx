import React, { useState } from 'react'

const BreastCancerPage = () => {
  // store the uploaded image and its preview
  const [image, setImage] = useState(null)
  // store the detection result
  const [preview, setPreview] = useState(null)
  // store the detection result response from the backend
  const [result, setResult] = useState(null)
  // track the loading state of the detection process
  const [loading, setLoading] = useState(false)

  // Handle image upload and preview
  const handleImageChange = (event) => {

    const file = event.target.files[0]

    if (!file) return

    setImage(file)

    setPreview(
      URL.createObjectURL(file)
    )

    // Clear previous result
    setResult(null)
  }

// Handle the detection process
const handleDetection = async () => {

    if (!image) {
      alert('Please select an image first')
      return
    }
    // Prepare the form data for the POST request
    const formData = new FormData()
    // Append the image file to the form data
    formData.append(
      'image',
      image
    )
    // Set loading state to true while the detection is in progress
    setLoading(true)

    try {
      // 1. Get the JWT token from localStorage
      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:3000/detect',
        {
          method: 'POST',
          headers: {
            // 2. Add the Authorization header (leave Content-Type out so FormData handles it)
            Authorization: `Bearer ${token}`,
          },
          body: formData
        }
      )

      const data = await response.json()

      console.log(
        'Detection response:',
        data
      )

      if (!response.ok) {
        throw new Error(
          data.error || 'Detection failed'
        )
      }

      setResult(data)

    } catch (error) {

      console.error(
        'Detection error:',
        error
      )

      alert(
        'Detection failed. Please try again.'
      )

    } finally {

      setLoading(false)

    }
  }


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


          <label
            className="
              bg-gray-300
              rounded-xl
              h-96
              flex
              items-center
              justify-center
              cursor-pointer
              hover:bg-gray-400
              transition
              overflow-hidden
            "
          >

            {preview ? (

              <img
                src={preview}
                alt="Uploaded mammogram"
                className="w-full h-full object-contain"
              />

            ) : (

              <p className="text-xl font-semibold">
                Click to Upload Image
              </p>

            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

          </label>

        </div>


        {/* Result Image */}

        <div>

          <h2 className="text-xl font-semibold mb-4">
            Mammogram Results
          </h2>


          <div
            className="
              bg-gray-300
              rounded-xl
              h-96
              flex
              items-center
              justify-center
              overflow-hidden
            "
          >

            {result?.gradcam_path ? (

              <img
                src={`http://localhost:3000/${result.gradcam_path.replaceAll('\\', '/')}`}
                alt="Grad-CAM detection result"
                className="w-full h-full object-contain"
              />

            ) : (

              <p className="text-gray-600">
                Detection Output
              </p>

            )}

          </div>

        </div>

      </div>


      {/* Results */}

      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">

        <h2 className="text-2xl font-semibold mb-4">
          Detection Results
        </h2>


        {result ? (

          <div className="space-y-4">

            <p className="text-lg">

              <strong>
                Model Prediction:
              </strong>{' '}

              <span className="font-bold">
                {result.prediction}
              </span>

            </p>


            <p className="text-lg">

              <strong>
                Confidence:
              </strong>{' '}

              {(result.confidence * 100).toFixed(2)}%

            </p>


            <p className="text-sm text-gray-500">
              Class Index: {result.class_index}
            </p>

          </div>

        ) : (

          <p className="text-gray-500">
            No detection has been performed yet.
          </p>

        )}


        {/* Run Detection */}

        <button
          onClick={handleDetection}
          disabled={loading}
          className="
            mt-6
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-gray-400
            text-white
            px-6
            py-3
            rounded-lg
            transition
          "
        >

          {loading
            ? 'Running Detection...'
            : 'Run Detection'
          }

        </button>


        {/* Medical disclaimer */}

        <p className="mt-6 text-sm text-gray-500">
          This result is generated by an AI model for
          decision-support purposes and is not a medical diagnosis.
        </p>

      </div>

    </div>

  )
}

export default BreastCancerPage