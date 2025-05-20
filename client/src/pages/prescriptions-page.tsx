import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { SidebarNavigation } from '@/components/layout/sidebar-navigation';
import { TopNavigation } from '@/components/layout/top-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';

// Prescription form schema
const prescriptionFormSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required" }),
  medication: z.string().min(1, { message: "Medication is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  instructions: z.string().optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;

export default function PrescriptionsPage() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [openNewPrescription, setOpenNewPrescription] = useState(false);
  const { user } = useAuth();
  
  // Role-based permissions
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const canCreatePrescription = isAdmin || isDoctor;
  
  // Mock patients data (would be fetched from API)
  const { data: patients } = useQuery({
    queryKey: ['/api/patients'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Mock prescriptions data (would be fetched from API)
  const prescriptions = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      patientId: 1,
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      duration: "7 days",
      status: "active",
      prescribedBy: "Dr. Roberts",
      prescribedOn: new Date("2023-05-15"),
      instructions: "Take with food",
    },
    {
      id: 2,
      patientName: "Michael Thompson",
      patientId: 2,
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "30 days",
      status: "active",
      prescribedBy: "Dr. Wilson",
      prescribedOn: new Date("2023-05-14"),
      instructions: "Take in the morning",
    },
    {
      id: 3,
      patientName: "Emma Peterson",
      patientId: 3,
      medication: "Metformin",
      dosage: "1000mg",
      frequency: "Twice daily",
      duration: "90 days",
      status: "active",
      prescribedBy: "Dr. Roberts",
      prescribedOn: new Date("2023-05-10"),
      instructions: "Take with meals",
    },
    {
      id: 4,
      patientName: "James Wilson",
      patientId: 4,
      medication: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      duration: "30 days",
      status: "completed",
      prescribedBy: "Dr. Adams",
      prescribedOn: new Date("2023-04-15"),
      instructions: "Take in the evening",
    },
    {
      id: 5,
      patientName: "Emily Davis",
      patientId: 5,
      medication: "Albuterol",
      dosage: "90mcg",
      frequency: "As needed",
      duration: "30 days",
      status: "active",
      prescribedBy: "Dr. Wilson",
      prescribedOn: new Date("2023-05-08"),
      instructions: "2 puffs for shortness of breath",
    },
  ];

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Form handling
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      patientId: "",
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  });

  const onSubmit = (data: PrescriptionFormValues) => {
    console.log("Prescription form data:", data);
    // Here you would submit to your API
    setOpenNewPrescription(false);
    form.reset();
  };

  // Filter handling
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filteredPrescriptions = statusFilter === "all" 
    ? prescriptions 
    : prescriptions.filter(p => p.status === statusFilter);

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
        <TopNavigation onMenuToggle={toggleMobileSidebar} notificationCount={0} />
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-neutral-lightest">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-dark">Prescriptions</h1>
              <p className="text-neutral-medium">Manage patient prescriptions and medication</p>
            </div>
            
            {canCreatePrescription && (
              <Dialog open={openNewPrescription} onOpenChange={setOpenNewPrescription}>
                <DialogTrigger asChild>
                  <Button className="flex items-center">
                    <i className="ri-add-line mr-2"></i>
                    New Prescription
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Prescription</DialogTitle>
                    <DialogDescription>
                      Add a new prescription for a patient. Fill out all required information.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="patientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patient</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select patient" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {patients?.map((patient: any) => (
                                  <SelectItem key={patient.id} value={patient.id.toString()}>
                                    {patient.firstName} {patient.lastName}
                                  </SelectItem>
                                )) || (
                                  <>
                                    <SelectItem value="1">Sarah Johnson</SelectItem>
                                    <SelectItem value="2">Michael Thompson</SelectItem>
                                    <SelectItem value="3">Emma Peterson</SelectItem>
                                    <SelectItem value="4">James Wilson</SelectItem>
                                    <SelectItem value="5">Emily Davis</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="medication"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medication</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter medication name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="dosage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dosage</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 500mg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="frequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Twice daily" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 7 days" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Instructions</FormLabel>
                            <FormControl>
                              <Input placeholder="Additional instructions (optional)" {...field} />
                            </FormControl>
                            <FormDescription>
                              Any specific instructions for taking the medication
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setOpenNewPrescription(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Prescription</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Search prescriptions..."
                    className="w-full"
                    prefix={<i className="ri-search-line"></i>}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium whitespace-nowrap">Status:</span>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prescriptions</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Prescriptions table */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription List</CardTitle>
              <CardDescription>
                {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Prescribed On</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.length > 0 ? (
                    filteredPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.patientName}</TableCell>
                        <TableCell>{prescription.medication}</TableCell>
                        <TableCell>
                          {prescription.dosage}, {prescription.frequency}, {prescription.duration}
                        </TableCell>
                        <TableCell>{format(prescription.prescribedOn, 'PP')}</TableCell>
                        <TableCell>{prescription.prescribedBy}</TableCell>
                        <TableCell>
                          <Badge
                            variant={prescription.status === 'active' ? 'default' : 'secondary'}
                          >
                            {prescription.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <i className="ri-eye-line"></i>
                            </Button>
                            {canCreatePrescription && (
                              <Button size="sm" variant="ghost">
                                <i className="ri-edit-line"></i>
                              </Button>
                            )}
                            {isAdmin && (
                              <Button size="sm" variant="ghost" className="text-destructive">
                                <i className="ri-delete-bin-line"></i>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-neutral-medium">
                        No prescriptions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
        
        {/* Mobile bottom navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}