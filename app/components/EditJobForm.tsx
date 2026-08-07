"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JOB_STATUSES } from "@/lib/constants/jobConstants";
import type { JobStatus, Job } from "@/lib/types/jobTypes";

type EditJobFormProps = {
    job: Job;
};

type FieldErrors = Record<string, string[] | undefined>;

type ErrorResponse = {
    error?: string;
    details?: FieldErrors;
};

export default function EditJobForm({ job }: EditJobFormProps) {
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [company, setCompany] = useState(job.company);
    const [position, setPosition] = useState(job.position);
    const [location, setLocation] = useState(job.location ?? "");
    const [salary, setSalary] = useState(job.salary ?? "");
    const [jobUrl, setJobUrl] = useState(job.jobUrl ?? "");
    const [notes, setNotes] = useState(job.notes ?? "");
    const [status, setStatus] = useState<JobStatus>(job.status);

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState("");

    function cancelEditing() {
        setCompany(job.company);
        setPosition(job.position);
        setLocation(job.location ?? "");
        setSalary(job.salary ?? "");
        setJobUrl(job.jobUrl ?? "");
        setNotes(job.notes ?? "");
        setStatus(job.status);
        setFieldErrors({});
        setFormError("");
        setIsEditing(false);
    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitting(true);
        setFieldErrors({});
        setFormError("");

        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "update-job",
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
                setFormError(
                    errorData.error ?? "Unable to update job application"
                );

                return;
            }

            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to update job:", error);
            setFormError("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isEditing) {
        return (
            <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
                Edit
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-5"
        >
            <div className="mb-5">
                <h4 className="text-lg font-semibold text-zinc-900">
                    Edit Job Application
                </h4>

                <p className="mt-1 text-sm text-zinc-600">
                    Update the saved details for this application.
                </p>
            </div>

            {formError && (
                <div
                    role="alert"
                    className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {formError}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor={`company-${job.id}`} className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Company
                    </label>

                    <input
                        id={`company-${job.id}`}
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                        disabled={isSubmitting}
                    />

                    {fieldErrors.company?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label htmlFor={`position-${job.id}`} className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Position
                    </label>

                    <input
                        id={`position-${job.id}`}
                        value={position}
                        onChange={(event) => setPosition(event.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                        disabled={isSubmitting}
                    />

                    {fieldErrors.position?.map((message) => (
                        <p key={message} className="mt-1 text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label htmlFor={`location-${job.id}`} className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Location
                    </label>

                    <input
                        id={`location-${job.id}`}
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor={`salary-${job.id}`} className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Salary
                    </label>

                    <input
                        id={`salary-${job.id}`}
                        value={salary}
                        onChange={(event) => setSalary(event.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor={`job-url-${job.id}`} className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Job URL
                    </label>

                    <input
                        id={`job-url-${job.id}`}
                        type="url"
                        value={jobUrl}
                        onChange={(event) => setJobUrl(event.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                        disabled={isSubmitting}
                    />

                    {fieldErrors.jobUrl?.map((message) => (
                        <p key={message} className="text-sm text-red-600">
                            {message}
                        </p>
                    ))}
                </div>

                <div>
                    <label htmlFor={`status-${job.id}`} className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Status
                    </label>

                    <select
                        id={`status-${job.id}`}
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value as JobStatus)
                        }
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                        disabled={isSubmitting}
                    >
                        {JOB_STATUSES.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                                {statusOption}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-4">
                <label htmlFor={`notes-${job.id}`} className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Notes
                </label>

                <textarea
                    id={`notes-${job.id}`}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={4}
                    className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>

                <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSubmitting}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}