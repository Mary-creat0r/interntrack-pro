import API_URL from '../config';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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
                fetch(`${API_URL}/api/applications`, { headers}),
                fetch(`${API_URL}/api/applications/stats`, { headers })
            ])

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
                // Update local state immediately — no need to refetch
                setApplications(prev =>
                    prev.map(app =>
                        app.id === id ? { ...app, status: newStatus } : app
                    )
                )
                // Refresh stats
                const statsRes = await fetch(
                    '${API_URL}/api/applications/stats',
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
                    '${API_URL}/api/applications/stats',
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

    const statusColours: Record<string, string> = {
        APPLIED: 'bg-blue-100 text-blue-700',
        INTERVIEW: 'bg-yellow-100 text-yellow-700',
        ASSESSMENT: 'bg-purple-100 text-purple-700',
        OFFER: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-100 text-red-700'
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
                            <div
                                key={app.id}
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition"
                            >
                                {/* Card header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{app.company}</h3>
                                        <p className="text-sm text-gray-500">{app.role}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(app.id)}
                                        className="text-gray-300 hover:text-red-500 transition ml-2 text-lg leading-none"
                                        title="Delete application"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Status dropdown */}
                                <select
                                    value={app.status}
                                    onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer mb-3 ${statusColours[app.status]}`}
                                >
                                    <option value="APPLIED">Applied</option>
                                    <option value="INTERVIEW">Interview</option>
                                    <option value="ASSESSMENT">Assessment</option>
                                    <option value="OFFER">Offer</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>

                                {/* Dates */}
                                <p className="text-xs text-gray-400">
                                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                                </p>
                                {app.nextActionDate && (
                                    <p className="text-xs text-gray-400">
                                        Next: {new Date(app.nextActionDate).toLocaleDateString()}
                                    </p>
                                )}

                                {/* Notes */}
                                {app.notes && (
                                    <p className="text-xs text-gray-500 mt-2 truncate">
                                        {app.notes}
                                    </p>
                                )}
                                {/* Job URL */}
                                {app.jobUrl && (
                                    <a
                                    href={app.jobUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-500 hover:underline mt-1 block truncate"
                                    >
                                    View job posting →
                                    </a>
                                    )}
                            </div>
                        ))}
                    </div>
                    )}
            </main>
        </div>
    )
}

export default Dashboard


