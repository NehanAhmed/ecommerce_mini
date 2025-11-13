// components/metric-card.tsx
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // A utility for conditionally joining class names
import { cloneElement, isValidElement } from "react";

interface MetricCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode; // Can be an icon component or a simple div
    borderColorClass: string; // Tailwind class for border color, e.g., "border-l-primary"
    iconBgClass: string; // Tailwind class for icon background, e.g., "bg-primary/10"
    iconColorClass?: string; // Optional: Tailwind class for icon color
}

export function MetricCard({
    title,
    value,
    icon,
    borderColorClass,
    iconBgClass,
    iconColorClass,
}: MetricCardProps) {
    return (
        <Card className={cn("p-4 border-l-4 flex flex-col justify-between h-full", borderColorClass)}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
                    <p className="text-3xl font-extrabold text-foreground leading-none">{value}</p>
                </div>
                {icon && (
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0", iconBgClass)}>
                        {isValidElement(icon) ? (
                            cloneElement(icon as React.ReactElement, {
                                className: cn("w-7 h-7", iconColorClass || (icon.props?.className || "")),
                            })
                        ) : (
                            <span className={cn("w-4 h-4 rounded-full", iconColorClass)}></span>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}