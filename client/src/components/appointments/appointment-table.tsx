import { useState } from "react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PatientOption {
  id: number;
  fullName: string;
}

interface StaffOption {
  id: number;
  fullName: string;
  department: string;
}

interface AppointmentTableProps {
  appointments: any[];
  patientOptions: PatientOption[];
  staffOptions: StaffOption[];
  isLoading: boolean;
}

export function AppointmentTable({ 
  appointments, 
  patientOptions,
  staffOptions,
  isLoading 
}: AppointmentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
    const doctorName = `${appointment.staff.user.firstName} ${appointment.staff.user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return patientName.includes(query) || doctorName.includes(query);
  });

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAppointment) return;

    try {
      await apiRequest("DELETE", `/api/appointments/${selectedAppointment.id}`);
      
      toast({
        title: "Appointment deleted",
        description: "Appointment has been deleted successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const onFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Appointments List</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              Loading appointments...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No appointments found. {searchQuery && "Try a different search term."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {format(new Date(appointment.scheduledFor), "MMM d, yyyy")}
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(appointment.scheduledFor), "h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </TableCell>
                      <TableCell>
                        <div>
                          {appointment.staff.user.firstName} {appointment.staff.user.lastName}
                          <div className="text-xs text-muted-foreground">
                            {appointment.staff.department}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>
                        <StatusBadge status={appointment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(appointment)}
                            className="h-8 w-8 p-0"
                          >
                            <i className="ri-pencil-line" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(appointment)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <i className="ri-delete-bin-line" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAppointment && (
        <AppointmentForm
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          initialData={{
            ...selectedAppointment,
            scheduledFor: new Date(selectedAppointment.scheduledFor)
          }}
          patientOptions={patientOptions}
          staffOptions={staffOptions}
          onSuccess={onFormSuccess}
          isEditing
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this appointment. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
