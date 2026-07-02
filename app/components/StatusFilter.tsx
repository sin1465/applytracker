type StatusFilterProps = {
    currentStatus?: string;
};

const statuses = ["ALL", "SAVED", "APPLIED", "INTERVIEW", "REJECTED", "OFFER"];

export default function StatusFilter({ currentStatus }: StatusFilterProps) {
    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {statuses.map((status) => {
                const href = status === "ALL" ? "/" : `/?status=${status}`;
                const isActive = status === "ALL" ? !currentStatus : currentStatus === status;

                return (
                    <a
                        key={status}
                        href={href}
                        className={`rounded px-3 py-1 text-sm ${
                        isActive
                            ? "bg-black text-white"
                            : "border bg-white text-black"
                        }`}
                    >
                        {status}
                    </a>
                );
            })}
        </div>
    );
}