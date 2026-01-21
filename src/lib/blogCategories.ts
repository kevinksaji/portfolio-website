export type TopCategoryKey = 'sports' | 'hobbies' | 'academics';

export function isTopCategoryKey(value: string): value is TopCategoryKey {
    return value === 'sports' || value === 'hobbies' || value === 'academics';
}

export function categorizePostCategory(rawCategory?: string | null): TopCategoryKey | null {
    const value = (rawCategory || '').trim().toLowerCase();
    if (!value) return null;
    if (value === 'sports') return 'sports';
    if (value === 'hobbies') return 'hobbies';
    if (value === 'academics') return 'academics';
    return null;
}
