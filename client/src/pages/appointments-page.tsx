import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SidebarNavigation } from '@/components/layout/sidebar-navigation';
import { TopNavigation } from '@/components/layout/top-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { AppointmentTable } from '@/components/appointments/appointment-table';
import { AppointmentForm } from '@/components/appointments/appointment-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AppointmentsPage() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);

  // Fetch appointments data
  const { data: appointments = [], isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  // Fetch patients data for appointment form
  const { data: patients = [], isLoading: isPatientsLoading } = useQuery({
    queryKey: ['/api/patients'],
  });

  // Fetch staff data for appointment form
  const { data: staffMembers = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ['/api/staff'],
  });

  // Format patients for select dropdown
  const patientOptions = patients.map(patient => ({
    id: patient.id,
    fullName: `${patient.firstName} ${patient.lastName}`
  }));

  // Format staff for select dropdown
  const staffOptions = staffMembers.map(staff => ({
    id: staff.id,
    fullName: `${staff.user.firstName} ${staff.user.lastName}`,
    department: staff.department
  }));

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
              <h1 className="text-2xl font-semibold text-neutral-dark">Appointment Management</h1>
              <p className="text-neutral-medium">Schedule and manage patient appointments</p>
            </div>
            
            <Button 
              onClick={() => setIsAddAppointmentModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
          
          {/* Appointment Table */}
          <AppointmentTable 
            appointments={appointments} 
            patientOptions={patientOptions}
            staffOptions={staffOptions}
            isLoading={isAppointmentsLoading || isPatientsLoading || isStaffLoading} 
          />
          
          {/* Add Appointment Modal */}
          <AppointmentForm
            open={isAddAppointmentModalOpen}
            onOpenChange={setIsAddAppointmentModalOpen}
            patientOptions={patientOptions}
            staffOptions={staffOptions}
            onSuccess={() => {}}
          />
        </main>
        
        {/* Mobile bottom navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}
