import { z } from "zod";
import { JOB_STATUSES } from "../constants/jobConstants";

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
        .union([
            z.url("Job URL must be valid"),
            z.literal(""),
        ])
        .optional(),

    notes: z
        .string()
        .trim()
        .max(2000, "Notes must be 2000 characters or fewer")
        .optional(),

    status: jobStatusSchema.optional(),
});

export const updateStatusRequestSchema = z.object({
    action: z.literal("update-status"),
    status: jobStatusSchema,
});

export const updateJobRequestSchema = createJobSchema.extend({
    action: z.literal("update-job"),
});