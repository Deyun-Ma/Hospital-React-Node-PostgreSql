import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { href: "/patients", label: "Patients", icon: "ri-user-heart-line" },
    { href: "/appointments", label: "Appointments", icon: "ri-calendar-check-line" },
    { href: "/more", label: "More", icon: "ri-more-line" },
  ];

  return (
    <nav className="md:hidden bg-white border-t border-neutral-light py-2 px-4">
      <div className="flex justify-between">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center px-3 py-1", 
              location === item.href ? "text-primary" : "text-neutral-medium"
            )}
          >
            <i className={cn(item.icon, "text-xl")}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
