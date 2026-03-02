import { UserRepository } from "@/repositories/user-repository";
import { StudioRepository } from "@/repositories/studio-repository";
import { hashPassword, comparePassword, signToken } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export class AuthService {
    private userRepository = new UserRepository();
    private studioRepository = new StudioRepository();

    async registerAdmin(data: { name: string; email: string; password: string; studioName: string; studioSlug: string }) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) throw new Error("Email já cadastrado");

        const existingStudio = await this.studioRepository.findBySlug(data.studioSlug);
        if (existingStudio) throw new Error("Slug do estúdio já está em uso");

        const hashedPassword = await hashPassword(data.password);

        const studio = await this.studioRepository.create({
            name: data.studioName,
            slug: data.studioSlug,
        });

        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "ADMIN",
            studioId: studio.id,
        });

        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            studioId: studio.id,
        });

        return { user, studio, token };
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("Credenciais inválidas");

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) throw new Error("Credenciais inválidas");

        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            studioId: user.studioId,
        });

        return { user, token };
    }
}
