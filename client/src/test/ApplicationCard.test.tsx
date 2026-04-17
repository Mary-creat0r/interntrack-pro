import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApplicationCard from '../components/ApplicationCard'

const mockApplication = {
    id: 1,
    company: 'Google',
    role: 'Software Engineer Intern',
    status: 'APPLIED',
    appliedDate: '2026-03-01T00:00:00.000Z',
    nextActionDate: '2026-04-01T00:00:00.000Z',
    notes: 'Found on LinkedIn',
    jobUrl: 'https://careers.google.com/jobs/123'
}

describe('ApplicationCard', () => {

    const mockOnStatusUpdate = vi.fn()
    const mockOnDelete = vi.fn()

    beforeEach(() => {
        mockOnStatusUpdate.mockReset()
        mockOnDelete.mockReset()
    })

    describe('when rendering application data', () => {
        it('displays the company name', () => {
            render(
                <ApplicationCard
                    application={mockApplication}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            expect(screen.getByText('Google')).toBeInTheDocument()
        })

        it('displays the role', () => {
            render(
                <ApplicationCard
                    application={mockApplication}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            expect(screen.getByText('Software Engineer Intern')).toBeInTheDocument()
        })

        it('displays the correct status in the dropdown', () => {
            render(
                <ApplicationCard
                    application={mockApplication}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            const select = screen.getByRole('combobox')
            expect(select).toHaveValue('APPLIED')
        })

        it('displays the applied date', () => {
            render(
                <ApplicationCard
                    application={mockApplication}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            expect(screen.getByText(/applied:/i)).toBeInTheDocument()
        })

        it('displays notes when provided', () => {
            render(
                <ApplicationCard
                    application={mockApplication}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            expect(screen.getByText('Found on LinkedIn')).toBeInTheDocument()
        })

        it('displays job URL link when provided', () => {
            render(
                <ApplicationCard
                    application={mockApplication}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            expect(screen.getByText('View job posting →')).toBeInTheDocument()
        })

        it('does not display job URL link when not provided', () => {
            render(
                <ApplicationCard
                    application={{ ...mockApplication, jobUrl: null }}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            expect(screen.queryByText('View job posting →')).not.toBeInTheDocument()
        })
    })

    describe('when user interacts with the card', () => {
        it('calls onDelete when × button is clicked', async () => {
            render(
                <ApplicationCard
                    application={mockApplication}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            const user = userEvent.setup()
            await user.click(screen.getByTitle('Delete application'))
            expect(mockOnDelete).toHaveBeenCalledWith(1)
        })

        it('calls onStatusUpdate when status is changed', async () => {
            render(
                <ApplicationCard
                    application={mockApplication}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            const user = userEvent.setup()
            await user.selectOptions(screen.getByRole('combobox'), 'INTERVIEW')
            expect(mockOnStatusUpdate).toHaveBeenCalledWith(1, 'INTERVIEW')
        })
    })

    describe('when optional fields are missing', () => {
        it('does not display notes section when notes is null', () => {
            render(
                <ApplicationCard
                    application={{ ...mockApplication, notes: null }}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            expect(screen.queryByText('Found on LinkedIn')).not.toBeInTheDocument()
        })

        it('does not display next action date when null', () => {
            render(
                <ApplicationCard
                    application={{ ...mockApplication, nextActionDate: null }}
                    onStatusUpdate={mockOnStatusUpdate}
                    onDelete={mockOnDelete}
                />
            )
            expect(screen.queryByText(/next:/i)).not.toBeInTheDocument()
        })
    })

})