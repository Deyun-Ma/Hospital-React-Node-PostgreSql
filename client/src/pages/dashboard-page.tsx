import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SidebarNavigation } from '@/components/layout/sidebar-navigation';
import { TopNavigation } from '@/components/layout/top-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityCard } from '@/components/dashboard/activity-card';
import { AppointmentTable } from '@/components/dashboard/appointment-table';

export default function DashboardPage() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Stats query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Today's appointments query
  const { data: todayAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments/today'],
    staleTime: 1000 * 60, // 1 minute
  });

  // Handle mobile sidebar toggle
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Close sidebar when clicking outside of it
  const handleOutsideClick = (e: MouseEvent) => {
    if (showMobileSidebar && e.target instanceof HTMLElement) {
      if (e.target.id === 'mobile-sidebar-overlay') {
        setShowMobileSidebar(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showMobileSidebar]);

  // Mock data for charts
  const admissionData = [
    { name: 'Mon', value: 35 },
    { name: 'Tue', value: 28 },
    { name: 'Wed', value: 42 },
    { name: 'Thu', value: 30 },
    { name: 'Fri', value: 38 },
    { name: 'Sat', value: 25 },
    { name: 'Sun', value: 20 },
  ];

  const departmentData = [
    { name: 'Cardiology', value: 30 },
    { name: 'Neurology', value: 20 },
    { name: 'Pediatrics', value: 15 },
    { name: 'Orthopedics', value: 12 },
    { name: 'Oncology', value: 10 },
    { name: 'Others', value: 13 },
  ];

  const COLORS = ['#1976D2', '#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#607D8B'];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'patient',
      title: 'New patient registered',
      description: 'Sarah Johnson was added to the system',
      timestamp: 'Today, 10:45 AM',
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Appointment completed',
      description: 'Dr. Roberts completed checkup with Thomas Wright',
      timestamp: 'Today, 9:30 AM',
    },
    {
      id: 3,
      type: 'lab',
      title: 'Lab results updated',
      description: 'Blood test results for Emma Peterson are now available',
      timestamp: 'Yesterday, 4:15 PM',
    },
    {
      id: 4,
      type: 'emergency',
      title: 'Emergency admission',
      description: 'Michael Dawson admitted for emergency treatment',
      timestamp: 'Yesterday, 2:00 PM',
    },
  ];

  // Format today's appointments for the table
  const formattedAppointments = todayAppointments?.map(app => ({
    id: app.id,
    time: new Date(app.scheduledFor),
    patientName: `${app.patient.firstName} ${app.patient.lastName}`,
    doctorName: `${app.staff.user.firstName} ${app.staff.user.lastName}`,
    status: app.status,
  })) || [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <SidebarNavigation className="hidden md:flex" />
      
      {/* Mobile sidebar (off-canvas) */}
      {showMobileSidebar && (
        <div id="mobile-sidebar-overlay" className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div 
            className={`bg-white w-64 h-full overflow-y-auto transition-all duration-300 transform ${
              showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <SidebarNavigation />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopNavigation onMenuToggle={toggleMobileSidebar} notificationCount={3} />
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-neutral-lightest">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-dark">Dashboard</h1>
            <p className="text-neutral-medium">Hospital overview and statistics</p>
          </div>
          
          {/* Dashboard stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Patients" 
              value={statsLoading ? "—" : stats?.patientCount.toLocaleString()} 
              icon="ri-user-heart-line" 
              iconColor="primary"
              trend={{ value: 5.2, isPositive: true }}
            />
            
            <StatCard 
              title="Staff Members" 
              value={statsLoading ? "—" : stats?.staffCount.toLocaleString()} 
              icon="ri-nurse-line" 
              iconColor="secondary"
              trend={{ value: 1.8, isPositive: true }}
            />
            
            <StatCard 
              title="Appointments" 
              value={statsLoading ? "—" : stats?.appointmentCount.toLocaleString()} 
              icon="ri-calendar-check-line" 
              iconColor="info"
              trend={{ value: 2.3, isPositive: false }}
            />
            
            <StatCard 
              title="Bed Occupancy" 
              value={statsLoading ? "—" : `${stats?.bedOccupancy}%`} 
              icon="ri-hotel-bed-line" 
              iconColor="accent"
              trend={{ value: 3.1, isPositive: true }}
            />
          </div>
          
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-neutral-dark">Patient Admissions</h3>
                <select className="text-sm border border-neutral-light rounded-md px-2 py-1">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={admissionData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#1976D2" fill="#1976D2" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-neutral-dark">Department Distribution</h3>
                <select className="text-sm border border-neutral-light rounded-md px-2 py-1">
                  <option>By patients</option>
                  <option>By staff</option>
                  <option>By revenue</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Recent activities and upcoming appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityCard activities={recentActivities} className="mb-6 lg:mb-0" />
            
            <AppointmentTable
              appointments={formattedAppointments}
              title="Today's Appointments"
            />
          </div>
        </main>
        
        {/* Mobile bottom navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}
