import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Activity {
  id: string | number;
  type: 'patient' | 'appointment' | 'lab' | 'emergency';
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityCardProps {
  activities: Activity[];
  className?: string;
}

export function ActivityCard({ activities, className }: ActivityCardProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'patient':
        return { icon: "ri-user-add-line", color: "bg-info bg-opacity-10 text-info" };
      case 'appointment':
        return { icon: "ri-calendar-check-line", color: "bg-secondary bg-opacity-10 text-secondary" };
      case 'lab':
        return { icon: "ri-file-list-3-line", color: "bg-warning bg-opacity-10 text-warning" };
      case 'emergency':
        return { icon: "ri-emergency-bed-line", color: "bg-error bg-opacity-10 text-error" };
      default:
        return { icon: "ri-information-line", color: "bg-primary bg-opacity-10 text-primary" };
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-neutral-dark">Recent Activities</CardTitle>
          <a href="#" className="text-primary text-sm">View all</a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {activities.map((activity) => {
          const { icon, color } = getActivityIcon(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1", color)}>
                <i className={icon}></i>
              </div>
              <div>
                <p className="text-sm text-neutral-dark">
                  <span className="font-medium">{activity.title}</span> - {activity.description}
                </p>
                <p className="text-xs text-neutral-medium mt-1">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
