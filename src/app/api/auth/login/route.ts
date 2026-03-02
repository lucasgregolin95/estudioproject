import { NextRequest } from "next/server";
import { AuthService } from "@/services/auth-service";
import { successResponse, errorResponse } from "@/lib/api-helpers";

const authService = new AuthService();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return errorResponse("E-mail e senha são obrigatórios", 400);
        }

        const { user, token } = await authService.login(email, password);

        return successResponse({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                studioId: user.studioId,
            },
            token,
        });
    } catch (error: any) {
        return errorResponse(error.message, 401);
    }
}
