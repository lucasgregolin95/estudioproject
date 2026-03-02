import prisma from "@/lib/prisma";
import { User, Prisma } from "@prisma/client";

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
            include: { studio: true },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
            include: { studio: true },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({ data });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
}
