import { prisma } from "@/lib/prisma";
import AddJobForm from "./components/AddJobForm";
import EditJobForm from "./components/EditJobForm";
import DeleteJobButton from "./components/DeleteJobButton";
import StatusSelect from "./components/StatusSelect";
import StatusFilter from "./components/StatusFilter";
import DashboardStats from "./components/DashboardStats";
import JobSearchControls from "./components/JobSearchControls";

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
        <main className="max-w-4xl mx-auto p-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">ApplyTrackr</h1>

                    {session?.user && (
                        <p className="mt-1 text-sm text-zinc-600">
                            Signed in as {session.user.name ?? session.user.email}
                        </p>
                    )}
                </div>

                {session?.user ? (
                    <SignOutButton />
                ) : (
                    <SignInButton />
                )}
            </header>
            

            <DashboardStats 
                total={totalCount}
                interviews={interviewCount}
                offers={offerCount}
                rejected={rejectedCount}
            />

            <AddJobForm />

            <h2 className="text-2xl font-semibold mb-4">Job Applications</h2>

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
                <p className="rounded-lg border p-6 text-center text-zinc-600">
                    No job applications match the selected filters.
                </p>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job: Job) => (
                        <div key={job.id} className="border rounded-lg p-4 shadow-sm">
                            <h3 className="font-bold text-lg">{job.position}</h3>
                            <p>{job.company}</p>
                            <p>{job.location ?? "No location specified"}</p>

                            {job.salary && <p>Salary: {job.salary}</p>}

                            {job.jobUrl && (
                                <a
                                    href={job.jobUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View job posting
                                </a>
                            )}

                            {job.notes && <p className="mt-2">{job.notes}</p>}

                            <StatusSelect id={job.id} status={job.status} />

                            <div className="flex gap-2">
                                <EditJobForm job={job} />
                                <DeleteJobButton id={job.id} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}