import { NextRequest } from "next/server";
import { AuthService } from "@/services/auth-service";
import { successResponse, errorResponse } from "@/lib/api-helpers";

const authService = new AuthService();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, studioName, studioSlug } = body;

        if (!name || !email || !password || !studioName || !studioSlug) {
            return errorResponse("Todos os campos são obrigatórios", 400);
        }

        const { user, studio, token } = await authService.registerAdmin({
            name,
            email,
            password,
            studioName,
            studioSlug,
        });

        return successResponse({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                studioId: user.studioId,
            },
            studio,
            token,
        });
    } catch (error: any) {
        return errorResponse(error.message, 400);
    }
}
