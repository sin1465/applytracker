import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const jobs = await prisma.jobApplication.findMany({
        orderBy: {
            createdAt: "desc",  // newest jobs appear first
        },
    });

    return NextResponse.json(jobs);
}

export async function POST(request: Request) {
    const body = await request.json();

    const job = await prisma.jobApplication.create({
        data: {
            company: body.company,
            position: body.position,
            location: body.location,
            salary: body.salary,
            notes: body.notes,
        },
    });

    return NextResponse.json(job, {
        status: 201,
    });
}