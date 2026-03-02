import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function errorResponse(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

export function successResponse(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

export async function getAuthUser(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    return decoded as { userId: string; email: string; role: string; studioId: string } | null;
}
