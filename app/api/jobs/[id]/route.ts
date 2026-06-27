import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(request: Request, { params }: RouteParams) {
    const { id } = await params;

    await prisma.jobApplication.delete({
        where: { id },
    });

    return NextResponse.json({ message: "Job deleted" });
}

export async function PATCH(request: Request, { params }: RouteParams) {
    const { id } = await params;
    const body = await request.json();

    const updatedJob = await prisma.jobApplication.update({
        where: { id },
        data: {
            status: body.status,
        },
    });

    return NextResponse.json(updatedJob);
}