import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TopNavigationProps {
  onMenuToggle: () => void;
  notificationCount?: number;
}

export function TopNavigation({ onMenuToggle, notificationCount = 0 }: TopNavigationProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b border-neutral-light p-4 flex items-center justify-between">
      <div className="flex items-center md:hidden">
        <button 
          onClick={onMenuToggle}
          className="text-neutral-medium hover:text-neutral-dark"
        >
          <i className="ri-menu-line text-2xl"></i>
        </button>
        <div className="ml-3 flex items-center">
          <i className="ri-heart-pulse-line text-primary text-xl mr-1"></i>
          <span className="font-semibold text-neutral-dark">MediCare</span>
        </div>
      </div>
      
      <div className="flex items-center md:ml-auto">
        <div className="relative md:mr-2">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 w-full md:w-64 bg-neutral-lightest"
          />
          <i className="ri-search-line absolute left-3 top-2.5 text-neutral-medium"></i>
        </div>
        
        <div className="relative ml-2">
          <button className="p-2 text-neutral-medium hover:text-neutral-dark relative">
            <i className="ri-notification-3-line text-xl"></i>
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="hidden md:block ml-4 border-l border-neutral-light pl-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full text-white flex items-center justify-center mr-2">
              <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            </div>
            <div>
              <p className="text-xs text-neutral-medium">Welcome back,</p>
              <p className="text-sm font-medium text-neutral-dark">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
