import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">
          CRUD App
        </h1>

        {/* Links */}
        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
            >
              Users
            </a>
          </li>

          <li>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
            >
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar