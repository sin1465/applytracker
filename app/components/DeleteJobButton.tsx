"use client";

import { useRouter } from "next/navigation";

type DeleteJobButtonProps = {
    id: string;
};

export default function DeleteJobButton({ id }: DeleteJobButtonProps) {
    const router = useRouter();

    async function handleDelete() {
        await fetch(`/api/jobs/${id}`, {
            method: "DELETE",
        });

        router.refresh();
    }

    return (
        <button
            onClick={handleDelete}
            className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white"
        >
            Delete
        </button>
    );
}