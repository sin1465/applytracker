import { prisma } from "@/lib/prisma";
import { updateJobRequestSchema, updateStatusRequestSchema } from "@/lib/validation/jobSchemas";
import { NextResponse } from "next/server";
import { z } from "zod";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        await prisma.jobApplication.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Job application deleted", });
    } catch (error) {
        console.error("Failed to delete job:", error);

        return NextResponse.json(
            { error: "Failed to delete job application" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body: unknown = await request.json();

        // The status dropdown sends only { status }.
        const statusResult = updateStatusRequestSchema.safeParse(body);

        if (statusResult.success) {
            const updatedJob = await prisma.jobApplication.update({
                where: { id },
                data: {
                    status: statusResult.data.status,
                },
            });

            return NextResponse.json(updatedJob);
        }

        // The complete edit form sends all job fields.
        const jobResult = updateJobRequestSchema.safeParse(body);

        if (!jobResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid job application data",
                    details: z.flattenError(jobResult.error).fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = jobResult.data;

        const updatedJob = await prisma.jobApplication.update({
            where: { id },
            data: {
                company: data.company,
                position: data.position,
                location: data.location || null,
                salary: data.salary || null,
                jobUrl: data.jobUrl || null,
                notes: data.notes || null,
                status: data.status ?? "SAVED",
            },
        });

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("Failed to update job:", error);

        return NextResponse.json(
            { error: "Failed to update job application" },
            { status: 500 }
        );
    }
}