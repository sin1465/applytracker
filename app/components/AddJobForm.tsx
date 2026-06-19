"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddJobForm() {
    const router = useRouter();

    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [location, setLocation] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await fetch("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                company,
                position,
                location,
            }),
        });

        setCompany("");
        setPosition("");
        setLocation("");

        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-lg border p-4">
            <h2 className="text-2xl font-semibold">Add Job Application</h2>

            <input
                className="w-full rounded border p-2"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
            />

            <input
                className="w-full rounded border p-2"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
            />

            <input
                className="w-full rounded border p-2"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />

            <button
                type="submit"
                className="rounded bg-black px-4 py-2 text-white"
            >
                Save Job
            </button>
        </form>
    );
}