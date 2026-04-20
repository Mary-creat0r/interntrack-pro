import API_URL from '../config'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    // Clears any previous error and shows loading state during submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Login failed')
                return
            }

            console.log('Login data received:', JSON.stringify(data))
            console.log('User object:', JSON.stringify(data.user))

            // Save token and user to localStorage then redirect to dashboard
            login(data.token, data.user)
            navigate('/dashboard')
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            // Always reset loading state whether request succeeded or failed
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">
                        InternTrack Pro
                    </h1>
                    <p className="text-gray-500">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@university.ac.uk"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                    </form>

                    {/* Register link */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-medium hover:underline">
                            Create one
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default Login