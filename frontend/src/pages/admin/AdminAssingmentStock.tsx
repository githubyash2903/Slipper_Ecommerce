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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, RefreshCw, Minus, Warehouse, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { fetchStockDashboardAPI, assignStockAPI, recordSaleAPI } from '@/api/stock';
import { fetchEmployeesAPI } from '@/api/admin/employee'; 
import { getProducts } from '@/api/products';   

interface ProductAssignment {
  productId: string;
  productName: string;
  quantity: number;
}

interface EmployeeStock {
  employeeId: string;
  employeeName: string;
  products: ProductAssignment[];
  totalAssigned: number;
  totalSold: number;
  remainingStock: number;
  lastUpdated: string;
}

interface StockHistory {
  id: string;
  employee_name: string;
  type: 'ASSIGN' | 'SALE' | 'REASSIGN';
  product_name?: string;
  quantity: number;
  date: string;
  note: string;
}

export default function AdminStockAssignment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // --- UI States ---
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog States
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isSalesDialogOpen, setIsSalesDialogOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [selectedStockForAction, setSelectedStockForAction] = useState<EmployeeStock | null>(null);

  // Form States
  const [newAssignment, setNewAssignment] = useState({ employeeId: '', productId: '', quantity: '' });
  const [reassignForm, setReassignForm] = useState({ productId: '', quantity: '' });
  const [salesQuantity, setSalesQuantity] = useState('');

  // ------------------------------------------------------------------
  // 1. FETCH DATA (Real Backend)
  // ------------------------------------------------------------------
  
  // A. Main Dashboard Data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['stockDashboard'],
    queryFn: fetchStockDashboardAPI,
  });

  // B. Dropdown Lists (Employees & Products)
  const { data: employeesList = [] } = useQuery({
    queryKey: ['employeesList'],
    queryFn: fetchEmployeesAPI,
  });

  const { data: productsList = [] } = useQuery({
    queryKey: ['productsList'],
    queryFn: getProducts, 
  });

  // Extract Data safely
  const overallStock = dashboardData?.overallStock || 0;
  const employeeStocks: EmployeeStock[] = dashboardData?.employees || [];
  const stockHistory: StockHistory[] = dashboardData?.history || [];

  // ------------------------------------------------------------------
  // 2. MUTATIONS (Actions)
  // ------------------------------------------------------------------

  // Assign Stock
  const assignMutation = useMutation({
    mutationFn: assignStockAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['productsList'] }); // Update warehouse count
      toast({ title: "Success", description: "Stock assigned successfully" });
      setIsAssignDialogOpen(false);
      setIsReassignDialogOpen(false);
      setNewAssignment({ employeeId: '', productId: '', quantity: '' });
      setReassignForm({ productId: '', quantity: '' });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Failed" });
    }
  });

  // Record Sale
  const saleMutation = useMutation({
    mutationFn: recordSaleAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockDashboard'] });
      toast({ title: "Success", description: "Sales recorded successfully" });
      setIsSalesDialogOpen(false);
      setSalesQuantity('');
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Failed" });
    }
  });

  // ------------------------------------------------------------------
  // 3. HANDLERS
  // ------------------------------------------------------------------

  // Stats
  const totalRemainingWithEmployees = employeeStocks.reduce((acc, e) => acc + e.remainingStock, 0);
  const totalSoldByEmployees = employeeStocks.reduce((acc, e) => acc + e.totalSold, 0);

  // Filters
  const filteredEmployeeStocks = employeeStocks.filter(stock =>
    stock.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignStock = () => {
    if (!newAssignment.employeeId || !newAssignment.productId || !newAssignment.quantity) return;
    assignMutation.mutate({
      employeeId: newAssignment.employeeId,
      productId: newAssignment.productId,
      quantity: Number(newAssignment.quantity)
    });
  };

  const handleReassignStock = () => {
    if (!selectedStockForAction || !reassignForm.productId || !reassignForm.quantity) return;
    assignMutation.mutate({
      employeeId: selectedStockForAction.employeeId,
      productId: reassignForm.productId,
      quantity: Number(reassignForm.quantity)
    });
  };

  const handleRecordSales = () => {
    if (!selectedStockForAction || !salesQuantity) return;
    saleMutation.mutate({
      employeeId: selectedStockForAction.employeeId,
      quantity: Number(salesQuantity)
    });
  };

  // ------------------------------------------------------------------
  // 4. RENDER
  // ------------------------------------------------------------------

  if (isDashboardLoading) {
    return (
      <AdminLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header & Assign Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock Delegation</h1>
            <p className="text-muted-foreground">Manage employee stock liability & warehouse</p>
          </div>

          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Assign Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Assign Stock from Warehouse</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Available in Warehouse</p>
                  <p className="text-xl font-bold">{overallStock} pieces</p>
                </div>
                
                {/* Employee Dropdown */}
                <div className="space-y-2">
                  <Label>Select Employee</Label>
                  <Select 
                    value={newAssignment.employeeId} 
                    onValueChange={val => setNewAssignment({...newAssignment, employeeId: val})}
                  >
                    <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>
                      {employeesList.map((emp: any) => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Dropdown */}
                <div className="space-y-2">
                  <Label>Select Product</Label>
                  <Select 
                    value={newAssignment.productId} 
                    onValueChange={val => setNewAssignment({...newAssignment, productId: val})}
                  >
                    <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>
                      {productsList.map((prod: any) => (
                        <SelectItem key={prod.id} value={prod.id}>
                          {prod.name} (Stock: {prod.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    value={newAssignment.quantity}
                    onChange={e => setNewAssignment({...newAssignment, quantity: e.target.value})}
                    placeholder="Enter quantity"
                  />
                </div>
                
                <Button onClick={handleAssignStock} className="w-full" disabled={assignMutation.isPending}>
                  {assignMutation.isPending ? 'Assigning...' : 'Assign Stock'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Stats Cards --- */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Warehouse className="h-5 w-5" /> Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Warehouse Stock</p>
                <p className="text-3xl font-bold text-blue-600">{overallStock}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Held by Employees</p>
                <p className="text-3xl font-bold text-orange-600">{totalRemainingWithEmployees}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sold</p>
                <p className="text-3xl font-bold text-green-600">{totalSoldByEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Tabs: Employees & History --- */}
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">Employee Stock</TabsTrigger>
            <TabsTrigger value="history">History Log</TabsTrigger>
          </TabsList>

          {/* Tab 1: Employees List */}
          <TabsContent value="employees" className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              {filteredEmployeeStocks.map(stock => (
                <Card key={stock.employeeId}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{stock.employeeName}</CardTitle>
                        <p className="text-xs text-muted-foreground">Last Updated: {new Date(stock.lastUpdated).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {/* SALE BUTTON */}
                        <Dialog open={isSalesDialogOpen && selectedStockForAction?.employeeId === stock.employeeId} 
                                onOpenChange={(o) => { setIsSalesDialogOpen(o); if(!o) setSelectedStockForAction(null); }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => setSelectedStockForAction(stock)}>
                              <Minus className="h-3 w-3" /> Report Sale
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                             <DialogHeader><DialogTitle>Report Sales for {stock.employeeName}</DialogTitle></DialogHeader>
                             <div className="py-4 space-y-4">
                                <p className="text-sm text-muted-foreground">Current Liability: {stock.remainingStock} items</p>
                                <Input type="number" placeholder="Qty Sold" value={salesQuantity} onChange={e => setSalesQuantity(e.target.value)} />
                                <Button className="w-full" onClick={handleRecordSales} disabled={saleMutation.isPending}>Record Sales</Button>
                             </div>
                          </DialogContent>
                        </Dialog>

                        {/* REASSIGN BUTTON */}
                        <Dialog open={isReassignDialogOpen && selectedStockForAction?.employeeId === stock.employeeId}
                                onOpenChange={(o) => { setIsReassignDialogOpen(o); if(!o) setSelectedStockForAction(null); }}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-1" onClick={() => setSelectedStockForAction(stock)}>
                              <RefreshCw className="h-3 w-3" /> Reassign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Reassign to {stock.employeeName}</DialogTitle></DialogHeader>
                            <div className="py-4 space-y-4">
                              <Select value={reassignForm.productId} onValueChange={val => setReassignForm({...reassignForm, productId: val})}>
                                <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                                <SelectContent>
                                  {productsList.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.stock})</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Input type="number" placeholder="Qty" value={reassignForm.quantity} onChange={e => setReassignForm({...reassignForm, quantity: e.target.value})} />
                              <Button className="w-full" onClick={handleReassignStock} disabled={assignMutation.isPending}>Reassign Stock</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                       <div className="p-2 bg-secondary/50 rounded text-center">
                          <p className="text-xs text-muted-foreground">Total Assigned</p>
                          <p className="font-bold">{stock.totalAssigned}</p>
                       </div>
                       <div className="p-2 bg-green-500/10 rounded text-center">
                          <p className="text-xs text-muted-foreground">Total Sold</p>
                          <p className="font-bold text-green-600">{stock.totalSold}</p>
                       </div>
                       <div className="p-2 bg-orange-500/10 rounded text-center">
                          <p className="text-xs text-muted-foreground">Remaining Liability</p>
                          <p className="font-bold text-orange-600">{stock.remainingStock}</p>
                       </div>
                    </div>
                    {/* Products assigned to this employee */}
                    <div>
                      <p className="text-xs font-medium mb-2 text-muted-foreground">Assigned Products (Holdings):</p>
                      <div className="flex flex-wrap gap-2">
                        {stock.products.length > 0 ? (
                          stock.products.map(p => (
                            <Badge key={p.productId} variant="secondary">
                              {p.productName}: {p.quantity}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No active stock holdings</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredEmployeeStocks.length === 0 && <p className="text-center text-muted-foreground py-10">No employees found.</p>}
            </div>
          </TabsContent>

          {/* Tab 2: History Log */}
          <TabsContent value="history">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockHistory.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>{entry.employee_name}</TableCell>
                      <TableCell>
                         <Badge variant={entry.type === 'SALE' ? 'default' : 'outline'}>{entry.type}</Badge>
                      </TableCell>
                      <TableCell>{entry.product_name || '-'}</TableCell>
                      <TableCell className={entry.type === 'SALE' ? 'text-green-600' : ''}>
                        {entry.type === 'SALE' ? '-' : '+'}{entry.quantity}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{entry.note}</TableCell>
                    </TableRow>
                  ))}
                  {stockHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No history logs yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}