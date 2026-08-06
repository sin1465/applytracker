import type { Job } from "@/lib/types/jobTypes";

import DeleteJobButton from "./DeleteJobButton";
import EditJobForm from "./EditJobForm";
import StatusBadge from "./StatusBadge";
import StatusSelect from "./StatusSelect";

type JobCardProps = {
    job: Job;
};

export default function JobCard({job,}: JobCardProps) {
    return (
        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-zinc-900">
                        {job.position}
                    </h3>

                    <p className="mt-1 font-medium text-zinc-700">
                        {job.company}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600">
                        <span>
                            {job.location ?? "Location not specified"}
                        </span>

                        {job.salary && (
                            <span>{job.salary}</span>
                        )}
                    </div>
                </div>

                <StatusBadge status={job.status} />
            </div>

            {job.notes && (
                <p className="mt-4 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm leading-6 text-zinc-700">
                    {job.notes}
                </p>
            )}

            {job.jobUrl && (
                <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:underline"
                >
                    View job posting
                </a>
            )}

            <div className="mt-5 border-t border-zinc-100 pt-4">
                <label
                    htmlFor={`status-select-${job.id}`}
                    className="mb-1 block text-sm font-medium text-zinc-700"
                >
                    Update status
                </label>

                <StatusSelect
                    id={job.id}
                    status={job.status}
                />
            </div>

            <div className="mt-4 flex flex-wrap items-start gap-2">
                <EditJobForm job={job} />
                <DeleteJobButton id={job.id} />
            </div>
        </article>
    );
}