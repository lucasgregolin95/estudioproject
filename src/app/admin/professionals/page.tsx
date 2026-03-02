"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { UserPlus, Loader2, Trash2, CalendarRange } from "lucide-react";

export default function ProfessionalsPage() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newProf, setNewProf] = useState({ name: "", specialty: "" });

    useEffect(() => {
        async function loadProfs() {
            const res = await fetch("/api/professionals", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProfessionals(data);
            setIsLoading(false);
        }
        if (token) loadProfs();
    }, [token]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const res = await fetch("/api/professionals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newProf),
            });
            const data = await res.json();
            setProfessionals([...professionals, data]);
            setNewProf({ name: "", specialty: "" });
            alert("Profissional adicionado!");
        } catch (error) {
            alert("Erro ao adicionar");
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) return <div className="animate-pulse pt-10">Carregando artistas...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Tatuadores</h1>
                    <p className="text-zinc-500">Gerencie a equipe do seu estúdio e seus horários.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <form onSubmit={handleAdd} className="premium-card bg-white dark:bg-zinc-900 space-y-4">
                    <h2 className="font-bold flex items-center gap-2 text-primary">
                        <UserPlus className="w-5 h-5" /> Adicionar Artista
                    </h2>
                    <div className="space-y-3">
                        <input
                            placeholder="Nome do Artista"
                            className="w-full p-2.5 rounded-lg border dark:border-zinc-800 bg-transparent text-sm"
                            value={newProf.name}
                            onChange={(e) => setNewProf({ ...newProf, name: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Especialidade (ex: Fineline, Blackwork)"
                            className="w-full p-2.5 rounded-lg border dark:border-zinc-800 bg-transparent text-sm"
                            value={newProf.specialty}
                            onChange={(e) => setNewProf({ ...newProf, specialty: e.target.value })}
                        />
                        <button
                            disabled={isAdding}
                            className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                        >
                            {isAdding && <Loader2 className="animate-spin w-4 h-4" />}
                            Salvar Artista
                        </button>
                    </div>
                </form>

                {professionals.map((prof) => (
                    <div key={prof.id} className="premium-card bg-white dark:bg-zinc-900 group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-primary font-bold">
                                    {prof.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold">{prof.name}</h3>
                                    <p className="text-xs text-zinc-500">{prof.specialty || "Artista"}</p>
                                </div>
                            </div>
                            <button className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-primary/10 hover:text-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all">
                                <CalendarRange className="w-3.5 h-3.5" />
                                Configurar Horários
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
