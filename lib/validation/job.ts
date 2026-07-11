import { z } from "zod";

export const JOB_STATUSES = [
    "SAVED",
    "APPLIED",
    "INTERVIEW",
    "REJECTED",
    "OFFER",
] as const;

export const jobStatusSchema = z.enum(JOB_STATUSES);

export const createJobSchema = z.object({
    company: z
        .string()
        .trim()
        .min(1, "Company is required")
        .max(100, "Company must be 100 characters or fewer"),

    position: z
        .string()
        .trim()
        .min(1, "Position is required")
        .max(100, "Position must be 100 characters or fewer"),

    location: z
        .string()
        .trim()
        .max(100, "Location must be 100 characters or fewer")
        .optional(),

    salary: z
        .string()
        .trim()
        .max(50, "Salary must be 50 characters or fewer")
        .optional(),

    jobUrl: z
        .string()
        .trim()
        .url("Job URL must be valid")
        .optional()
        .or(z.literal("")),

    notes: z
        .string()
        .trim()
        .max(2000, "Notes must be 2000 characters or fewer")
        .optional(),

    status: jobStatusSchema.optional(),
});

export const updateJobStatusSchema = z.object({
    status: jobStatusSchema,
});

export type JobStatus = z.infer<typeof jobStatusSchema>;