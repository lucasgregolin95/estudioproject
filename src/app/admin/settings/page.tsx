"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Save, Loader2, Store, Smartphone, MapPin, AlignLeft } from "lucide-react";

export default function SettingsPage() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [studio, setStudio] = useState({
        name: "",
        whatsapp: "",
        address: "",
        description: "",
        logoUrl: "",
        slug: "",
    });

    useEffect(() => {
        async function loadStudio() {
            const res = await fetch("/api/studio", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setStudio(data);
            setIsLoading(false);
        }
        if (token) loadStudio();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await fetch("/api/studio", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(studio),
            });
            alert("Configurações salvas!");
        } catch (error) {
            alert("Erro ao salvar");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="animate-pulse space-y-4 pt-10"><div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div><div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div></div>;

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Configurações do Estúdio</h1>
                <p className="text-zinc-500">Gerencie as informações públicas do seu estúdio.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="premium-card bg-white dark:bg-zinc-900 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Store className="w-4 h-4 text-primary" /> Nome do Estúdio
                            </label>
                            <input
                                className="w-full p-2.5 rounded-lg border dark:border-zinc-800 bg-transparent"
                                value={studio.name}
                                onChange={(e) => setStudio({ ...studio, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-primary" /> WhatsApp para Contato
                            </label>
                            <input
                                className="w-full p-2.5 rounded-lg border dark:border-zinc-800 bg-transparent"
                                value={studio.whatsapp || ""}
                                placeholder="(00) 00000-0000"
                                onChange={(e) => setStudio({ ...studio, whatsapp: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> Endereço
                            </label>
                            <input
                                className="w-full p-2.5 rounded-lg border dark:border-zinc-800 bg-transparent"
                                value={studio.address || ""}
                                onChange={(e) => setStudio({ ...studio, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" /> Descrição Bio
                            </label>
                            <textarea
                                rows={4}
                                className="w-full p-2.5 rounded-lg border dark:border-zinc-800 bg-transparent"
                                value={studio.description || ""}
                                onChange={(e) => setStudio({ ...studio, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t dark:border-zinc-800 flex justify-between items-center">
                        <div className="text-sm text-zinc-500">
                            URL Pública: <a href={`/${studio.slug}/book`} target="_blank" className="text-primary hover:underline font-mono">/{studio.slug}/book</a>
                        </div>
                        <button
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all"
                        >
                            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
