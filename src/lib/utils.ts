export function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export function formatWhatsAppLink(phone: string, message: string) {
    const cleaned = phone.replace(/\D/g, "");
    return `https://wa.me/55${cleaned}?text=${encodeURIComponent(message)}`;
}

export function cn(...inputs: any[]) {
    // Simplified version since we haven't installed full shadcn yet
    return inputs.filter(Boolean).join(" ");
}
