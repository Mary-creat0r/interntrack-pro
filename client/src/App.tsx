import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddApplication from './pages/AddApplication'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />        ← shows landing page at /
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/add" element={
                    <ProtectedRoute>
                        <AddApplication />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} /> ← redirects unknown URLs to landing
            </Routes>
        </BrowserRouter>
    )
}

export default App