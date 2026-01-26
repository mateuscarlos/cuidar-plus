/**
 * Report Service
 */

import { apiClient } from '@/core/config';
import { API_ENDPOINTS } from '@/core/constants/api';
import { Report, ReportFilters, GenerateReportDTO, ReportSummary } from '../domain';

export class ReportService {
  static async fetchReports(filters: ReportFilters = {}) {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.BASE, { params: filters });
    return response.data;
  }

  static async getReportById(id: string) {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.BY_ID(id));
    return response.data;
  }

  static async generateReport(data: GenerateReportDTO) {
    const response = await apiClient.post(API_ENDPOINTS.REPORTS.GENERATE, data);
    return response.data;
  }

  static async downloadReport(id: string) {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.DOWNLOAD(id), {
      responseType: 'blob',
    });
    return response.data;
  }

  static async deleteReport(id: string) {
    await apiClient.delete(API_ENDPOINTS.REPORTS.BY_ID(id));
  }

  static async getSummary(startDate: string, endDate: string): Promise<ReportSummary> {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.SUMMARY, {
      params: { startDate, endDate },
    });
    return response.data;
  }
}
