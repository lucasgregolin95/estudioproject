"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erro ao fazer login");

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
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Acesso ao Painel
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Entre para gerenciar seu estúdio de tatuagem
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                E-mail
                            </label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Senha
                            </label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Não tem uma conta? </span>
                        <Link href="/admin/register" className="font-medium text-primary hover:text-primary/80">
                            Cadastre seu estúdio
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
