import prisma from "@/lib/prisma";
import { Appointment, Prisma } from "@prisma/client";
import { addMinutes, parse, isAfter, isBefore, isEqual, format } from "date-fns";

export class SchedulingService {
    async getAvailableSlots(professionalId: string, date: Date, duration = 60) {
        const dayOfWeek = date.getDay();

        // 1. Get working hours for the day
        const workingHours = await prisma.availability.findMany({
            where: { professionalId, dayOfWeek },
        });

        if (workingHours.length === 0) return [];

        // 2. Get existing appointments and blocked slots
        const appointments = await prisma.appointment.findMany({
            where: {
                professionalId,
                date: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lte: new Date(date.setHours(23, 59, 59, 999)),
                },
                status: { not: "CANCELLED" },
            },
        });

        const blockedSlots = await prisma.blockedSlot.findMany({
            where: {
                professionalId,
                date: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lte: new Date(date.setHours(23, 59, 59, 999)),
                },
            },
        });

        const slots: string[] = [];

        for (const range of workingHours) {
            let current = parse(range.startTime, "HH:mm", new Date());
            const end = parse(range.endTime, "HH:mm", new Date());

            while (isBefore(current, end)) {
                const slotStartStr = format(current, "HH:mm");
                const slotEnd = addMinutes(current, duration);
                const slotEndStr = format(slotEnd, "HH:mm");

                if (isAfter(slotEnd, end)) break;

                // Check for overlaps
                const isOccupied = appointments.some((app) => {
                    return (
                        (slotStartStr >= app.startTime && slotStartStr < app.endTime) ||
                        (slotEndStr > app.startTime && slotEndStr <= app.endTime)
                    );
                });

                const isBlocked = blockedSlots.some((block) => {
                    if (!block.startTime || !block.endTime) return true; // Whole day blocked
                    return (
                        (slotStartStr >= block.startTime && slotStartStr < block.endTime) ||
                        (slotEndStr > block.startTime && slotEndStr <= block.endTime)
                    );
                });

                if (!isOccupied && !isBlocked) {
                    slots.push(slotStartStr);
                }

                current = addMinutes(current, 30); // 30 min intervals
            }
        }

        return slots;
    }

    async createAppointment(data: Prisma.AppointmentUncheckedCreateInput) {
        // Double check availability before creating
        const available = await this.checkSlotAvailability(
            data.professionalId,
            new Date(data.date),
            data.startTime,
            data.endTime
        );

        if (!available) throw new Error("Horário não disponível");

        return prisma.appointment.create({ data });
    }

    private async checkSlotAvailability(professionalId: string, date: Date, startTime: string, endTime: string) {
        const existing = await prisma.appointment.findFirst({
            where: {
                professionalId,
                date: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lte: new Date(date.setHours(23, 59, 59, 999)),
                },
                status: { not: "CANCELLED" },
                OR: [
                    {
                        startTime: { gte: startTime, lt: endTime },
                    },
                    {
                        endTime: { gt: startTime, lte: endTime },
                    },
                ],
            },
        });

        if (existing) return false;

        const blocked = await prisma.blockedSlot.findFirst({
            where: {
                professionalId,
                date: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lte: new Date(date.setHours(23, 59, 59, 999)),
                },
                OR: [
                    { startTime: null }, // Whole day
                    {
                        startTime: { gte: startTime, lt: endTime },
                    },
                    {
                        endTime: { gt: startTime, lte: endTime },
                    },
                ],
            },
        });

        return !blocked;
    }
}
