"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, ChevronRight, Scissors } from "lucide-react";

interface Professional {
    id: string;
    name: string;
    specialty: string;
    imageUrl: string;
}

export default function BookingPage({ params }: { params: { slug: string } }) {
    const [studio, setStudio] = useState<any>(null);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [step, setStep] = useState(1); // 1: Prof, 2: Date/Time, 3: Form, 4: Success
    const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlot, setSelectedSlot] = useState("");
    const [slots, setSlots] = useState<string[]>([]);
    const [clientData, setClientData] = useState({ name: "", phone: "" });
    const [isLoading, setIsLoading] = useState(true);

    // Load studio and professionals
    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch(`/api/public/studio?slug=${params.slug}`);
                const data = await res.json();
                setStudio(data.studio);
                setProfessionals(data.professionals);
            } catch (error) {
                console.error("Error loading studio", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [params.slug]);

    // Load slots when date/prof changes
    useEffect(() => {
        if (selectedProf && selectedDate) {
            async function loadSlots() {
                const dateStr = format(selectedDate, "yyyy-MM-dd");
                const res = await fetch(`/api/appointments?professionalId=${selectedProf?.id}&date=${dateStr}`);
                const data = await res.json();
                setSlots(data);
            }
            loadSlots();
        }
    }, [selectedProf, selectedDate]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName: clientData.name,
                    clientPhone: clientData.phone,
                    date: selectedDate,
                    startTime: selectedSlot,
                    endTime: format(new Date(new Date(`2000-01-01T${selectedSlot}`).getTime() + 60 * 60 * 1000), "HH:mm"),
                    studioId: studio.id,
                    professionalId: selectedProf?.id,
                }),
            });
            if (res.ok) setStep(4);
        } catch (error) {
            alert("Erro ao agendar");
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Carregando...</div>;
    if (!studio) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Estúdio não encontrado</div>;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 p-6 text-center">
                <div className="flex justify-center mb-4">
                    {studio.logoUrl ? (
                        <img src={studio.logoUrl} alt={studio.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Scissors className="w-10 h-10" />
                        </div>
                    )}
                </div>
                <h1 className="text-2xl font-bold">{studio.name}</h1>
                <p className="text-zinc-500 text-sm mt-1">{studio.description || "Agende seu horário online"}</p>
            </div>

            <div className="max-w-2xl mx-auto p-4 mt-8">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Escolha o Tatuador
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {professionals.map((prof) => (
                                <button
                                    key={prof.id}
                                    onClick={() => { setSelectedProf(prof); setStep(2); }}
                                    className="premium-card bg-white dark:bg-zinc-900 flex items-center gap-4 text-left p-4"
                                >
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex-shrink-0">
                                        {prof.imageUrl && <img src={prof.imageUrl} className="w-full h-full rounded-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{prof.name}</p>
                                        <p className="text-sm text-zinc-500">{prof.specialty || "Artista"}</p>
                                    </div>
                                    <ChevronRight className="text-zinc-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline">← Voltar</button>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-primary" /> Escolha data e hora
                        </h2>

                        <input
                            type="date"
                            className="w-full p-4 rounded-xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            min={format(new Date(), "yyyy-MM-dd")}
                        />

                        <div className="grid grid-cols-3 gap-2">
                            {slots.length > 0 ? slots.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => { setSelectedSlot(slot); setStep(3); }}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${selectedSlot === slot ? "bg-primary border-primary text-white" : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50"
                                        }`}
                                >
                                    {slot}
                                </button>
                            )) : (
                                <p className="col-span-3 text-center text-zinc-500 text-sm py-8">Nenhum horário disponível para esta data.</p>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <form onSubmit={handleBooking} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button onClick={() => setStep(2)} className="text-sm text-primary hover:underline">← Voltar</button>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            Informações de Contato
                        </h2>
                        <div className="premium-card bg-zinc-100 dark:bg-zinc-900/50 p-4 border-dashed mb-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Resumo do Agendamento</p>
                            <p className="mt-2 font-medium">{selectedProf?.name}</p>
                            <p className="text-sm text-zinc-500">{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às {selectedSlot}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Seu Nome</label>
                                <input
                                    required
                                    placeholder="Nome completo"
                                    className="w-full p-4 rounded-xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={clientData.name}
                                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                                <input
                                    required
                                    placeholder="DDD + Número"
                                    className="w-full p-4 rounded-xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={clientData.phone}
                                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                                />
                            </div>
                            <button
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                type="submit"
                            >
                                Confirmar Agendamento
                            </button>
                        </div>
                    </form>
                )}

                {step === 4 && (
                    <div className="text-center py-12 space-y-6 animate-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <CheckCircle2 className="w-20 h-20 text-primary animate-bounce" />
                        </div>
                        <h2 className="text-3xl font-bold">Agendamento Realizado!</h2>
                        <p className="text-zinc-500">Seu horário foi reservado com sucesso. Entraremos em contato via WhatsApp para confirmar os detalhes.</p>
                        <button
                            onClick={() => window.open(`https://wa.me/55${studio.whatsapp.replace(/\D/g, "")}?text=Olá! Acabei de agendar uma tatuagem com ${selectedProf?.name} para o dia ${format(selectedDate, "dd/MM")} às ${selectedSlot}.`, "_blank")}
                            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            Falar no WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
