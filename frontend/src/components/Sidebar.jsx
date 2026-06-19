import React, { useState } from 'react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)

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
              <a
                href="#"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Dashboard
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Patients List
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Add Patients
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Breast Cancer Detection
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Settings
              </a>
            </li>
          </ul>
        )}

        {/* Logout */}
        {isOpen && (
          <div className="p-4 border-t border-gray-700">
            <button className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition">
              Logout
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Sidebar