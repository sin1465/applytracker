"use client";

import { useRouter } from "next/navigation";
import { JOB_STATUSES } from "@/lib/constants/jobConstants";
import type { JobStatus } from "@/lib/types/jobTypes";

type StatusSelectProps = {
    id: string;
    status: JobStatus;
};

export default function StatusSelect({ id, status }: StatusSelectProps) {
    const router = useRouter();

    async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const response = await fetch(`/api/jobs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "update-status",
                status: event.target.value,
            }),
        });

        if (!response.ok) {
            console.error("Failed to update job stattus");
            return;
        }

        router.refresh();
    }

    return (
        <select
            value={status}
            onChange={handleChange}
            className="mt-3 rounded border p-2"
        >
            {JOB_STATUSES.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                    {statusOption}
                </option>
            ))}
        </select>
    );
}