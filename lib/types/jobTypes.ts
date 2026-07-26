import type { JOB_FILTERS, JOB_STATUSES, JOB_SORT_OPTIONS } from "@/lib/constants/jobConstants";

export type JobStatus = (typeof JOB_STATUSES)[number];

export type JobFilter = (typeof JOB_FILTERS)[number];

export type JobSortOption = (typeof JOB_SORT_OPTIONS)[number];

export type Job = {
    id: string;
    company: string;
    position: string;
    location: string | null;
    salary: string | null;
    jobUrl: string | null;
    notes: string | null;
    status: JobStatus;
    appliedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};