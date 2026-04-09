import { useState } from 'react'

interface User {
    id: number
    name: string
    email: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token')
    })

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setToken(token)
        setUser(user)
        console.log('Token saved:', token)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    const isAuthenticated = !!token

    return { user, token, login, logout, isAuthenticated }
}