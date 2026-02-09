import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, Mail, Phone, MapPin, ShoppingBag, MoreHorizontal, Ban, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminUsers, useDeactivateUser } from '@/hooks/useAdmin';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  phone_country_code?: string;
  role: string;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

// Helper for Initials
const getInitials = (name: string) => 
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

export default function AdminCustomers() {
  // --- STATE ---
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'active' | 'inactive'
  const [viewingCustomer, setViewingCustomer] = useState<User | null>(null);

  // --- API HOOKS ---
  const { data: users, isLoading } = useAdminUsers({ page, limit: 10, type: filterType });
  const deactivateMutation = useDeactivateUser();

  // --- HANDLERS ---
  const handleDeactivate = (id: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      deactivateMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">Manage your customer base</p>
          </div>
          
          {/* FILTER DROPDOWN */}
          <select 
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterType}
            onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* STATS CARDS (Placeholder Data for now as backend doesn't send totals yet) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{users?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Users on Page</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                 {users?.filter((u: User) => u.is_active).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">
                {users?.filter((u: User) => !u.is_active).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Inactive Users</p>
            </CardContent>
          </Card>
        </div>

        {/* TABLE CARD */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  {/* Note: Server side search implement karna padega baad me */}
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logic needed..."
                    disabled
                    className="pl-10"
                  />
                </div>
                
                {/* PAGINATION BUTTONS */}
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={users?.length < 10 || isLoading}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No users found.
                          </TableCell>
                      </TableRow>
                  ) : (
                  users?.map((customer: User) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={customer.avatar_url} />
                                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                            </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {customer.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>{customer.email}</TableCell>
                      
                      <TableCell>
                         <Badge variant="outline">{customer.role}</Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            customer.is_active
                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                              : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }
                        >
                          {customer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewingCustomer(customer)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive cursor-pointer"
                                        onClick={() => handleDeactivate(customer.id)}
                                        disabled={!customer.is_active}
                                    >
                                        <Ban className="mr-2 h-4 w-4" />
                                        Deactivate User
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>

        {/* CUSTOMER DETAILS DIALOG */}
        <Dialog open={!!viewingCustomer} onOpenChange={() => setViewingCustomer(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {viewingCustomer && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={viewingCustomer.avatar_url} />
                        <AvatarFallback className="text-xl">{getInitials(viewingCustomer.name)}</AvatarFallback>
                    </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{viewingCustomer.name}</h3>
                    <p className="text-sm text-muted-foreground">{viewingCustomer.id}</p>
                    <Badge
                      variant="outline"
                      className={
                        viewingCustomer.is_active
                          ? 'bg-green-500/10 text-green-500 border-green-500/20 mt-1'
                          : 'bg-red-500/10 text-red-500 border-red-500/20 mt-1'
                      }
                    >
                      {viewingCustomer.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{viewingCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {viewingCustomer.phone_number 
                            ? `${viewingCustomer.phone_country_code || ''} ${viewingCustomer.phone_number}` 
                            : 'No phone provided'}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Member since: {new Date(viewingCustomer.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}