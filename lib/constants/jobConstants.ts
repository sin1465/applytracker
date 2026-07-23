export const JOB_STATUSES = [
    "SAVED",
    "APPLIED",
    "INTERVIEW",
    "REJECTED",
    "OFFER",
] as const;

export const JOB_FILTERS = [
    "ALL",
    ...JOB_STATUSES,
] as const;