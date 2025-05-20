import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
}

export function SidebarNavigation({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { href: "/patients", label: "Patients", icon: "ri-user-heart-line" },
    { href: "/staff", label: "Staff", icon: "ri-nurse-line" },
    { href: "/appointments", label: "Appointments", icon: "ri-calendar-check-line" },
    { href: "/reports", label: "Reports", icon: "ri-file-chart-line" },
    { href: "/settings", label: "Settings", icon: "ri-settings-4-line" },
  ];

  return (
    <aside className={cn("bg-white shadow-md flex flex-col w-64 transition-all duration-300", className)}>
      <div className="p-4 border-b border-neutral-light">
        <div className="flex items-center">
          <i className="ri-heart-pulse-line text-primary text-2xl mr-2"></i>
          <h1 className="text-xl font-bold text-neutral-dark">MediCare HMS</h1>
        </div>
      </div>
      
      <div className="p-4 border-b border-neutral-light">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full text-white flex items-center justify-center mr-3">
            <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-dark">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-neutral-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-2 flex-1 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-1">
              <Link href={item.href} className={cn(
                "flex items-center py-2 px-4 rounded-lg transition-all", 
                location === item.href 
                  ? "bg-primary-light bg-opacity-10 text-primary" 
                  : "hover:bg-neutral-lightest text-neutral-medium hover:text-neutral-dark"
              )}>
                <i className={cn(item.icon, "mr-3")}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <Separator />
      
      <div className="p-4">
        <button 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex items-center text-neutral-medium hover:text-neutral-dark w-full transition-all"
        >
          <i className="ri-logout-box-line mr-3"></i>
          <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
}
