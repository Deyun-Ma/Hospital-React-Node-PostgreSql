import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, iconColor, trend, className }: StatCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-medium text-sm">{title}</p>
            <p className="text-2xl font-semibold text-neutral-dark">{value}</p>
          </div>
          <div className={cn(`w-12 h-12 rounded-full bg-opacity-10 flex items-center justify-center`, `bg-${iconColor} text-${iconColor}`)}>
            <i className={cn(icon, "text-xl")}></i>
          </div>
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <span className={cn("flex items-center", trend.isPositive ? "text-success" : "text-error")}>
              <i className={cn(trend.isPositive ? "ri-arrow-up-line" : "ri-arrow-down-line", "mr-1")}></i>
              {Math.abs(trend.value)}%
            </span>
            <span className="text-neutral-medium ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
