import { apiClient as api } from './api.client';

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  attendanceRate: number;
}

export interface AttendanceClock {
  isCheckedIn: boolean;
  dateLabel: string;
  currentTime: string;
  checkIn: string;
  checkOut: string;
  elapsed: string;
  status: string;
}

export interface AttendanceEmployee {
  id: number;
  name: string;
  avatar: string;
  department: string;
  role: string;
  checkIn: string;
  checkOut: string;
  status: string;
  hoursWorked: number;
  overtime: number;
}

export interface AttendanceWeekDay {
  date: string;
  day: string;
  status: string;
  checkIn: string;
  checkOut: string;
  hours: number;
}

export interface AttendanceWeeklyBar {
  day: string;
  present: number;
  late: number;
  absent: number;
}

export interface DepartmentAttendance {
  department: string;
  rate: number;
  count: string;
}

export interface AttendanceMonthlySummary {
  daysPresent: number;
  workingDays: number;
  daysLate: number;
  latePercentage: number;
  totalHours: number;
  avgHoursPerDay: number;
  overtimeHours: number;
  overtimeDays: number;
}

export interface AttendanceDashboard {
  summary: AttendanceSummary;
  clock: AttendanceClock;
  employees: AttendanceEmployee[];
  myWeek: AttendanceWeekDay[];
  weeklyBars: AttendanceWeeklyBar[];
  departmentAttendance: DepartmentAttendance[];
  monthlySummary: AttendanceMonthlySummary;
}

export const attendanceService = {
  getDashboard: async (query?: { search?: string; department?: string }) => {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.department) params.append('department', query.department);
    
    const response = await api.get<{ data: AttendanceDashboard }>(`/attendance/dashboard?${params.toString()}`);
    return (response as any).data;
  },

  getTodayClock: async () => {
    const response = await api.get<{ data: AttendanceClock }>('/attendance/me/today');
    return (response as any).data;
  },

  checkIn: async () => {
    const response = await api.post<{ data: AttendanceClock }>('/attendance/check-in');
    return (response as any).data;
  },

  checkOut: async () => {
    const response = await api.post<{ data: AttendanceClock }>('/attendance/check-out');
    return (response as any).data;
  }
};
