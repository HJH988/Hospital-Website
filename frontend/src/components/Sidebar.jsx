import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex">

      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-900 text-white shadow-lg flex flex-col transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >

        {/* Top Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">

          {/* Logo */}
          {isOpen && (
            <h1 className="text-xl font-bold">
              Hospital App
            </h1>
          )}

          {/* Toggle Button */}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <ul className="flex-1 p-4 space-y-2">

          <li>
            <a
              href="#"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {isOpen ? 'Dashboard' : '🏠'}
            </a>
          </li>

          <li>
            <a
              href="#"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {isOpen ? 'Patients' : '👨‍⚕️'}
            </a>
          </li>

          <li>
            <a
              href="#"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {isOpen ? 'Detection' : '🩺'}
            </a>
          </li>

          <li>
            <a
              href="#"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {isOpen ? 'Reports' : '📄'}
            </a>
          </li>

          <li>
            <a
              href="#"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {isOpen ? 'Settings' : '⚙️'}
            </a>
          </li>
        </ul>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition">
            {isOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
      </main>
    </div>
  )
}

export default Sidebar