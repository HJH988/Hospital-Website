import React from 'react'

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* Login Card */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Login Page
        </h1>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Login Button */}
        <button
          onclick={() => {"/Dashboard"}}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          Login
        </button>

      </div>
    </div>
  )
}

export default Login