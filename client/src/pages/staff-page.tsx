import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SidebarNavigation } from '@/components/layout/sidebar-navigation';
import { TopNavigation } from '@/components/layout/top-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { StaffTable } from '@/components/staff/staff-table';
import { StaffForm } from '@/components/staff/staff-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function StaffPage() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // Fetch staff data
  const { data: staffMembers = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ['/api/staff'],
  });

  // Fetch users data for staff assignment
  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['/api/user'],
  });

  // Format users for select dropdown in the form
  const formattedUsers = Array.isArray(users) 
    ? users 
    : users ? [users] : [];

  // Handle mobile sidebar toggle
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <SidebarNavigation className="hidden md:flex" />
      
      {/* Mobile sidebar (off-canvas) */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        >
          <div 
            className="bg-white w-64 h-full overflow-y-auto transition-all transform translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarNavigation />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopNavigation onMenuToggle={toggleMobileSidebar} notificationCount={2} />
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-neutral-lightest">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-dark">Staff Management</h1>
              <p className="text-neutral-medium">Manage hospital staff and departments</p>
            </div>
            
            <Button 
              onClick={() => setIsAddStaffModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Staff
            </Button>
          </div>
          
          {/* Staff Table */}
          <StaffTable 
            staffMembers={staffMembers} 
            users={formattedUsers}
            isLoading={isStaffLoading || isUsersLoading} 
          />
          
          {/* Add Staff Modal */}
          <StaffForm
            open={isAddStaffModalOpen}
            onOpenChange={setIsAddStaffModalOpen}
            onSuccess={() => {}}
            users={formattedUsers}
          />
        </main>
        
        {/* Mobile bottom navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}
