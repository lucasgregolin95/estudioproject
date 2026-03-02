import { NextRequest } from "next/server";
import { getAuthUser, errorResponse, successResponse } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const user = await getAuthUser(req);
    if (!user) return errorResponse("Não autorizado", 401);

    const professionals = await prisma.professional.findMany({
        where: { studioId: user.studioId },
        include: { availabilities: true },
    });

    return successResponse(professionals);
}

export async function POST(req: NextRequest) {
    const user = await getAuthUser(req);
    if (!user || user.role !== "ADMIN") return errorResponse("Não autorizado", 401);

    try {
        const body = await req.json();
        const professional = await prisma.professional.create({
            data: {
                name: body.name,
                specialty: body.specialty,
                bio: body.bio,
                imageUrl: body.imageUrl,
                studioId: user.studioId,
            },
        });
        return successResponse(professional, 201);
    } catch (error: any) {
        return errorResponse(error.message, 400);
    }
}
