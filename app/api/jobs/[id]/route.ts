import { prisma } from "@/lib/prisma";
import { updateJobRequestSchema, updateStatusRequestSchema } from "@/lib/validation/jobSchemas";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const userId = await getCurrentUserId();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const result = await prisma.jobApplication.deleteMany({
            where: { 
                id,
                userId: userId,
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: "Job application not found" },
                { status: 404 }
            );
        }

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
        const userId = await getCurrentUserId();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body: unknown = await request.json();

        const existingJob = await prisma.jobApplication.findFirst({
            // confirm that the record belongs to the current user
            where: {
                id,
                userId: userId,
            },
        });

        if (!existingJob) {
            return NextResponse.json(
                { error: "Job application not found" },
                { status: 404 }
            );
        }

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