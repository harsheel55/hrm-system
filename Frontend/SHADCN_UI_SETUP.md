# shadcn/ui Components Guide for HRM Dashboard

## Overview

Your HRM Dashboard now includes **26 professional, reusable shadcn/ui components** ready to enhance your interface. These components are built with Radix UI, Tailwind CSS, and follow accessibility best practices.

## Components Overview

### 1. **Badge** (`badge.tsx`)
Status indicators and labels

**Use in Dashboard:**
- Employee status: "Remote In", "Checked Out", "On Duty"
- Leave type indicators
- Department tags
- Priority levels

**Example:**
```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Remote In</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Urgent</Badge>
```

---

### 2. **Tabs** (`tabs.tsx`)
Tab navigation for organized content

**Use in Dashboard:**
- Main content tabs: Activities, Approvals, Attendance, Leave, Profile
- Dashboard sections
- Category navigation

**Example:**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="activities">
  <TabsList>
    <TabsTrigger value="activities">Activities</TabsTrigger>
    <TabsTrigger value="approvals">Approvals</TabsTrigger>
  </TabsList>
  <TabsContent value="activities">...</TabsContent>
</Tabs>
```

---

### 3. **Dialog** (`dialog.tsx`)
Modal dialogs for forms and information

**Use in Dashboard:**
- View employee details
- Submit approvals
- Edit profile information
- Confirm actions

**Example:**
```tsx
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>Content goes here</DialogContent>
</Dialog>
```

---

### 4. **Alert** (`alert.tsx`)
Alert messages for notifications

**Use in Dashboard:**
- Timesheet pending approval
- Shift reminders
- Error messages
- Success notifications

**Example:**
```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Your timesheet is pending approval</AlertDescription>
</Alert>
```

---

### 5. **Progress** (`progress.tsx`)
Progress bars for showing completion status

**Use in Dashboard:**
- Work hours completion (6h / 8h)
- Leave balance usage
- Task progress
- Skill proficiency

**Example:**
```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={75} /> {/* 75% complete */}
```

---

### 6. **Button** (`button.tsx`) [Already Integrated]
Action buttons with variants

**Variants:**
- `default` - Primary action
- `secondary` - Secondary action
- `destructive` - Delete/danger actions
- `outline` - Alternative style
- `ghost` - Minimal style

---

### 7. **Card** (`card.tsx`) [Already Integrated]
Container for content sections

**Use in Dashboard:**
- Profile cards
- Activity cards
- Work schedule cards
- Holiday cards

---

### 8. **Select** (`select.tsx`)
Dropdown selection component

**Use in Dashboard:**
- Department filter
- Leave type selection
- Report type selection
- Shift selection

**Example:**
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="hr">HR</SelectItem>
    <SelectItem value="eng">Engineering</SelectItem>
  </SelectContent>
</Select>
```

---

### 9. **Checkbox** (`checkbox.tsx`)
For multiple selections and preferences

**Use in Dashboard:**
- Work from home preferences
- Notification settings
- Filter selections
- Agreement checkboxes

**Example:**
```tsx
import { Checkbox } from '@/components/ui/checkbox';

<Checkbox id="wfh" />
<label htmlFor="wfh">Work from Home</label>
```

---

### 10. **Switch** (`switch.tsx`)
Toggle for on/off states

**Use in Dashboard:**
- Availability toggle
- Notification settings
- Work status
- Dark mode toggle

**Example:**
```tsx
import { Switch } from '@/components/ui/switch';

<Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
```

---

### 11. **Table** (`table.tsx`)
Professional data table component

**Use in Dashboard:**
- Employee list
- Attendance records
- Leave applications
- Team members
- Performance data

**Example:**
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Christine</TableCell>
      <TableCell>Remote In</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### 12. **HoverCard** (`hover-card.tsx`)
Quick preview on hover

**Use in Dashboard:**
- Employee quick info on hover
- Manager details
- Department info
- Role descriptions

**Example:**
```tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

<HoverCard>
  <HoverCardTrigger>Christine Spalding</HoverCardTrigger>
  <HoverCardContent>
    <p>HR Manager</p>
    <p>Reports: 8 employees</p>
  </HoverCardContent>
</HoverCard>
```

---

### 13. **Popover** (`popover.tsx`)
Floating content panel

**Use in Dashboard:**
- Leave balance details
- Performance metrics
- Quick actions
- Additional information

**Example:**
```tsx
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

<Popover>
  <PopoverTrigger asChild>
    <Button>Leave Balance</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Casual: 8/12 days</p>
    <p>Sick: 3/5 days</p>
  </PopoverContent>
</Popover>
```

---

### 14. **AlertDialog** (`alert-dialog.tsx`)
Confirmation dialog for critical actions

**Use in Dashboard:**
- Confirm timesheet submission
- Confirm check-in/check-out
- Confirm leave application
- Confirm approval/rejection

**Example:**
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger>Submit</AlertDialogTrigger>
  <AlertDialogContent>
    <p>Are you sure?</p>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction>Confirm</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

---

### 15. **Collapsible** (`collapsible.tsx`)
Expandable/collapsible sections

**Use in Dashboard:**
- Personal information (expandable)
- Organization details (expandable)
- Historical data sections
- Additional settings

**Example:**
```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

<Collapsible>
  <CollapsibleTrigger>Personal Information</CollapsibleTrigger>
  <CollapsibleContent>
    <p>Email: christine@ylker.com</p>
    <p>Phone: +1 (555) 123-4567</p>
  </CollapsibleContent>
</Collapsible>
```

---

### 16. **Textarea** (`textarea.tsx`)
Multi-line text input

**Use in Dashboard:**
- Leave reason/comments
- Performance feedback
- Work summary
- Approval comments

**Example:**
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="Add comments..." />
```

---

### 17. **Pagination** (`pagination.tsx`)
Navigation for paginated data

**Use in Dashboard:**
- Employee list pagination
- Activity feed pagination
- Report pagination

**Example:**
```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationPrevious href="#" />
    <PaginationLink href="#">1</PaginationLink>
    <PaginationNext href="#" />
  </PaginationContent>
</Pagination>
```

---

### 18. **Input** (`input.tsx`) [Already Integrated]
Text input field

**Use in Dashboard:**
- Search employees
- Filter by name
- Date inputs
- Number inputs

---

### 19. **Label** (`label.tsx`) [Already Integrated]
Form input labels

---

### 20. **Dropdown Menu** (`dropdown-menu.tsx`) [Already Integrated]
Context menu with options

---

### 21. **Sheet** (`sheet.tsx`) [Already Integrated]
Side panel drawer

---

### 22. **Sidebar** (`sidebar.tsx`) [Already Integrated]
Navigation sidebar

---

### 23. **Skeleton** (`skeleton.tsx`) [Already Integrated]
Loading placeholders

---

### 24. **Tooltip** (`tooltip.tsx`) [Already Integrated]
Hover tooltips

---

### 25. **Separator** (`separator.tsx`) [Already Integrated]
Visual divider

---

### 26. **Form** (`form.tsx`)
React Hook Form integration

**Use for:**
- Validation
- Form state management
- User input handling

---

## Quick Integration Examples

### Replace Status Badges
**Before:**
```tsx
<div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
  bg-teal-100 text-teal-800">
  Remote In
</div>
```

**After:**
```tsx
import { Badge } from '@/components/ui/badge';
<Badge>Remote In</Badge>
```

---

### Replace Custom Tabs
**Before (Custom CSS):**
```tsx
{tabs.map((tab) => (
  <button
    className={`px-3 py-2 text-sm font-medium ${
      activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
    }`}
  >
    {tab}
  </button>
))}
```

**After (shadcn Tabs):**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs>
  <TabsList>
    {tabs.map(tab => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}
  </TabsList>
  {tabs.map(tab => (
    <TabsContent key={tab} value={tab}>
      {/* Content */}
    </TabsContent>
  ))}
</Tabs>
```

---

### Add Employee List Table
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>ID</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {employees.map(emp => (
      <TableRow key={emp.id}>
        <TableCell>{emp.id}</TableCell>
        <TableCell>{emp.name}</TableCell>
        <TableCell><Badge>{emp.status}</Badge></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Installation Summary

All components have been successfully installed. You can find them in:
```
Frontend/src/components/ui/
```

## Using Components in Your Dashboard

1. **Import the component:**
   ```tsx
   import { Badge } from '@/components/ui/badge';
   ```

2. **Use in your JSX:**
   ```tsx
   <Badge>Remote In</Badge>
   ```

3. **Check variant options** in the component file for styling options

## Resources

- **shadcn/ui Official:** https://ui.shadcn.com/
- **Radix UI Docs:** https://www.radix-ui.com/docs
- **Tailwind CSS Docs:** https://tailwindcss.com/docs

## Example Files in Your Project

1. **ShadcnUIExample.tsx** - Complete showcase of all components
2. **DashboardIntegrationGuide.tsx** - Practical integration examples for your dashboard

Both files are in `src/components/` directory.

## Next Steps

1. Review the example files to understand each component
2. Start replacing custom UI elements with shadcn components
3. Test components in different pages
4. Maintain consistency across your dashboard

Happy building! 🚀
