import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

const handleLogin = async (e) => {
  e.preventDefault()
  setError('')

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Login failed. Please try again.')
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.user.username)

    navigate('/', { replace: true })
  } catch (error) {
    setError('Unable to connect to the server. Please try again.')
    console.error('Login error:', error)
  }
}

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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">
             {error}
          </p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          Login
        </button>

      </div>
    </div>
  )
}

export default Login