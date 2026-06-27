"use client";

import { useRouter } from "next/navigation";

type StatusSelectProps = {
    id: string;
    status: string;
};

const statuses = ["SAVED", "APPLIED", "INTERVIEW", "REJECTED", "OFFER"];

export default function StatusSelect({ id, status }: StatusSelectProps) {
    const router = useRouter();

    async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        await fetch(`/api/jobs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: event.target.value,
            }),
        });

        router.refresh();
    }

    return (
        <select
            value={status}
            onChange={handleChange}
            className="mt-3 rounded border p-2"
        >
            {statuses.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                    {statusOption}
                </option>
            ))}
        </select>
    );
}