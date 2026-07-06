import { Outlet, Link } from 'react-router-dom'
import WalletConnect from '@components/WalletConnect'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ⭐ Stellar Escrow
            </div>
          </Link>

          <nav className="hidden md:flex gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/create">Create</NavLink>
            <NavLink to="/history">Dashboard</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Stellar Escrow</h3>
              <p className="text-sm text-gray-600">
                Secure peer-to-peer transactions on Stellar Soroban. Transparent, fast, and trustless.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#features" className="hover:text-blue-600 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-blue-600 transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-blue-600 transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="https://developers.stellar.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition"
                  >
                    Stellar Docs
                  </a>
                </li>
                <li>
                  <a
                    href="https://soroban.stellar.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition"
                  >
                    Soroban Guide
                  </a>
                </li>
                <li>
                  <a
                    href="https://stellar.org/community"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#privacy" className="hover:text-blue-600 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-blue-600 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="mailto:info@stellarescrow.com" className="hover:text-blue-600 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Stellar Escrow. Built on Stellar Soroban. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-gray-600 hover:text-blue-600 font-medium transition">
      {children}
    </Link>
  )
}
