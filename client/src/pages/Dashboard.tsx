import API_URL from '../config'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ApplicationCard from '../components/ApplicationCard'

interface Application {
    id: number
    company: string
    role: string
    status: string
    appliedDate: string
    nextActionDate: string | null
    notes: string | null
    jobUrl: string | null
}

interface Stats {
    totalApplications: number
    responseRate: number
    byStatus: Record<string, number>
}

function Dashboard() {
    const [applications, setApplications] = useState<Application[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { user, token, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` }

            const [appsRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/api/applications`, { headers }),
                fetch(`${API_URL}/api/applications/stats`, { headers })
            ])

            // Check for expired/invalid token
            if (appsRes.status === 401 || statsRes.status === 401) {
                logout()
                navigate('/login')
                return
            }

            const appsData = await appsRes.json()
            const statsData = await statsRes.json()

            setApplications(appsData.applications)
            setStats(statsData)
        } catch (err) {
            setError('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`${API_URL}/api/applications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                // Update local state immediately — optimistic UI
                setApplications(prev =>
                    prev.map(app =>
                        app.id === id ? { ...app, status: newStatus } : app
                    )
                )
                // Refresh stats
                const statsRes = await fetch(
                    `${API_URL}/api/applications/stats`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                const statsData = await statsRes.json()
                setStats(statsData)
            }
        } catch (err) {
            console.error('Failed to update status')
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this application?')) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/applications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                // Remove from local state immediately
                setApplications(prev => prev.filter(app => app.id !== id))
                // Refresh stats
                const statsRes = await fetch(
                    `${API_URL}/api/applications/stats`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                const statsData = await statsRes.json()
                setStats(statsData)
            }
        } catch (err) {
            console.error('Failed to delete application')
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading your dashboard...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">InternTrack Pro</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-red-500 transition"
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-8">

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                            <p className="text-4xl font-bold text-blue-600">
                                {stats.totalApplications}
                            </p>
                            <p className="text-gray-500 mt-2">Total Applications</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                            <p className="text-4xl font-bold text-blue-600">
                                {stats.responseRate}%
                            </p>
                            <p className="text-gray-500 mt-2">Response Rate</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                            <p className="text-4xl font-bold text-blue-600">
                                {stats.byStatus?.INTERVIEW || 0}
                            </p>
                            <p className="text-gray-500 mt-2">Interviews Secured</p>
                        </div>
                    </div>
                )}

                {/* Header row */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        My Applications
                    </h2>
                    <button
                        onClick={() => navigate('/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        + Add Application
                    </button>
                </div>

                {/* Applications list */}
                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                        <p className="text-gray-500 text-lg mb-4">
                            No applications yet
                        </p>
                        <button
                            onClick={() => navigate('/add')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Add your first application
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {applications.map(app => (
                            <ApplicationCard
                                key={app.id}
                                application={app}
                                onStatusUpdate={handleStatusUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Dashboard