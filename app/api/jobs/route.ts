import { prisma } from "@/lib/prisma";
import { createJobSchema } from "@/lib/validation/jobSchemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
    try {
        const jobs = await prisma.jobApplication.findMany({
            orderBy: {
                createdAt: "desc",  // newest jobs appear first
            },
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error("Failed to retrieve jobs:", error);

        return NextResponse.json(
            { error: "Failed to retrieve job applications" },
            { status: 500 }
        );
    }    
}

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const result = createJobSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid job application data",
                    details: z.flattenError(result.error).fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = result.data;

        const job = await prisma.jobApplication.create({
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

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error("Failed to create job:", error);

        return NextResponse.json(
            { error: "Failed to create job application" },
            { status: 500 }
        );
    }
}