import { apiClient } from './api.client';
import { ENDPOINTS } from './api.config';
import type { ApiResponse } from '../types/api.types';

export type Stage = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type Priority = 'high' | 'medium' | 'low';

export interface RecruitmentJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  priority: Priority;
  applicants: number;
  newApplicants: number;
  daysOpen: number;
  hiringManager: string;
  salary: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  postedDate: string;
  closingDate: string;
  pipeline: Record<Stage, number>;
}

export interface RecruitmentCandidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  appliedFor: string;
  email: string;
  phone: string;
  location: string;
  stage: Stage;
  rating: number;
  appliedDate: string;
  experience: string;
  source: string;
}

export interface CreateRecruitmentJobPayload {
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  priority: Priority;
  hiringManager?: string;
  salary?: string;
  description?: string;
  skills?: string[];
  responsibilities?: string[];
  closingDate?: string;
}

export const recruitmentService = {
  async getJobs(): Promise<ApiResponse<RecruitmentJob[]>> {
    return apiClient.get<ApiResponse<RecruitmentJob[]>>(ENDPOINTS.RECRUITMENT.JOBS);
  },

  async getCandidates(): Promise<ApiResponse<RecruitmentCandidate[]>> {
    return apiClient.get<ApiResponse<RecruitmentCandidate[]>>(ENDPOINTS.RECRUITMENT.CANDIDATES);
  },

  async createJob(payload: CreateRecruitmentJobPayload): Promise<ApiResponse<RecruitmentJob>> {
    return apiClient.post<ApiResponse<RecruitmentJob>>(ENDPOINTS.RECRUITMENT.JOBS, payload);
  },

  async updateCandidateStage(candidateId: string, stage: Stage): Promise<ApiResponse<RecruitmentCandidate>> {
    return apiClient.put<ApiResponse<RecruitmentCandidate>>(
      ENDPOINTS.RECRUITMENT.CANDIDATE_STAGE(candidateId),
      { stage }
    );
  },
};
