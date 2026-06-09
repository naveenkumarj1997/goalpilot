import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: 'brand' | 'green' | 'gold' | 'violet';
}

export default function StatCard({ title, value, icon: Icon, trend, trendDirection, color = 'brand' }: StatCardProps) {
  const borderColorClass = color === 'brand' ? 'border-brand/20 hover:border-brand/60' : ''; // Just fallback, border color is overridden by neon-border anyway
  const neonBorderClass = `neon-border-${color}`;
  const neonTextClass = `neon-text-${color}`;
  const textIconClass = color === 'brand' ? 'text-brand' : color === 'green' ? 'text-emerald-500' : color === 'gold' ? 'text-amber-500' : 'text-purple-500';

  return (
    <div className={`glass overflow-hidden rounded-2xl p-6 ${neonBorderClass} transition-all duration-300 transform hover:-translate-y-1 group`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${textIconClass} group-hover:animate-ps-glow rounded-full`} aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-text-secondary">
              {title}
            </dt>
            <dd>
              <div className={`text-2xl font-bold text-text-primary ${neonTextClass}`}>{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
