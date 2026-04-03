import { apiClient as api } from './api.client';

export interface Shift {
  shiftGuid: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
}

export interface EmployeeShiftCell {
  date: string;
  shiftGuid?: string;
  shiftName?: string;
  color?: string;
  startTime?: string;
  endTime?: string;
}

export interface EmployeeShiftRow {
  userGuid: string;
  userName: string;
  role: string;
  department: string;
  days: EmployeeShiftCell[];
}

export interface ShiftPlannerView {
  availableShifts: Shift[];
  rows: EmployeeShiftRow[];
}

export const shiftService = {
  getShifts: async () => {
    const response = await api.get<{ data: Shift[] }>('/shift');
    return (response as any).data;
  },

  getPlannerView: async (startDate: string, endDate: string) => {
    const response = await api.get<{ data: ShiftPlannerView }>(`/shift/planner?startDate=${startDate}&endDate=${endDate}`);
    return (response as any).data;
  },

  assignShift: async (dto: { userGuid: string; date: string; shiftGuid: string; notes?: string }) => {
    await api.post('/shift/assign', dto);
  },

  copyWeek: async (targetStartDate: string) => {
    const response = await api.post<{ data: number }>(`/shift/copy-week?targetStartDate=${targetStartDate}`);
    return (response as any).data;
  },

  createShift: async (dto: { name: string; startTime: string; endTime: string; color: string }) => {
    const response = await api.post<{ data: Shift }>('/shift', dto);
    return (response as any).data;
  }
};
