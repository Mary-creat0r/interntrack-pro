import { useState } from 'react'

interface User {
    id: number
    name: string
    email: string
}

// Custom hook that manages authentication state across the application
// Persists the JWT token and user data in localStorage so users
// remain logged in after page refreshes
export function useAuth() {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token')
    })


    // Saves token and user to both React state and localStorage
    // React state drives the UI; localStorage persists across reloads
    const login = (token: string, user: User) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setToken(token)
        setUser(user)
    }

    // Clears both React state and localStorage on logout
    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }


    // Double negation converts token string to boolean
    // true if token exists, false if null
    const isAuthenticated = !!token

    return { user, token, login, logout, isAuthenticated }
}