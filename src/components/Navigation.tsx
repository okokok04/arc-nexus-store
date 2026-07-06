import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="flex gap-8">
      <Link to="/" className="text-gray-600 hover:text-stellar-700 font-medium">
        Dashboard
      </Link>
      <Link to="/create" className="text-gray-600 hover:text-stellar-700 font-medium">
        Create Escrow
      </Link>
      <Link to="/history" className="text-gray-600 hover:text-stellar-700 font-medium">
        History
      </Link>
    </nav>
  )
}
