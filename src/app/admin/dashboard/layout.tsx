"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    Scissors
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/admin/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Agenda", href: "/admin/appointments", icon: Calendar },
        { name: "Tatuadores", href: "/admin/professionals", icon: Users },
        { name: "Configurações", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <Scissors className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">TattooSaaS</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed lg:static inset-0 z-40 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 w-64 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
                    <div className="h-full flex flex-col p-6">
                        <div className="hidden lg:flex items-center gap-2 mb-10">
                            <Scissors className="w-8 h-8 text-primary" />
                            <span className="font-bold text-xl">TattooSaaS</span>
                        </div>

                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                                                ? "bg-primary text-white"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"}
                    `}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="pt-6 border-t dark:border-zinc-800">
                            <div className="flex items-center gap-3 px-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Sair do Painel
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
