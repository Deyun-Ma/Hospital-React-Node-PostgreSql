import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Appointment {
  id: number;
  time: Date;
  patientName: string;
  doctorName: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'in_progress' | 'completed';
}

interface AppointmentTableProps {
  appointments: Appointment[];
  className?: string;
  title?: string;
}

export function AppointmentTable({ appointments, className, title = "Today's Appointments" }: AppointmentTableProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-neutral-dark">{title}</CardTitle>
          <a href="/appointments" className="text-primary text-sm">View all</a>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium text-neutral-medium">Time</TableHead>
                <TableHead className="text-xs font-medium text-neutral-medium">Patient</TableHead>
                <TableHead className="text-xs font-medium text-neutral-medium">Doctor</TableHead>
                <TableHead className="text-xs font-medium text-neutral-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-neutral-lightest">
                  <TableCell className="text-sm text-neutral-dark">
                    {format(appointment.time, 'hh:mm a')}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-dark">{appointment.patientName}</TableCell>
                  <TableCell className="text-sm text-neutral-dark">{appointment.doctorName}</TableCell>
                  <TableCell>
                    <StatusBadge status={appointment.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
