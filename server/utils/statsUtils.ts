export function calculateResponseRate(
    total: number,
    responded: number
): number {
    if (total === 0) return 0;
    return Math.round((responded / total) * 100);
}

export function groupByStatus(
    applications: { status: string }[]
): Record<string, number> {
    return applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}