export function formatRelativeDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - date.getTime()) / 86_400_000);

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}