import type { JobStatus } from "@/lib/types/jobTypes";

type StatusBadgeProps = {
    status: JobStatus;
};

const statusStyles: Record<JobStatus, string> = {
    SAVED: "bg-zinc-100 text-zinc-700",
    APPLIED: "bg-blue-100 text-blue-700",
    INTERVIEW: "bg-amber-100 text-amber-700",
    REJECTED: "bg-red-100 text-red-700",
    OFFER: "bg-green-100 text-green-700",
};

const statusLabels: Record<JobStatus, string> = {
    SAVED: "Saved",
    APPLIED: "Applied",
    INTERVIEW: "Interview",
    REJECTED: "Rejected",
    OFFER: "Offer",
};

export default function StatusBadge({status,}: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    );
}