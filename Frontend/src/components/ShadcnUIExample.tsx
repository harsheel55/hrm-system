import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ChevronDown } from 'lucide-react';

/**
 * Example Component showcasing all the new shadcn/ui components
 * that have been added to the dashboard
 */
export const ShadcnUIExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckChange = (checked: string | boolean) => {
    if (typeof checked === 'boolean') {
      setIsChecked(checked);
    }
  };
  const [switchOn, setSwitchOn] = useState(false);
  const [comments, setComments] = useState('');

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">shadcn/ui Components Guide</h1>

      {/* Badge Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Badge Components</h2>
        <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Perfect for status indicators like "Remote In", "On Duty", "Checked Out"
        </p>
      </section>

      {/* Tabs Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tabs Component</h2>
        <Tabs defaultValue="activities" className="bg-white p-4 rounded-lg">
          <TabsList>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          <TabsContent value="activities" className="mt-4">
            <p className="text-gray-700">Your activity feed will appear here</p>
          </TabsContent>
          <TabsContent value="approvals" className="mt-4">
            <p className="text-gray-700">Pending approvals will appear here</p>
          </TabsContent>
          <TabsContent value="attendance" className="mt-4">
            <p className="text-gray-700">Attendance records will appear here</p>
          </TabsContent>
        </Tabs>
        <p className="text-sm text-gray-600 mt-2">
          Use Tabs to organize dashboard content like in the main dashboard
        </p>
      </section>

      {/* Dialog Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dialog Component</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              <DialogDescription>
                View or edit employee information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-sm text-gray-700">Employee ID: ZY198</p>
              <p className="text-sm text-gray-700">Name: Christine Spalding</p>
              <p className="text-sm text-gray-700">Position: HR Manager</p>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
        <p className="text-sm text-gray-600 mt-4">
          Perfect for showing employee details, approval forms, and confirmations
        </p>
      </section>

      {/* Alert Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alert Component</h2>
        <div className="space-y-3">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Your timesheet is pending approval
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to update attendance record
            </AlertDescription>
          </Alert>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Use for notifications, warnings, and error messages
        </p>
      </section>

      {/* Select Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Component</h2>
        <div className="bg-white p-4 rounded-lg max-w-xs">
          <label className="text-sm font-medium text-gray-700 block mb-2">Department</label>
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hr">Human Resources</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Great for filtering, selecting departments, leaves types, etc.
        </p>
      </section>

      {/* Checkbox Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Checkbox Component</h2>
        <div className="bg-white p-4 rounded-lg max-w-xs space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={isChecked} onCheckedChange={handleCheckChange} />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I agree to work from home
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="privacy" />
            <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Receive notifications
            </label>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Perfect for preferences, filters, and form selections
        </p>
      </section>

      {/* Switch Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Switch Component</h2>
        <div className="bg-white p-4 rounded-lg max-w-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Availability</label>
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
          </div>
          <p className="text-xs text-gray-500">
            Status: {switchOn ? 'Available' : 'Unavailable'}
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Use for toggles like Work from Home status, Availability, etc.
        </p>
      </section>

      {/* Progress Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Progress Component</h2>
        <div className="bg-white p-4 rounded-lg space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Timesheet Completion</p>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">75% Complete</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Leave Balance</p>
            <Progress value={40} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">10 of 25 days used</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Good for showing progress, leave balance, completion status
        </p>
      </section>

      {/* Table Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Table Component</h2>
        <div className="bg-white rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>ZY198</TableCell>
                <TableCell>Christine Spalding</TableCell>
                <TableCell>HR Manager</TableCell>
                <TableCell>
                  <Badge className="bg-teal-100 text-teal-800">Remote In</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ZY190</TableCell>
                <TableCell>Jones Terri</TableCell>
                <TableCell>HR Lead</TableCell>
                <TableCell>
                  <Badge variant="outline">Checked Out</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Perfect for displaying employee lists, attendance records, etc.
        </p>
      </section>

      {/* HoverCard Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">HoverCard Component</h2>
        <div className="bg-white p-4 rounded-lg inline-block">
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="text-blue-600 cursor-pointer font-medium">Christine Spalding</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Christine Spalding</h4>
                <p className="text-sm text-gray-600">HR Manager</p>
                <p className="text-xs text-gray-500">ID: ZY198</p>
                <p className="text-xs text-gray-500">Reports: 8 employees</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Great for employee quick-info on hover (name, status, etc.)
        </p>
      </section>

      {/* Popover Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Popover Component</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Leave Balance</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Your Leave Balance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Casual Leave</span>
                  <span className="font-medium">8 / 12 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Sick Leave</span>
                  <span className="font-medium">3 / 5 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Leave</span>
                  <span className="font-medium">15 / 20 days</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <p className="text-sm text-gray-600 mt-4">
          Perfect for showing detailed info when clicked, like leave balance
        </p>
      </section>

      {/* Collapsible Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Collapsible Component</h2>
        <div className="bg-white rounded-lg max-w-xl">
          <Collapsible defaultOpen={true}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4">
                <span className="font-semibold">Personal Information</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4 space-y-2">
              <p className="text-sm text-gray-700"><strong>Email:</strong> christine@ylker.com</p>
              <p className="text-sm text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p className="text-sm text-gray-700"><strong>DOB:</strong> January 15, 1992</p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 border-t">
                <span className="font-semibold">Organization Details</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4 space-y-2">
              <p className="text-sm text-gray-700"><strong>Department:</strong> Human Resources</p>
              <p className="text-sm text-gray-700"><strong>Reports To:</strong> Jones Terri</p>
              <p className="text-sm text-gray-700"><strong>Team Size:</strong> 8 members</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Great for organizing profile info, expandable sections
        </p>
      </section>

      {/* AlertDialog Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">AlertDialog Component</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Submit Timesheet</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit your timesheet for the week of May 26-31? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Submit</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <p className="text-sm text-gray-600 mt-4">
          Use for critical confirmations before performing important actions
        </p>
      </section>

      {/* Textarea Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Textarea Component</h2>
        <div className="bg-white p-4 rounded-lg max-w-xl">
          <label className="text-sm font-medium text-gray-700 block mb-2">Comments</label>
          <Textarea 
            placeholder="Add comments about your work..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-24"
          />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Perfect for feedback forms, comments, work summaries
        </p>
      </section>

      {/* Pagination Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pagination Component</h2>
        <div className="bg-white p-4 rounded-lg inline-block">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Use for paginating employee lists, activity feeds, etc.
        </p>
      </section>
    </div>
  );
};

export default ShadcnUIExample;
