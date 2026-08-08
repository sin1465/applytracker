import { describe, expect, it } from "vitest";

import { createJobSchema, jobStatusSchema } from "./jobSchemas";

describe("jobStatusSchema", () => {
    it("accepts a valid job status", () => {
        const result = jobStatusSchema.safeParse("APPLIED");

        expect(result.success).toBe(true);
    });

    it("rejects an invalid job status", () => {
        const result = jobStatusSchema.safeParse("PENDING");

        expect(result.success).toBe(false);
    });
});

describe("createJobSchema", () => {
    it("accepts a valid job application", () => {
        const result = createJobSchema.safeParse({
            company: "Microsoft",
            position: "Junior Software Developer",
            location: "Vancouver, BC",
            salary: "$70,000",
            jobUrl: "https://example.com/job",
            notes: "Applied through company website.",
            status: "APPLIED",
        });

        expect(result.success).toBe(true);
    });

    it("rejects an empty company", () => {
        const result = createJobSchema.safeParse({
            company: "",
            position: "Software Developer",
        });

        expect(result.success).toBe(false);
    });

    it("rejects an empty position", () => {
        const result = createJobSchema.safeParse({
            company: "Microsoft",
            position: "",
        });

        expect(result.success).toBe(false);
    });

    it("rejects an invalid job URL", () => {
        const result = createJobSchema.safeParse({
            company: "Microsoft",
            position: "Software Developer",
            jobUrl: "not-a-url",
        });

        expect(result.success).toBe(false);
    });

    it("allows optional fields to be omitted", () => {
        const result = createJobSchema.safeParse({
            company: "Microsoft",
            position: "Software Developer",
        });

        expect(result.success).toBe(true);
    });

    it("uses SAVED-compatible input when status is omitted", () => {
        const result = createJobSchema.safeParse({
            company: "Microsoft",
            position: "Software Developer",
        });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.status).toBeUndefined();
        }
    });
});