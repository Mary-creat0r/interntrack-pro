import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Login from '../pages/Login'

// Mock fetch so we don't make real API calls in tests
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Wrap Login in MemoryRouter because it uses useNavigate
function renderLogin() {
    return render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    )
}

describe('Login page', () => {

    it('renders email input, password input and sign in button', () => {
        renderLogin()

        expect(screen.getByPlaceholderText('you@university.ac.uk')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('renders the InternTrack Pro heading', () => {
        renderLogin()
        expect(screen.getByText('InternTrack Pro')).toBeInTheDocument()
    })

    it('shows error message when login fails', async () => {
        // Mock a failed login response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid email or password' })
        })

        renderLogin()
        const user = userEvent.setup()

        await user.type(screen.getByPlaceholderText('you@university.ac.uk'), 'wrong@test.com')
        await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
    })

    it('shows loading state while submitting', async () => {
        // Mock a slow response
        mockFetch.mockResolvedValueOnce(
            new Promise(() => {}) // never resolves — simulates loading
        )

        renderLogin()
        const user = userEvent.setup()

        await user.type(screen.getByPlaceholderText('you@university.ac.uk'), 'test@test.com')
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
    })

})