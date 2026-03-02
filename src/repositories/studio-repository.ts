import prisma from "@/lib/prisma";
import { Studio, Prisma } from "@prisma/client";

export class StudioRepository {
    async findBySlug(slug: string): Promise<Studio | null> {
        return prisma.studio.findUnique({
            where: { slug },
        });
    }

    async findById(id: string): Promise<Studio | null> {
        return prisma.studio.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.StudioCreateInput): Promise<Studio> {
        return prisma.studio.create({ data });
    }

    async update(id: string, data: Prisma.StudioUpdateInput): Promise<Studio> {
        return prisma.studio.update({
            where: { id },
            data,
        });
    }
}
