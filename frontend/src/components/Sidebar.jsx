import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    navigate('/login', { replace: true })
  }

  return (
    <div className="flex">

      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-900 text-white shadow-lg flex flex-col transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >

        {/* Top Section */}
        <div className="p-4 border-b border-gray-700">

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl"
          >
            ☰
          </button>

        </div>

        {/* Navigation */}
        {isOpen && (
          <ul className="flex-1 p-4 space-y-2">

            <li>
              <Link
                to="/"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/patientslist"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Patients List
              </Link>
            </li>

            <li>
              <Link
                to="/addpatient"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Add Patients
              </Link>
            </li>

            <li>
              <Link
                to="/breastcancer"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Breast Cancer Detection
              </Link>
            </li>

            <li>
              <Link
                to="/systemtest"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Testing
              </Link>
            </li>
          </ul>
        )}

        {/* Logout */}
        {isOpen && (
          <div className="p-4 border-t border-gray-700">
            <button 
            onClick={handleLogout} 
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Sidebar