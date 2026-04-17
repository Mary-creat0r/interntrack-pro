//Utility functions for application analytics
//Extracted into a separate module to enable unit testing in isolation

//Calculates the percentage of applications that received a response
//A "response" is any status beyond APPLIED - interview, assessment, offer or rejection
//Returns 0 when total is 0 to prevent division by 0

export function calculateResponseRate(
    total: number,
    responded: number
): number {
    if (total === 0) return 0;
    return Math.round((responded / total) * 100);
}

// Groups an array of applications by their status field
// Returns an object like { APPLIED: 3, INTERVIEW: 2, OFFER: 1 }
// Used to populate the pipeline breakdown in the stats endpoint
export function groupByStatus(
    applications: { status: string }[]
): Record<string, number> {
    return applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}