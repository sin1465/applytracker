import { prisma } from "@/lib/prisma";
import AddJobForm from "./components/AddJobForm";
import StatusFilter from "./components/StatusFilter";
import DashboardStats from "./components/DashboardStats";
import JobSearchControls from "./components/JobSearchControls";
import JobCard from "./components/JobCard";

import { JOB_SORT_OPTIONS } from "@/lib/constants/jobConstants";
import { jobStatusSchema } from "@/lib/validation/jobSchemas";
import type { Job, JobSortOption } from "@/lib/types/jobTypes";

import { auth } from "@/auth";
import SignInButton from "./components/SignInButton";
import SignOutButton from "./components/SignOutButton";

type HomeSearchParams = {
    status?: string;
    search?: string;
    sort?: string;
};

export default async function Home({ searchParams, }: { searchParams: Promise<HomeSearchParams>;}) {
    const session = await auth();

    if (!session?.user) {
        return (
            <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-8">
                <section className="rounded-lg border bg-white p-8 text-center shadow-sm">
                    <h1 className="mb-3 text-4xl font-bold">
                        ApplyTrackr
                    </h1>

                    <p className="mb-6 text-zinc-600">
                        Sign in to manage your job applications.
                    </p>

                    <SignInButton />
                </section>
            </main>
        );
    }

    const userId = session.user.id;

    const params = await searchParams;

    const statusResult = jobStatusSchema.safeParse(params.status);

    const selectedStatus = statusResult.success
        ? statusResult.data
        : undefined;

    const search = params.search?.trim() || undefined;

    const selectedSort: JobSortOption =
        JOB_SORT_OPTIONS.includes(params.sort as JobSortOption)
            ? (params.sort as JobSortOption)
            : "newest";

    const orderBy = 
        selectedSort === "oldest"
            ? { createdAt: "asc" as const }
            : selectedSort === "company-asc"
                ? { company: "asc" as const}
                : selectedSort === "company-desc"
                    ? { company: "desc" as const }
                    : { createdAt: "desc" as const };

    const [jobs, totalCount, interviewCount, offerCount, rejectedCount] = 
        await Promise.all([
            prisma.jobApplication.findMany({
                where: {
                    userId,

                    ...(selectedStatus
                        ? { 
                            status: selectedStatus,  // select * where status 
                        } 
                        : {}),    // select *
                        
                    ...(search
                        ? {
                            OR: [   // job matches when the search appears in company or position
                                {
                                    company: {
                                        contains: search,
                                        mode: "insensitive" as const,
                                    },
                                },
                                {
                                    position: {
                                        contains: search,
                                        mode: "insensitive" as const,
                                    },
                                },
                            ],
                        }
                        : {}),
                },
                orderBy,
            }),

            prisma.jobApplication.count({
                where: {
                    userId,
                },
            }),

            prisma.jobApplication.count({
                where: { 
                    userId,
                    status: "INTERVIEW", 
                },
            }),

            prisma.jobApplication.count({
                where: { 
                    userId,
                    status: "OFFER", 
                },
            }),

            prisma.jobApplication.count({
                where: { 
                    userId,
                    status: "REJECTED",
                },
            }),
        ]);

    return (
        <div className="min-h-screen bg-zinc-50">
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            ApplyTrackr
                        </h1>

                        <p className="mt-1 text-sm text-zinc-600">
                            Signed in as {" "}
                            {session.user.name ?? session.user.email ?? "User"}
                        </p>
                    </div>
                    
                    <SignOutButton />
                </div>
            </header>
            
            <main className="mx-auto max-w-6xl px-6 py-8">
                <section className="mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                        Dashboard
                    </h2>

                    <p className="mt-2 text-zinc-600">
                        Track your applications, interviews, and offers.
                    </p>
                </section>

                <DashboardStats 
                    total={totalCount}
                    interviews={interviewCount}
                    offers={offerCount}
                    rejected={rejectedCount}
                />

                <AddJobForm />

                <section className="mt-10">
                    <div className="mb-5">
                        <h2 className="text-2xl font-semibold text-zinc-900">
                            Job Applications
                        </h2>

                        <p>
                            {jobs.length} application
                            {jobs.length === 1 ? "" : "s"} shown
                        </p>
                    </div>

                    <JobSearchControls
                        currentSearch={search}
                        currentSort={selectedSort}
                        currentStatus={selectedStatus}
                    />

                    <StatusFilter 
                        currentStatus={selectedStatus}
                        currentSearch={search}
                        currentSort={selectedSort}
                    />

                    {jobs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                            <h3 className="text-lg font-semibold text-zinc-900">
                                No applications found
                            </h3>

                            <p className="mt-2 text-sm text-zinc-600">
                                Add a new application or change your search and filter options.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </section>
            </main>            
        </div>
    );
}