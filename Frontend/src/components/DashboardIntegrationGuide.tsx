/**
 * INTEGRATION GUIDE: Using shadcn/ui Components in HRMDashboard
 * 
 * This file shows practical examples of how to use the new shadcn/ui components
 * in your existing dashboard components.
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircle, AlertCircle } from 'lucide-react';

/**
 * EXAMPLE 1: Employee Status Indicator with Badge
 * Replace the custom inline-flex status badges with shadcn Badge
 */
export const EmployeeStatusExample = ({ status, name }: { status: 'remote' | 'on-duty' | 'checked-out' | 'yet-to-checkin'; name: string }) => {
  const statusConfig = {
    remote: { label: 'Remote In', variant: 'default' as const, bgClass: 'bg-teal-100 text-teal-800' },
    'on-duty': { label: 'On Duty', variant: 'outline' as const, bgClass: 'bg-blue-100 text-blue-800' },
    'checked-out': { label: 'Checked Out', variant: 'secondary' as const, bgClass: 'bg-gray-100 text-gray-800' },
    'yet-to-checkin': { label: 'Yet to check-in', variant: 'destructive' as const, bgClass: 'bg-red-100 text-red-800' }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gray-300 rounded-full" />
      <div className="flex-1">
        <p className="font-medium text-gray-900">{name}</p>
        <Badge className={config.bgClass}>{config.label}</Badge>
      </div>
    </div>
  );
};

/**
 * EXAMPLE 2: Leave Balance Popover
 * Shows detailed leave information on hover/click
 */
export const LeaveBalancePopover = () => {
  const leaveData = [
    { type: 'Casual Leave', used: 4, total: 12 },
    { type: 'Sick Leave', used: 2, total: 5 },
    { type: 'Annual Leave', used: 5, total: 20 }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          View Leave Balance
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Remaining Leave Balance</h4>
          {leaveData.map((leave, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-2">
                <span>{leave.type}</span>
                <span className="font-medium">{leave.total - leave.used} / {leave.total}</span>
              </div>
              <Progress value={(leave.used / leave.total) * 100} className="h-1" />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/**
 * EXAMPLE 3: Timesheet Tab Navigation
 * Replace custom tab navigation with shadcn Tabs
 */
export const TimesheetTabsExample = () => {
  return (
    <Tabs defaultValue="activities" className="bg-white">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="activities">Activities</TabsTrigger>
        <TabsTrigger value="approvals">Approvals</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="leave">Leave</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="activities" className="p-4">
        {/* Activity feed content */}
        <p>Your activity feed will display here</p>
      </TabsContent>

      <TabsContent value="approvals" className="p-4">
        {/* Approvals content */}
        <p>Pending approvals will display here</p>
      </TabsContent>

      <TabsContent value="attendance" className="p-4">
        {/* Attendance content */}
        <p>Your attendance records will display here</p>
      </TabsContent>

      <TabsContent value="leave" className="p-4">
        {/* Leave content */}
        <p>Your leave applications will display here</p>
      </TabsContent>

      <TabsContent value="profile" className="p-4">
        {/* Profile content */}
        <p>Your profile information will display here</p>
      </TabsContent>
    </Tabs>
  );
};

/**
 * EXAMPLE 4: Employee List Table
 * Display employees with status badges and actions
 */
export const EmployeeListTableExample = () => {
  const employees = [
    { id: 'ZY198', name: 'Christine Spalding', position: 'HR Manager', status: 'remote' },
    { id: 'ZY190', name: 'Jones Terri', position: 'HR Lead', status: 'checked-out' },
    { id: 'HR204', name: 'Randall Gladstone', position: 'HR Specialist', status: 'remote' },
    { id: 'ZY181', name: 'Rodriguez Sue', position: 'Recruiter', status: 'on-duty' }
  ];

  const statusConfig = {
    remote: 'bg-teal-100 text-teal-800',
    'on-duty': 'bg-blue-100 text-blue-800',
    'checked-out': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell className="font-medium text-gray-600">{emp.id}</TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.position}</TableCell>
              <TableCell>
                <Badge className={statusConfig[emp.status as keyof typeof statusConfig]}>
                  {emp.status === 'remote' && 'Remote In'}
                  {emp.status === 'on-duty' && 'On Duty'}
                  {emp.status === 'checked-out' && 'Checked Out'}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">View</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{emp.name}</DialogTitle>
                      <DialogDescription>{emp.position}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p><strong>ID:</strong> {emp.id}</p>
                      <p><strong>Position:</strong> {emp.position}</p>
                      <p><strong>Status:</strong> {emp.status}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

/**
 * EXAMPLE 5: Check-in/Check-out Dialog with Confirmation
 * Use AlertDialog for critical actions
 */
export const CheckInOutDialogExample = ({ status }: { status: 'in' | 'out' }) => {
  const isCheckingIn = status === 'in';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={isCheckingIn ? 'default' : 'destructive'}
          className={isCheckingIn ? 'border-teal-600 text-teal-600 hover:bg-teal-50' : 'border-red-600 text-red-600 hover:bg-red-50'}
        >
          {isCheckingIn ? 'Check-in' : 'Check-out'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isCheckingIn ? 'Confirm Check-in' : 'Confirm Check-out'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isCheckingIn 
              ? 'You are about to check-in. Your shift timer will start.' 
              : 'You are about to check-out. Your shift timer will stop.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={isCheckingIn ? 'bg-teal-600' : 'bg-red-600'}>
            {isCheckingIn ? 'Check-in' : 'Check-out'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/**
 * EXAMPLE 6: Time Tracking Progress
 * Show work hours progress with visual indicator
 */
export const WorkHoursProgressExample = ({ hours = 6, totalHours = 8 }) => {
  const percentage = (hours / totalHours) * 100;

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Work Hours Today</h3>
        <Badge variant="outline">{hours}h / {totalHours}h</Badge>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-gray-600 mt-3">
        {Math.round(percentage)}% of your shift completed
      </p>
    </div>
  );
};

/**
 * EXAMPLE 7: Activity Feed Item with Status
 * Enhanced activity items with badges and icons
 */
export const ActivityFeedItemExample = ({
  type,
  title,
  description,
  time
}: {
  type: 'timesheet' | 'reminder' | 'approval';
  title: string;
  description: string;
  time: string;
}) => {
  const typeConfig = {
    timesheet: { 
      label: 'Timesheet', 
      variant: 'secondary' as const,
      icon: <CheckCircle className="w-4 h-4" /> 
    },
    reminder: { 
      label: 'Reminder', 
      variant: 'outline' as const,
      icon: <AlertCircle className="w-4 h-4" /> 
    },
    approval: { 
      label: 'Pending Approval', 
      variant: 'default' as const,
      icon: <CheckCircle className="w-4 h-4" /> 
    }
  };

  const config = typeConfig[type];

  return (
    <div className="bg-white p-4 rounded-lg border flex items-start gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <Badge variant={config.variant} className="text-xs">
            {config.icon}
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-2">{time}</p>
      </div>
    </div>
  );
};
