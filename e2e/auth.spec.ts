import { test, expect } from '@playwright/test'

test.describe('Authentication flow', () => {

    test('landing page loads and shows Get Started button', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByRole('heading', { name: 'InternTrack Pro' })).toBeVisible()
        await expect(page.getByText('Start Tracking Free')).toBeVisible()
    })

    test('Get Started button navigates to register page', async ({ page }) => {
        await page.goto('/')
        await page.getByText('Start Tracking Free').click()
        await expect(page).toHaveURL('/register')
        await expect(page.getByText('Create your free account')).toBeVisible()
    })

    test('Log In link navigates to login page', async ({ page }) => {
        await page.goto('/')
        await page.getByText('Log In').click()
        await expect(page).toHaveURL('/login')
        await expect(page.getByText('Sign in to your account')).toBeVisible()
    })

    test('login with invalid credentials shows error', async ({ page }) => {
        await page.goto('/login')
        await page.getByPlaceholder('you@university.ac.uk').fill('wrong@test.com')
        await page.getByPlaceholder('••••••••').fill('wrongpassword')
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page.getByText('Invalid email or password')).toBeVisible()
    })

    test('register then login full flow', async ({ page }) => {
        // Generate unique email to avoid conflicts
        const email = `test${Date.now()}@playwright.com`

        // Register
        await page.goto('/register')
        await page.getByPlaceholder('Mary Ogunrewo').fill('Playwright User')
        await page.getByPlaceholder('you@university.ac.uk').fill(email)
        await page.getByPlaceholder('••••••••').fill('testpassword123')
        await page.getByRole('button', { name: /create account/i }).click()

        // Should redirect to dashboard
        await expect(page).toHaveURL('/dashboard')
        await expect(page.getByText('My Applications')).toBeVisible()

        // Sign out
        await page.getByText('Sign out').click()
        await expect(page).toHaveURL('/login')

        // Login with same credentials
        await page.getByPlaceholder('you@university.ac.uk').fill(email)
        await page.getByPlaceholder('••••••••').fill('testpassword123')
        await page.getByRole('button', { name: /sign in/i }).click()

        // Should be back on dashboard
        await expect(page).toHaveURL('/dashboard')
        await expect(page.getByText('My Applications')).toBeVisible()
    })

})