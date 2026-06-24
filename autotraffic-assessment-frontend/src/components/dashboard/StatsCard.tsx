import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  description: string;
  color: string; // ej. "#254bdc"
}

export default function StatsCard({ icon: Icon, label, value, description, color }: StatsCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center ring-1"
        style={{ color, borderColor: `${color}33`, backgroundColor: `${color}0D` }}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-heading text-2xl font-bold text-[#1C2230] tabular-nums">{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}