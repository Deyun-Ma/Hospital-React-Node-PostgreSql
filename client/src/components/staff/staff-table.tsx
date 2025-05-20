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
import { Badge } from "@/components/ui/badge";
import { StaffForm } from "@/components/staff/staff-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Staff, User } from "@shared/schema";

interface StaffTableProps {
  staffMembers: (Staff & { user: User })[];
  users: User[];
  isLoading: boolean;
}

export function StaffTable({ staffMembers, users, isLoading }: StaffTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<(Staff & { user: User }) | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredStaff = staffMembers.filter((staff) => {
    const fullName = `${staff.user.firstName} ${staff.user.lastName}`.toLowerCase();
    const department = staff.department.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || department.includes(query);
  });

  const handleEdit = (staff: Staff & { user: User }) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleDelete = (staff: Staff & { user: User }) => {
    setSelectedStaff(staff);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;

    try {
      await apiRequest("DELETE", `/api/staff/${selectedStaff.id}`);
      
      toast({
        title: "Staff deleted",
        description: "Staff has been deleted successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedStaff(null);
    }
  };

  const onFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Staff List</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Search staff..."
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
              Loading staff...
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No staff found. {searchQuery && "Try a different search term."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        {staff.user.firstName} {staff.user.lastName}
                      </TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>{staff.specialization || "—"}</TableCell>
                      <TableCell>{staff.phone}</TableCell>
                      <TableCell>{format(new Date(staff.hireDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={staff.isActive ? "default" : "secondary"}>
                          {staff.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(staff)}
                            className="h-8 w-8 p-0"
                          >
                            <i className="ri-pencil-line" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(staff)}
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

      {selectedStaff && (
        <StaffForm
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          initialData={selectedStaff}
          onSuccess={onFormSuccess}
          isEditing
          users={users}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              {selectedStaff && `${selectedStaff.user.firstName} ${selectedStaff.user.lastName}'s`}{" "}
              staff record. This action cannot be undone.
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
