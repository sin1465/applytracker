import type { JOB_FILTERS, JOB_STATUSES } from "@/lib/constants/jobConstants";

export type JobStatus = (typeof JOB_STATUSES)[number];

export type JobFilter = (typeof JOB_FILTERS)[number];

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