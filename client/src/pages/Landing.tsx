import { useNavigate } from 'react-router-dom'

function Landing() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">InternTrack Pro</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-600 hover:text-blue-600 font-medium"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <main className="max-w-4xl mx-auto mt-24 text-center px-6">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    Track Every Application.<br />Land Your Internship.
                </h2>
                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                    Stop losing track in spreadsheets. InternTrack Pro gives you
                    one clean dashboard to manage your entire internship search.
                </p>
                <button
                    onClick={() => navigate('/register')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition"
                >
                    Start Tracking Free
                </button>
            </main>

            {/* Stats */}
            <section className="max-w-4xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <p className="text-4xl font-bold text-blue-600">47</p>
                    <p className="text-gray-500 mt-2">Applications Tracked</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <p className="text-4xl font-bold text-blue-600">3</p>
                    <p className="text-gray-500 mt-2">Interviews Secured</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <p className="text-4xl font-bold text-blue-600">1</p>
                    <p className="text-gray-500 mt-2">Offer Received</p>
                </div>
            </section>

        </div>
    )
}

export default Landing