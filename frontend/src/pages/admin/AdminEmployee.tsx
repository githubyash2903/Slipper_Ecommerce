import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2, UserPlus, Users, Loader2, Package, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// API Functions
import { 
  fetchEmployeesAPI, // Ensure this points to the controller updated in Step 1
  addEmployeeAPI, 
  updateEmployeeAPI, 
  deleteEmployeeAPI, 
  toggleEmployeeStatusAPI 
} from '@/api/admin/employee';

// ✅ Updated Interface based on your DB Schema
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  join_date: string;
  status: 'active' | 'inactive';
  // Dynamic Fields
  total_assigned: number;
  total_sold: number;
  current_holding: number;
}

export default function AdminEmployees() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', phone: '' });

  // 1. FETCH DATA
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployeesAPI,
  });

  // 2. MUTATIONS 
  const addMutation = useMutation({
    mutationFn: addEmployeeAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsAddDialogOpen(false);
      setNewEmployee({ name: '', email: '', phone: '' });
      toast({ title: 'Employee Added', description: 'New employee created successfully.' });
    },
    onError: (err: any) => {
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to add' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployeeAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setEditingEmployee(null);
      toast({ title: 'Updated', description: 'Employee details updated.' });
    },
    onError: (err: any) => {
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Update failed' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployeeAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: 'Deleted', description: 'Employee removed successfully.' });
    },
  });

  const statusMutation = useMutation({
    mutationFn: toggleEmployeeStatusAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: 'Status Changed', description: `Employee is now ${data.data.status}` });
    },
  });

  // Handlers
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    addMutation.mutate(newEmployee);
  };

  const handleEditEmployee = () => {
    if (!editingEmployee) return;
    updateMutation.mutate({ 
      id: editingEmployee.id, 
      data: { 
        name: editingEmployee.name, 
        email: editingEmployee.email, 
        phone: editingEmployee.phone 
      } 
    });
  };

  // Filter Logic
  const filteredEmployees = employees.filter((emp: Employee) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ DYNAMIC STATS CALCULATION
  const activeEmployees = employees.filter((emp: Employee) => emp.status === 'active').length;
  
  // Calculate totals from real data
  const totalStockAssigned = employees.reduce((acc: number, emp: Employee) => acc + Number(emp.total_assigned || 0), 0);
  const totalStockSold = employees.reduce((acc: number, emp: Employee) => acc + Number(emp.total_sold || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground">Manage your sales employees</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Employee</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={newEmployee.name} 
                    onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} 
                    placeholder="Employee Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={newEmployee.email} 
                    onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} 
                    placeholder="Employee email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={newEmployee.phone} 
                    onChange={e => setNewEmployee({ ...newEmployee, phone: e.target.value })} 
                    placeholder="+91 9876543210"
                  />
                </div>
                <Button onClick={handleAddEmployee} className="w-full" disabled={addMutation.isPending}>
                  {addMutation.isPending ? 'Adding...' : 'Add Employee'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ✅ Dynamic Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEmployees}</div>
              <p className="text-xs text-muted-foreground text-blue-600"> of {employees.length} total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assigned Stock</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{totalStockAssigned}</div>
              <p className="text-xs text-muted-foreground">Total units given to employees</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sold</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{totalStockSold}</div>
              <p className="text-xs text-muted-foreground">Total units sold</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Table */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search employees..." 
            className="pl-10" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>

        <Card>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-center">Assigned</TableHead>
                  <TableHead className="text-center">Sold</TableHead>
                  <TableHead className="text-center">Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee: Employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{employee.email}</p>
                          <p className="text-muted-foreground">{employee.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(employee.join_date).toLocaleDateString()}</TableCell>
                      
                      {/* ✅ DYNAMIC STOCK COLUMNS */}
                      <TableCell className="text-center font-medium">
                         {employee.total_assigned}
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-medium">
                         {employee.total_sold}
                      </TableCell>
                      <TableCell className="text-center">
                         <Badge variant="outline" className={`${employee.current_holding > 0 ? 'text-orange-600 border-orange-200 bg-orange-50' : ''}`}>
                             {employee.current_holding} left
                         </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge
                          variant={employee.status === 'active' ? 'default' : 'secondary'}
                          className="cursor-pointer select-none"
                          onClick={() => statusMutation.mutate(employee.id)}
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => setEditingEmployee(employee)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Edit Employee</DialogTitle></DialogHeader>
                              {editingEmployee && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                      value={editingEmployee.name}
                                      onChange={e => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                      value={editingEmployee.email}
                                      onChange={e => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                      value={editingEmployee.phone}
                                      onChange={e => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                                    />
                                  </div>
                                  <Button onClick={handleEditEmployee} className="w-full" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this employee?')) {
                                deleteMutation.mutate(employee.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}