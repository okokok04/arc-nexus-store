import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@components/Layout'
import HomePage from '@pages/HomePage'
import CreateEscrowPage from '@pages/CreateEscrowPage'
import EscrowDetailPage from '@pages/EscrowDetailPage'
import HistoryPage from '@pages/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateEscrowPage />} />
          <Route path="/escrow/:id" element={<EscrowDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
}
