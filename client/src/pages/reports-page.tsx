import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SidebarNavigation } from '@/components/layout/sidebar-navigation';
import { TopNavigation } from '@/components/layout/top-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for reports
const admissionsByMonthData = [
  { name: 'Jan', patients: 65 },
  { name: 'Feb', patients: 59 },
  { name: 'Mar', patients: 80 },
  { name: 'Apr', patients: 81 },
  { name: 'May', patients: 56 },
  { name: 'Jun', patients: 55 },
  { name: 'Jul', patients: 40 },
  { name: 'Aug', patients: 50 },
  { name: 'Sep', patients: 65 },
  { name: 'Oct', patients: 75 },
  { name: 'Nov', patients: 70 },
  { name: 'Dec', patients: 60 },
];

const appointmentStatusData = [
  { name: 'Completed', value: 45 },
  { name: 'Confirmed', value: 25 },
  { name: 'Pending', value: 15 },
  { name: 'Cancelled', value: 10 },
  { name: 'In Progress', value: 5 },
];

const departmentPatientDistribution = [
  { name: 'Cardiology', patients: 150 },
  { name: 'Neurology', patients: 120 },
  { name: 'Pediatrics', patients: 90 },
  { name: 'Orthopedics', patients: 80 },
  { name: 'Oncology', patients: 70 },
  { name: 'Radiology', patients: 50 },
  { name: 'Emergency', patients: 110 },
];

export default function ReportsPage() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [timeRange, setTimeRange] = useState('year');

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Colors for charts
  const COLORS = ['#1976D2', '#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#607D8B'];

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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-dark">Reports</h1>
            <p className="text-neutral-medium">Hospital analytics and key metrics</p>
          </div>
          
          <Tabs defaultValue="patients" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patients">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Patient Admissions Trend</CardTitle>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Select Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="h-[400px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={admissionsByMonthData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="patients" stroke="#1976D2" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Male', value: 55 },
                            { name: 'Female', value: 42 },
                            { name: 'Other', value: 3 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[0, 1, 2].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { age: '0-17', count: 120 },
                          { age: '18-24', count: 200 },
                          { age: '25-34', count: 250 },
                          { age: '35-44', count: 230 },
                          { age: '45-54', count: 180 },
                          { age: '55-64', count: 150 },
                          { age: '65+', count: 190 },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appointment Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={appointmentStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {appointmentStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appointments by Day of Week</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { day: 'Monday', count: 35 },
                          { day: 'Tuesday', count: 42 },
                          { day: 'Wednesday', count: 48 },
                          { day: 'Thursday', count: 40 },
                          { day: 'Friday', count: 38 },
                          { day: 'Saturday', count: 25 },
                          { day: 'Sunday', count: 10 },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1976D2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appointment Trends by Month</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', scheduled: 85, completed: 75, cancelled: 10 },
                        { month: 'Feb', scheduled: 90, completed: 82, cancelled: 8 },
                        { month: 'Mar', scheduled: 95, completed: 78, cancelled: 17 },
                        { month: 'Apr', scheduled: 100, completed: 90, cancelled: 10 },
                        { month: 'May', scheduled: 88, completed: 82, cancelled: 6 },
                        { month: 'Jun', scheduled: 95, completed: 85, cancelled: 10 },
                        { month: 'Jul', scheduled: 80, completed: 70, cancelled: 10 },
                        { month: 'Aug', scheduled: 85, completed: 75, cancelled: 10 },
                        { month: 'Sep', scheduled: 90, completed: 80, cancelled: 10 },
                        { month: 'Oct', scheduled: 95, completed: 88, cancelled: 7 },
                        { month: 'Nov', scheduled: 100, completed: 92, cancelled: 8 },
                        { month: 'Dec', scheduled: 85, completed: 75, cancelled: 10 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="scheduled" stroke="#1976D2" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="completed" stroke="#4CAF50" />
                      <Line type="monotone" dataKey="cancelled" stroke="#F44336" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="departments">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Patients by Department</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentPatientDistribution}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 40,
                        bottom: 10,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="patients" fill="#1976D2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Staff Distribution by Department</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Cardiology', value: 18 },
                            { name: 'Neurology', value: 15 },
                            { name: 'Pediatrics', value: 20 },
                            { name: 'Orthopedics', value: 12 },
                            { name: 'Oncology', value: 10 },
                            { name: 'Radiology', value: 8 },
                            { name: 'Emergency', value: 25 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[0, 1, 2, 3, 4, 5, 6].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Average Patient Stay by Department</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Cardiology', days: 5.2 },
                          { name: 'Neurology', days: 7.8 },
                          { name: 'Pediatrics', days: 3.5 },
                          { name: 'Orthopedics', days: 4.8 },
                          { name: 'Oncology', days: 8.5 },
                          { name: 'Emergency', days: 1.2 },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="days" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        {/* Mobile bottom navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}
