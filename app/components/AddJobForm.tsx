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

    // Form visibility
    const [isOpen, setIsOpen] = useState(false);

    // Job fields
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [jobUrl, setJobUrl] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState<JobStatus>("SAVED");

    // Form state
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function resetForm() {
        setCompany("");
        setPosition("");
        setLocation("");
        setSalary("");
        setJobUrl("");
        setNotes("");
        setStatus("SAVED");

        setFieldErrors({});
        setFormError("");
    }

    function handleCancel() {
        resetForm();
        setSuccessMessage("");
        setIsOpen(false);
    }

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

            resetForm();
            setSuccessMessage("Job application added successfully.");

            router.refresh();

            // Close the form after a successful submission.
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to submit job application:", error);
            setFormError("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Collapsed state
    if (!isOpen) {
        return (
            <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-900">
                            Add an application
                        </h2>

                        <p className="mt-1 text-sm text-zinc-600">
                            Record a new job opportunity in your tracker.
                        </p>

                        {successMessage && (
                            <p
                                role="status"
                                className="mt-2 text-sm font-medium text-green-700"
                            >
                                {successMessage}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSuccessMessage("");
                            setIsOpen(true);
                        }}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
                    >
                        Add Job
                    </button>
                </div>
            </section>
        );
    }

    // Expanded form
    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900">
                        Add Job Application
                    </h2>

                    <p className="mt-1 text-sm text-zinc-600">
                        Enter the details of the opportunity you want to track.
                    </p>
                </div>
            </div>

            {formError && (
                <div
                    role="alert"
                    className="mb-5 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                >
                    {formError}
                </div>
            )}

            {/* Main fields */}
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Company
                    </label>

                    <input
                        id="company"
                        type="text"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
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
                    <label htmlFor="position" className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Position
                    </label>

                    <input
                        id="position"
                        type="text"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
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
                    <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Location
                    </label>

                    <input
                        id="location"
                        type="text"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
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
                    <label htmlFor="salary" className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Salary
                    </label>

                    <input
                        id="salary"
                        type="text"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
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

                <div className="sm:col-span-2">
                    <label htmlFor="jobUrl" className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Job URL
                    </label>

                    <input
                        id="jobUrl"
                        type="url"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
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
                    <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Status
                    </label>

                    <select
                        id="status"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                        value={status}
                        onChange={(event) => setStatus(event.target.value as JobStatus)}
                        disabled={isSubmitting}
                    >
                        {JOB_STATUSES.map((statusOption) => (
                            <option
                                key={statusOption}
                                value={statusOption}
                            >
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
            </div>

            <div className="mt-5">
                <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Notes
                </label>

                <textarea
                    id="notes"
                    rows={4}
                    className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="Interview notes, recruiter details, follow-up reminders..."
                />

                {fieldErrors.notes?.map((message) => (
                    <p key={message} className="mt-1 text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100 pt-5">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Application"}
                </button>
            </div>
        </form>
    );
}