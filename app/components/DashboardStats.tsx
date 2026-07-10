type DashboardStatsProps = {
    total: number;
    interviews: number;
    offers: number;
    rejected: number;
};

export default function DashboardStats({
    total,
    interviews,
    offers,
    rejected,
}: DashboardStatsProps) {
    const stats = [
        {
            label: "Total Applications",
            value: total,
        },
        {
            label: "Interviews",
            value: interviews,
        },
        {
            label: "Offers",
            value: offers,
        },
        {
            label: "Rejected",
            value: rejected,
        },
    ];

    return (
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-lg border bg-white p-5 shadow-sm"
                >
                    <p className="text-sm text-zinc-600">{stat.label}</p>

                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>
            ))}
        </section>
    );
}