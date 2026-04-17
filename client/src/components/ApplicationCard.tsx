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

interface Props {
    application: Application
    onStatusUpdate: (id: number, newStatus: string) => void
    onDelete: (id: number) => void
}

const statusColours: Record<string, string> = {
    APPLIED: 'bg-blue-100 text-blue-700',
    INTERVIEW: 'bg-yellow-100 text-yellow-700',
    ASSESSMENT: 'bg-purple-100 text-purple-700',
    OFFER: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700'
}

function ApplicationCard({ application, onStatusUpdate, onDelete }: Props) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition">

            {/* Card header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{application.company}</h3>
                    <p className="text-sm text-gray-500">{application.role}</p>
                </div>
                <button
                    onClick={() => onDelete(application.id)}
                    className="text-gray-300 hover:text-red-500 transition ml-2 text-lg leading-none"
                    title="Delete application"
                    aria-label={`Delete ${application.company} application`}
                >
                    ×
                </button>
            </div>

            {/* Status dropdown */}
            <select
                value={application.status}
                onChange={(e) => onStatusUpdate(application.id, e.target.value)}
                className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer mb-3 ${statusColours[application.status]}`}
                aria-label="Application status"
            >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
            </select>

            {/* Applied date */}
            <p className="text-xs text-gray-400">
                Applied: {new Date(application.appliedDate).toLocaleDateString()}
            </p>

            {/* Next action date */}
            {application.nextActionDate && (
                <p className="text-xs text-gray-400">
                    Next: {new Date(application.nextActionDate).toLocaleDateString()}
                </p>
            )}

            {/* Notes */}
            {application.notes && (
                <p className="text-xs text-gray-500 mt-2 truncate">
                    {application.notes}
                </p>
            )}

            {/* Job URL */}
            {application.jobUrl && (
                <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 hover:underline mt-1 block truncate"
                >
                View job posting →
                </a>
                )}
</div>
)
}

export default ApplicationCard