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
                className="mt-3 rounded border px-3 py-1 text-sm"
            >
                Edit
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4 rounded-lg border bg-zinc-50 p-4"
        >
            <h4 className="font-semibold">Edit Job Application</h4>

            {formError && (
                <p role="alert" className="text-sm text-red-600">
                    {formError}
                </p>
            )}

            <div>
                <label htmlFor={`company-${job.id}`} className="block text-sm">
                    Company
                </label>

                <input
                    id={`company-${job.id}`}
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    className="w-full rounded border p-2"
                    disabled={isSubmitting}
                />

                {fieldErrors.company?.map((message) => (
                    <p key={message} className="text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor={`position-${job.id}`} className="block text-sm">
                    Position
                </label>

                <input
                    id={`position-${job.id}`}
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
                    className="w-full rounded border p-2"
                    disabled={isSubmitting}
                />

                {fieldErrors.position?.map((message) => (
                    <p key={message} className="text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor={`location-${job.id}`} className="block text-sm">
                    Location
                </label>

                <input
                    id={`location-${job.id}`}
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="w-full rounded border p-2"
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label htmlFor={`salary-${job.id}`} className="block text-sm">
                    Salary
                </label>

                <input
                    id={`salary-${job.id}`}
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                    className="w-full rounded border p-2"
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label htmlFor={`job-url-${job.id}`} className="block text-sm">
                    Job URL
                </label>

                <input
                    id={`job-url-${job.id}`}
                    type="url"
                    value={jobUrl}
                    onChange={(event) => setJobUrl(event.target.value)}
                    className="w-full rounded border p-2"
                    disabled={isSubmitting}
                />

                {fieldErrors.jobUrl?.map((message) => (
                    <p key={message} className="text-sm text-red-600">
                        {message}
                    </p>
                ))}
            </div>

            <div>
                <label htmlFor={`status-${job.id}`} className="block text-sm">
                    Status
                </label>

                <select
                    id={`status-${job.id}`}
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value as JobStatus)
                    }
                    className="w-full rounded border p-2"
                    disabled={isSubmitting}
                >
                    {JOB_STATUSES.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                            {statusOption}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor={`notes-${job.id}`} className="block text-sm">
                    Notes
                </label>

                <textarea
                    id={`notes-${job.id}`}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={4}
                    className="w-full rounded border p-2"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>

                <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSubmitting}
                    className="rounded border px-3 py-2 text-sm"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}