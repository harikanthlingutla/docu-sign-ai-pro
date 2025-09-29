import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  index?: number;
}

export function StatCard({ title, value, change, icon: Icon, trend = "neutral", index = 0 }: StatCardProps) {
  const trendColors = {
    up: "text-emerald-600 dark:text-emerald-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card interactive-hover group"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <span className={`text-xs font-medium ${trendColors[trend]}`}>
                {change}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-3 glass-panel group-hover:scale-110 transition-transform duration-200">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}