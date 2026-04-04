import { apiClient } from './api.client';
import type { ApiResponse } from '../types/api.types';

// Types
export type EmploymentType = 'full-time' | 'part-time' | 'contract';
export type PayrollRunStatus = 'draft' | 'processing' | 'approved' | 'paid' | 'failed';
export type ComplianceStatus = 'filed' | 'pending' | 'overdue' | 'upcoming';

export interface PayrollEmployee {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  dept: string;
  role: string;
  payPeriod: string;
  empType: EmploymentType;
  base_: number;
  hra: number;
  transport: number;
  medical: number;
  bonus: number;
  gross: number;
  provident: number;
  incomeTax: number;
  insurance: number;
  totalDeductions: number;
  net: number;
  bankLast4: string;
  bankName: string;
  taxBracket: string;
  ytdGross: number;
  ytdTax: number;
}

export interface PayrollStep {
  label: string;
  done: boolean;
  skipped?: boolean;
}

export interface PayrollRun {
  id: string;
  period: string;
  status: PayrollRunStatus;
  employees: number;
  gross: number;
  deductions: number;
  net: number;
  initiatedBy: string;
  initiatedAt: string;
  paidAt?: string;
  steps: PayrollStep[];
}

export interface PayrollCompliance {
  id: string;
  title: string;
  authority: string;
  dueDate: string;
  status: ComplianceStatus;
  amount?: number;
  period: string;
  category: string;
}

export interface CreatePayrollRunPayload {
  strPayPeriod: string;
  intEmployeeCount: number;
  decTotalGross: number;
  decTotalDeductions: number;
  decTotalNetPay: number;
}

export interface UpdatePayrollRunStatusPayload {
  strStatus: PayrollRunStatus;
  steps?: PayrollStep[];
}

export interface CreateCompliancePayload {
  strTitle: string;
  strAuthority: string;
  strCategory: string;
  dtDueDate: string;
  strStatus: ComplianceStatus;
  decAmount?: number;
  strPeriod: string;
  strDescription?: string;
}

export interface PayrollAnalytics {
  totalGross: number;
  totalDeductions: number;
  totalNetPay: number;
  compliancePending: number;
  monthlyTrend: Array<{ month: string; gross: number }>;
  departmentCosts: Array<{ department: string; cost: number; percentage: number; staffCount: number }>;
}

// API Endpoints
const PAYROLL_ENDPOINTS = {
  EMPLOYEES: '/payroll/employees',
  RUNS: '/payroll/runs',
  RUN_BY_ID: (id: string) => `/payroll/runs/${id}`,
  COMPLIANCE: '/payroll/compliance',
  COMPLIANCE_STATUS: (id: string) => `/payroll/compliance/${id}/status`,
  ANALYTICS: '/payroll/analytics',
};

// Payroll Service
export const payrollService = {
  /**
   * Get payroll employees for a specific pay period
   */
  async getEmployees(payPeriod: string = 'March 2026'): Promise<ApiResponse<PayrollEmployee[]>> {
    return apiClient.get<ApiResponse<PayrollEmployee[]>>(
      `${PAYROLL_ENDPOINTS.EMPLOYEES}?payPeriod=${encodeURIComponent(payPeriod)}`
    );
  },

  /**
   * Get all payroll runs
   */
  async getPayrollRuns(): Promise<ApiResponse<PayrollRun[]>> {
    return apiClient.get<ApiResponse<PayrollRun[]>>(PAYROLL_ENDPOINTS.RUNS);
  },

  /**
   * Get a specific payroll run
   */
  async getPayrollRun(runId: string): Promise<ApiResponse<PayrollRun>> {
    return apiClient.get<ApiResponse<PayrollRun>>(PAYROLL_ENDPOINTS.RUN_BY_ID(runId));
  },

  /**
   * Create a new payroll run
   */
  async createPayrollRun(payload: CreatePayrollRunPayload): Promise<ApiResponse<PayrollRun>> {
    return apiClient.post<ApiResponse<PayrollRun>>(PAYROLL_ENDPOINTS.RUNS, payload);
  },

  /**
   * Update payroll run status
   */
  async updatePayrollRunStatus(
    runId: string,
    payload: UpdatePayrollRunStatusPayload
  ): Promise<ApiResponse<PayrollRun>> {
    return apiClient.put<ApiResponse<PayrollRun>>(PAYROLL_ENDPOINTS.RUN_BY_ID(runId), payload);
  },

  /**
   * Get all compliance items
   */
  async getComplianceItems(): Promise<ApiResponse<PayrollCompliance[]>> {
    return apiClient.get<ApiResponse<PayrollCompliance[]>>(PAYROLL_ENDPOINTS.COMPLIANCE);
  },

  /**
   * Create a new compliance item
   */
  async createComplianceItem(payload: CreateCompliancePayload): Promise<ApiResponse<PayrollCompliance>> {
    return apiClient.post<ApiResponse<PayrollCompliance>>(PAYROLL_ENDPOINTS.COMPLIANCE, payload);
  },

  /**
   * Update compliance item status
   */
  async updateComplianceStatus(
    complianceId: string,
    status: ComplianceStatus
  ): Promise<ApiResponse<PayrollCompliance>> {
    return apiClient.put<ApiResponse<PayrollCompliance>>(PAYROLL_ENDPOINTS.COMPLIANCE_STATUS(complianceId), {
      status,
    });
  },

  /**
   * Get payroll analytics
   */
  async getAnalytics(): Promise<ApiResponse<PayrollAnalytics>> {
    return apiClient.get<ApiResponse<PayrollAnalytics>>(PAYROLL_ENDPOINTS.ANALYTICS);
  },
};
