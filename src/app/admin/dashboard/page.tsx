export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold dark:text-white">Bem-vindo ao Painel</h1>
                <p className="text-gray-500">Confira o que está acontecendo no seu estúdio hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card bg-white dark:bg-zinc-900">
                    <p className="text-sm text-gray-500">Agendamentos Hoje</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="premium-card bg-white dark:bg-zinc-900">
                    <p className="text-sm text-gray-500">Novos Clientes (Mês)</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="premium-card bg-white dark:bg-zinc-900">
                    <p className="text-sm text-gray-500">Receita Estimada</p>
                    <p className="text-3xl font-bold mt-2">R$ 0,00</p>
                </div>
            </div>

            <div className="premium-card bg-white dark:bg-zinc-900 min-h-[400px]">
                <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p>Nenhum agendamento para hoje.</p>
                </div>
            </div>
        </div>
    );
}
