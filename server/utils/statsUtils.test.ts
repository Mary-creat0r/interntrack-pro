import { calculateResponseRate, groupByStatus } from './statsUtils';

describe('calculateResponseRate', () => {

    it('returns 0 when there are no applications', () => {
        expect(calculateResponseRate(0, 0)).toBe(0);
    });

    it('returns 100 when all applications received a response', () => {
        expect(calculateResponseRate(5, 5)).toBe(100);
    });

    it('returns 0 when no applications received a response', () => {
        expect(calculateResponseRate(5, 0)).toBe(0);
    });

    it('correctly calculates 67% response rate', () => {
        expect(calculateResponseRate(3, 2)).toBe(67);
    });

    it('rounds down correctly', () => {
        expect(calculateResponseRate(3, 1)).toBe(33);
    });

    it('handles 50% response rate', () => {
        expect(calculateResponseRate(4, 2)).toBe(50);
    });

});

describe('groupByStatus', () => {

    it('counts applications by status correctly', () => {
        const applications = [
            { status: 'APPLIED' },
            { status: 'APPLIED' },
            { status: 'INTERVIEW' },
            { status: 'OFFER' }
        ];
        const result = groupByStatus(applications);
        expect(result).toEqual({
            APPLIED: 2,
            INTERVIEW: 1,
            OFFER: 1
        });
    });

    it('returns empty object for empty array', () => {
        expect(groupByStatus([])).toEqual({});
    });

    it('handles single application', () => {
        const applications = [{ status: 'REJECTED' }];
        expect(groupByStatus(applications)).toEqual({ REJECTED: 1 });
    });

});