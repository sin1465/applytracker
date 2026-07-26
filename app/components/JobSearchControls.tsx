type JobSearchControlsProps = {
    currentSearch?: string;
    currentSort?: string;
    currentStatus?: string;
};

export default function JobSearchControls({
    currentSearch,
    currentSort = "newest",
    currentStatus,
}: JobSearchControlsProps) {
    return (
        <form
            action="/"
            method="GET"
            className="mb-6 grid gap-4 rounded-lg border bg-white p-4 sm:grid-cols-[1fr_auto_auto]"
        >
            {currentStatus && (
                <input
                    type="hidden"
                    name="status"
                    value={currentStatus}
                />
            )}

            <div>
                <label htmlFor="search" className="mb-1 block text-sm font-medium">
                    Search applications
                </label>

                <input
                    id="search"
                    name="search"
                    type="search"
                    defaultValue={currentSearch}
                    placeholder="Search by company or position"
                    className="w-full rounded border p-2"
                />
            </div>

            <div>
                <label htmlFor="sort" className="mb-1 block text-sm font-medium">
                    Sort by
                </label>

                <select
                    id="sort"
                    name="sort"
                    defaultValue={currentSort}
                    className="w-full rounded border p-2"
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="company-asc">Company A-Z</option>
                    <option value="company-desc">Company Z-A</option>
                </select>
            </div>

            <div className="flex items-end gap-2">
                <button
                    type="submit"
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    Apply
                </button>

                <a
                    href="/"
                    className="rounded border px-4 py-2"
                >
                    Clear
                </a>
            </div>
        </form>
    );
}