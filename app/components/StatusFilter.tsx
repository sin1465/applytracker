import Link from "next/link";
import { JOB_FILTERS } from "@/lib/constants/jobConstants";
import type { JobFilter } from "@/lib/types/jobTypes";

type StatusFilterProps = {
    currentStatus?: JobFilter;
};

export default function StatusFilter({ currentStatus }: StatusFilterProps) {
    return (
        <nav 
            aria-label="Filter job applications by status"
            className="mb-6 flex flex-wrap gap-2"
        >
            {JOB_FILTERS.map((status) => {
                const href = status === "ALL" ? "/" : `/?status=${status}`;
                const isActive = status === "ALL" ? !currentStatus : currentStatus === status;

                return (
                    <Link
                        key={status}
                        href={href}
                        className={`rounded px-3 py-1 text-sm transition-colors ${
                            isActive
                                ? "bg-black text-white"
                                : "border bg-white text-black"
                        }`}
                    >
                        {status}
                    </Link>
                );
            })}
        </nav>
    );
}