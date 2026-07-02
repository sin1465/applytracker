import { prisma } from "@/lib/prisma";
import AddJobForm from "./components/AddJobForm";
import DeleteJobButton from "./components/DeleteJobButton";
import StatusSelect from "./components/StatusSelect";
import StatusFilter from "./components/StatusFilter";

type Job = {
    id: string;
    company: string;
    position: string;
    location: string | null;
    status: string;
};

export default async function Home({ searchParams, }: { searchParams: Promise<{ status?: string }>;}) {
    const { status } = await searchParams;

    const jobs = await prisma.jobApplication.findMany({
        where:
            status && status !== "ALL"
                ? { 
                    status: status as any,  // select * where status 
                } 
                : undefined,    // select * 
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">ApplyTrackr</h1>

            <AddJobForm />

            <h2 className="text-2xl font-semibold mb-4">Job Applications</h2>

            <StatusFilter currentStatus={status} />

            {jobs.length === 0 ? (
                <p>No job applications yet.</p>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job: Job) => (
                        <div key={job.id} className="border rounded-lg p-4 shadow-sm">
                            <h3 className="font-bold text-lg">{job.position}</h3>
                            <p>{job.company}</p>
                            <p>{job.location ?? "No location specified"}</p>
                            <StatusSelect id={job.id} status={job.status} />

                            <DeleteJobButton id={job.id} />
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}