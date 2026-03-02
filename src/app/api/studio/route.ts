import { NextRequest } from "next/server";
import { getAuthUser, errorResponse, successResponse } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const user = await getAuthUser(req);
    if (!user || user.role !== "ADMIN") return errorResponse("Não autorizado", 401);

    const studio = await prisma.studio.findUnique({
        where: { id: user.studioId },
        include: { professionals: true },
    });

    return successResponse(studio);
}

export async function PATCH(req: NextRequest) {
    const user = await getAuthUser(req);
    if (!user || user.role !== "ADMIN") return errorResponse("Não autorizado", 401);

    try {
        const body = await req.json();
        const studio = await prisma.studio.update({
            where: { id: user.studioId },
            data: {
                name: body.name,
                whatsapp: body.whatsapp,
                address: body.address,
                description: body.description,
                logoUrl: body.logoUrl,
            },
        });
        return successResponse(studio);
    } catch (error: any) {
        return errorResponse(error.message, 400);
    }
}
