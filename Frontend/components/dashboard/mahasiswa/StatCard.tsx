import { CheckSquare, Clock, TrendingUp, Award } from "lucide-react";

const iconMap = {
  check: { icon: CheckSquare, bg: "bg-green-100", color: "text-green-600" },
  clock: { icon: Clock, bg: "bg-blue-100", color: "text-blue-600" },
  chart: { icon: TrendingUp, bg: "bg-pink-100", color: "text-pink-600" },
  trophy: { icon: Award, bg: "bg-amber-100", color: "text-amber-600" },
};

export default function StatCard({ label, value, icon }: {
  label: string; value: string; color: string; icon: keyof typeof iconMap;
}) {
  const { icon: Icon, bg, color } = iconMap[icon];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
        <Icon size={20} className={color} />
      </div>
    </div>
  );
}