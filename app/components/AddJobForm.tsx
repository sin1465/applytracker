"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JOB_STATUSES } from "@/lib/constants/jobConstants";
import type { JobStatus } from "@/lib/types/jobTypes";

type FieldErrors = Record<string, string[] | undefined>;

type ErrorResponse = {
    error?: string;
    details?: FieldErrors;
};

export default function AddJobForm() {
    const router = useRouter();

    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [jobUrl, setJobUrl] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState<JobStatus>("SAVED");

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitting(true);
        setFieldErrors({});
        setFormError("");
        setSuccessMessage("");

        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company,
                    position,
                    location,
                    salary,
                    jobUrl,
                    notes,
                    status,
                }),
            });

            const data: unknown = await response.json();

            if (!response.ok) {
                const errorData = data as ErrorResponse;

                setFieldErrors(errorData.details ?? {});
                setFormError(errorData.error ?? "Unable to save job application");
                return;
            }

            setCompany("");
            setPosition("");
            setLocation("");
            setSalary("");
            setJobUrl("");
            setNotes("");
            setStatus("SAVED");

            setSuccessMessage("Job application added successfully.");

            router.refresh();
        } catch (error) {
            console.error("Failed to submit job application:", error);
            setFormError("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 space-y-5 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Add Job Application</h2>

            {formError && (
                <div
                    role="alert"
                    className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                >
                    {formError}
                </div>
            )}

            {successMessage && (
                <div
                    role="status"
                    className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700"
                >
                    {successMessage}
                </div>
            )}

            <div>
                <label htmlFor="company" className="mb-1 block font-medium">
                    Company
                </label>

                <input
                    id="company"
                    className="w-full rounded border p-2"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    disabled={isSubmitting}
                />

                {fieldErrors.company?.map((message) => (
                    <p key={message} className="mt-1 text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor="position" className="mb-1 block font-medium">
                    Position
                </label>

                <input
                    id="position"
                    className="w-full rounded border p-2"
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
                    disabled={isSubmitting}
                />

                {fieldErrors.position?.map((message) => (
                    <p key={message} className="mt-1 text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor="location" className="mb-1 block font-medium">
                    Location
                </label>

                <input
                    id="location"
                    className="w-full rounded border p-2"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    disabled={isSubmitting}
                />

                {fieldErrors.location?.map((message) => (
                    <p key={message} className="mt-1 text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor="salary" className="mb-1 block font-medium">
                    Salary
                </label>

                <input
                    id="salary"
                    className="w-full rounded border p-2"
                    placeholder="For example: $70,000–$85,000"
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                    disabled={isSubmitting}
                />

                {fieldErrors.salary?.map((message) => (
                    <p key={message} className="mt-1 text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor="jobUrl" className="mb-1 block font-medium">
                    Job URL
                </label>

                <input
                    id="jobUrl"
                    type="url"
                    className="w-full rounded border p-2"
                    placeholder="https://example.com/job"
                    value={jobUrl}
                    onChange={(event) => setJobUrl(event.target.value)}
                    disabled={isSubmitting}
                />

                {fieldErrors.jobUrl?.map((message) => (
                    <p key={message} className="mt-1 text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor="status" className="mb-1 block font-medium">
                    Status
                </label>

                <select
                    id="status"
                    className="w-full rounded border p-2"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as JobStatus)}
                    disabled={isSubmitting}
                >
                    {JOB_STATUSES.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                            {statusOption}
                        </option>
                    ))}
                </select>

                {fieldErrors.status?.map((message) => (
                    <p key={message} className="mt-1 text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor="notes" className="mb-1 block font-medium">
                    Notes
                </label>

                <textarea
                    id="notes"
                    rows={4}
                    className="w-full rounded border p-2"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    disabled={isSubmitting}
                />

                {fieldErrors.notes?.map((message) => (
                    <p key={message} className="mt-1 text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? "Saving..." : "Save Job"}
            </button>
        </form>
    );
}