import { cn } from "@/lib/utils";

type StatusType = 'confirmed' | 'pending' | 'cancelled' | 'in_progress' | 'completed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    confirmed: {
      bgColor: "bg-success bg-opacity-10",
      textColor: "text-success",
      label: "Confirmed"
    },
    pending: {
      bgColor: "bg-warning bg-opacity-10",
      textColor: "text-warning",
      label: "Pending"
    },
    cancelled: {
      bgColor: "bg-error bg-opacity-10",
      textColor: "text-error",
      label: "Cancelled"
    },
    in_progress: {
      bgColor: "bg-info bg-opacity-10",
      textColor: "text-info",
      label: "In Progress"
    },
    completed: {
      bgColor: "bg-secondary bg-opacity-10",
      textColor: "text-secondary",
      label: "Completed"
    }
  };

  const { bgColor, textColor, label } = statusConfig[status];

  return (
    <span className={cn(
      "px-2 py-1 text-xs rounded-full inline-flex items-center justify-center",
      bgColor,
      textColor,
      className
    )}>
      {label}
    </span>
  );
}
