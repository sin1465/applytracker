import { prisma } from "@/lib/prisma";
import AddJobForm from "./components/AddJobForm";
import EditJobForm from "./components/EditJobForm";
import DeleteJobButton from "./components/DeleteJobButton";
import StatusSelect from "./components/StatusSelect";
import StatusFilter from "./components/StatusFilter";
import DashboardStats from "./components/DashboardStats";
import { jobStatusSchema } from "@/lib/validation/jobSchemas";
import type { Job } from "@/lib/types/jobTypes";

export default async function Home({ searchParams, }: { searchParams: Promise<{ status?: string }>;}) {
    const { status } = await searchParams;

    const statusResult = jobStatusSchema.safeParse(status);

    const selectedStatus = statusResult.success
        ? statusResult.data
        : undefined;

    const [jobs, totalCount, interviewCount, offerCount, rejectedCount] = 
        await Promise.all([
            prisma.jobApplication.findMany({
                where: selectedStatus
                    ? { 
                        status: selectedStatus,  // select * where status 
                    } 
                    : undefined,    // select * 
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.jobApplication.count(),

            prisma.jobApplication.count({
                where: { status: "INTERVIEW" },
            }),

            prisma.jobApplication.count({
                where: { status: "OFFER" },
            }),

            prisma.jobApplication.count({
                where: { status: "REJECTED" },
            }),
        ]);

    return (
        <main className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">ApplyTrackr</h1>

            <DashboardStats 
                total={totalCount}
                interviews={interviewCount}
                offers={offerCount}
                rejected={rejectedCount}
            />

            <AddJobForm />

            <h2 className="text-2xl font-semibold mb-4">Job Applications</h2>

            <StatusFilter currentStatus={selectedStatus} />

            {jobs.length === 0 ? (
                <p>No job applications yet.</p>
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