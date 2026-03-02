"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2, Store } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        studioName: "",
        studioSlug: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "studioSlug" ? value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erro ao cadastrar");

            login(data);
            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
            <div className="max-w-md w-full premium-card shadow-xl space-y-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Cadastrar Estúdio
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Comece a gerenciar seus agendamentos hoje
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seu Nome</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                <Store className="w-4 h-4 text-primary" />
                                Dados do Estúdio
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Estúdio</label>
                                <input
                                    name="studioName"
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    value={formData.studioName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL do Estúdio (slug)</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-xs">
                                        app.com/
                                    </span>
                                    <input
                                        name="studioSlug"
                                        type="text"
                                        required
                                        className="flex-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-none rounded-r-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="meu-estudio"
                                        value={formData.studioSlug}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar Conta"}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Já tem uma conta? </span>
                        <Link href="/admin/login" className="font-medium text-primary hover:text-primary/80">
                            Faça login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
