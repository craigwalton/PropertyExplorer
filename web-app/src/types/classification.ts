export const CLASSIFICATION_OPTIONS = [
    {id: 'shortlist', display: 'Shortlist'},
    {id: 'unclassified', display: 'Unclassified'},
    {id: 'reject', display: 'Rejected'},
] as const;

export type Classification = typeof CLASSIFICATION_OPTIONS[number]['id'];
