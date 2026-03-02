import { NextRequest } from "next/server";
import { SchedulingService } from "@/services/scheduling-service";
import { successResponse, errorResponse } from "@/lib/api-helpers";

const schedulingService = new SchedulingService();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const professionalId = searchParams.get("professionalId");
    const dateStr = searchParams.get("date");

    if (!professionalId || !dateStr) {
        return errorResponse("ProfessionalId e Data são obrigatórios", 400);
    }

    try {
        const slots = await schedulingService.getAvailableSlots(professionalId, new Date(dateStr));
        return successResponse(slots);
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const appointment = await schedulingService.createAppointment(body);
        return successResponse(appointment, 201);
    } catch (error: any) {
        return errorResponse(error.message, 400);
    }
}
