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