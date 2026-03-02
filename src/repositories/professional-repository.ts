import prisma from "@/lib/prisma";
import { Professional, Prisma } from "@prisma/client";

export class ProfessionalRepository {
    async findByStudio(studioId: string): Promise<Professional[]> {
        return prisma.professional.findMany({
            where: { studioId },
            include: { availabilities: true },
        });
    }

    async findById(id: string, studioId: string): Promise<Professional | null> {
        return prisma.professional.findFirst({
            where: { id, studioId },
            include: { availabilities: true },
        });
    }

    async create(data: Prisma.ProfessionalCreateUncheckedCreateInput): Promise<Professional> {
        return prisma.professional.create({ data });
    }

    async update(id: string, studioId: string, data: Prisma.ProfessionalUpdateInput): Promise<Professional> {
        return prisma.professional.update({
            where: { id, studioId }, // Ensures professional belongs to the studio
            data,
        });
    }

    async delete(id: string, studioId: string): Promise<Professional> {
        return prisma.professional.delete({
            where: { id, studioId },
        });
    }
}
