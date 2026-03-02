import prisma from "@/lib/prisma";
import { Availability, Prisma } from "@prisma/client";

export class AvailabilityRepository {
    async findByProfessional(professionalId: string): Promise<Availability[]> {
        return prisma.availability.findMany({
            where: { professionalId },
        });
    }

    async setAvailabilities(professionalId: string, data: Prisma.AvailabilityCreateManyInput[]): Promise<void> {
        await prisma.$transaction([
            prisma.availability.deleteMany({ where: { professionalId } }),
            prisma.availability.createMany({ data }),
        ]);
    }
}
