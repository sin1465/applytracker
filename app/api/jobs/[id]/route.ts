import { prisma } from "@/lib/prisma";
import { updateJobStatusSchema } from "@/lib/validation/job";
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

        const result = updateJobStatusSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid status",
                    details: z.flattenError(result.error).fieldErrors,
                },
                { status: 400 }
            );
        }

        const updatedJob = await prisma.jobApplication.update({
            where: { id },
            data: {
                status: result.data.status,
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