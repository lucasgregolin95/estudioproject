import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) return errorResponse("Slug é obrigatório", 400);

    const studio = await prisma.studio.findUnique({
        where: { slug },
        include: {
            professionals: {
                select: {
                    id: true,
                    name: true,
                    specialty: true,
                    imageUrl: true,
                }
            }
        }
    });

    if (!studio) return errorResponse("Estúdio não encontrado", 404);

    return successResponse({
        studio: {
            id: studio.id,
            name: studio.name,
            description: studio.description,
            logoUrl: studio.logoUrl,
            whatsapp: studio.whatsapp,
        },
        professionals: studio.professionals
    });
}
