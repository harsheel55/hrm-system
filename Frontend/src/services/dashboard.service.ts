import { apiClient } from './api.client';
import type { ApiResponse } from '../types/api.types';

export interface DashboardHomeSummary {
  userName: string;
  roleName: string;
  activeEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  pendingApprovals: number;
  myPendingLeave: number;
  openPositions: number;
  candidatesInPipeline: number;
  latestPayrollPeriod: string;
  latestPayrollStatus: string;
  latestPayrollGross: number;
  latestPayrollDeductions: number;
  latestPayrollNet: number;
}

export const dashboardService = {
  async getHomeSummary(): Promise<ApiResponse<DashboardHomeSummary>> {
    return apiClient.get<ApiResponse<DashboardHomeSummary>>('/dashboard/home-summary');
  },
};
