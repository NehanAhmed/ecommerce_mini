// _components/MetricCard.tsx
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Assumes you have this utility
import { cloneElement, isValidElement } from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgClass: string; // e.g., "bg-primary/10"
  iconColorClass: string; // e.g., "text-primary"
}

export function MetricCard({
  title,
  value,
  icon,
  iconBgClass,
  iconColorClass,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "p-6 flex flex-col justify-between h-full group relative overflow-hidden",
        "border border-border", // Ensure explicit border for consistency
        "transition-all duration-300 ease-in-out", // Smooth transitions
        "hover:shadow-lg hover:border-primary-foreground/20 hover:ring-2 hover:ring-primary/20", // Subtle hover effect
      )}
    >
      {/* Subtle ring on hover, inspired by focus states */}
      <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ease-in-out group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-primary/50 group-hover:ring-offset-card" />

      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconBgClass)}>
          {isValidElement(icon) ? (
            cloneElement(icon as React.ReactElement, {
              className: cn("w-6 h-6", iconColorClass),
            })
          ) : (
            <span className={cn("w-4 h-4 rounded-full", iconColorClass)}></span>
          )}
        </div>
      </div>
      <p className="text-4xl font-extrabold text-foreground leading-tight">{value}</p>
    </Card>
  );
}