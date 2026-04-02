import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Calendar, Activity, CheckCircle, Clock, XCircle } from 'lucide-react';
import { leaveService, type LeaveBalance, type LeaveRequest } from '@/services/leave.service';

function ApplyLeaveDialog({ onLeaveApplied }: { onLeaveApplied: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) return;
    setIsSubmitting(true);
    try {
      await leaveService.createRequest({
        leaveType: type,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason,
      });
      setOpen(false);
      onLeaveApplied();
      setType('Annual Leave');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (error) {
      console.error('Failed to submit leave', error);
      alert('Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
          <Plus className="w-4 h-4" /> Apply Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid gap-1.5">
            <Label>Leave Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Personal">Personal Leave</SelectItem>
                <SelectItem value="Paternity">Paternity Leave</SelectItem>
                <SelectItem value="Maternity">Maternity Leave</SelectItem>
                <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Reason</Label>
            <Textarea 
              placeholder="Briefly describe the reason..." 
              className="resize-none" 
              rows={3} 
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EmployeeLeavePage() {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await leaveService.getDashboard();
      if (res.data) {
        setBalances(res.data.balances || []);
        setRequests(res.data.requests || []);
      }
    } catch (error) {
      console.error('Failed to load leave dashboard', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase() === 'approved') return <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
    if (status.toLowerCase() === 'rejected') return <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />;
    return <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />;
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved') return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{getStatusIcon(s)} Approved</Badge>;
    if (s === 'rejected') return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{getStatusIcon(s)} Rejected</Badge>;
    return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{getStatusIcon(s)} Pending</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Leave</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">View your leave balance and request history.</p>
        </div>
        <ApplyLeaveDialog onLeaveApplied={fetchDashboard} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {balances.map((balance, index) => (
          <Card key={index} className="p-5 space-y-2 border-0 shadow-sm dark:bg-gray-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{balance.leaveType}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{balance.remaining} <span className="text-lg font-normal text-slate-500">/ {balance.total} left</span></p>
            <Progress value={(balance.used / balance.total) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">{balance.used} days used</p>
          </Card>
        ))}
        {balances.length === 0 && (
          <div className="col-span-3 py-6 text-center text-muted-foreground border rounded-xl border-dashed">
             No leave balances found
          </div>
        )}
      </div>

      <Card className="p-0 border-0 shadow-sm dark:bg-gray-800 overflow-hidden">
        <div className="p-5 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Requests</h2>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {requests.map((leave, index) => (
            <div key={leave.id || index} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{leave.leaveType}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                  <span className="mx-1">•</span>
                  {leave.days} Day{leave.days > 1 ? 's' : ''}
                </div>
                {leave.reason && <p className="text-xs text-slate-400 mt-1.5 italic max-w-md truncate">{leave.reason}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(leave.status)}
                <span className="text-[10px] text-slate-400 text-muted-foreground">Applied {new Date(leave.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Activity className="w-8 h-8 mb-2 opacity-20" />
              <p>You haven't made any leave requests yet.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
