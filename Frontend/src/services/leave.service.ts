import { apiClient } from './api.client';
import { ENDPOINTS } from './api.config';
import type { ApiResponse } from '../types/api.types';

export interface LeaveBalance {
  leaveType: string;
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  createdAt: string;
}

export interface LeaveDashboard {
  balances: LeaveBalance[];
  requests: LeaveRequest[];
}

export interface CreateLeaveRequestPayload {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  emergencyContact?: string;
}

export const leaveService = {
  async getDashboard(): Promise<ApiResponse<LeaveDashboard>> {
    return apiClient.get<ApiResponse<LeaveDashboard>>(ENDPOINTS.LEAVE.DASHBOARD);
  },

  async createRequest(payload: CreateLeaveRequestPayload): Promise<ApiResponse<LeaveRequest>> {
    return apiClient.post<ApiResponse<LeaveRequest>>(ENDPOINTS.LEAVE.REQUESTS, payload);
  },
};
