"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteJobButtonProps = {
    id: string;
};

export default function DeleteJobButton({ id }: DeleteJobButtonProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job application?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);
        setError("");

        try {
            const response = await fetch(`/api/jobs/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                setError("Unable to delete job application.");
                return;
            }

            router.refresh();
        } catch (error) {
            console.error("Failed to delete job:", error);
            setError("A network error occurred.");
        } finally {
            setIsDeleting(false);
        }        
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </button>

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}