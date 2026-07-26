import Link from "next/link";
import { JOB_FILTERS } from "@/lib/constants/jobConstants";
import type { JobFilter, JobSortOption} from "@/lib/types/jobTypes";

type StatusFilterProps = {
    currentStatus?: JobFilter;
    currentSearch?: string;
    currentSort?: JobSortOption;
};

export default function StatusFilter({
    currentStatus,
    currentSearch,
    currentSort,
}: StatusFilterProps) {
    return (
        <nav 
            aria-label="Filter job applications by status"
            className="mb-6 flex flex-wrap gap-2"
        >
            {JOB_FILTERS.map((status) => {
                const params = new URLSearchParams(); // constructs the query string

                // status filter preserves search and sorting when users switch statuses
                if (status !== "ALL") {
                    params.set("status", status);
                }

                if (currentSearch) {
                    params.set("search", currentSearch);
                }

                if (currentSort && currentSort !== "newest") {
                    params.set("sort", currentSort);
                }

                const queryString = params.toString();
                const href = queryString ? `/?${queryString}` : "/";
                const isActive = 
                    status === "ALL"
                    ? !currentStatus || currentStatus === "ALL"
                    : currentStatus === status;

                return (
                    <Link
                        key={status}
                        href={href}
                        className={`rounded px-3 py-1 text-sm transition-colors ${
                            isActive
                                ? "bg-black text-white"
                                : "border bg-white text-black hover:bg-zinc-100"
                        }`}
                    >
                        {status}
                    </Link>
                );
            })}
        </nav>
    );
}