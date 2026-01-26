/**
 * Reports Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/core/lib/query-client';
import { MESSAGES } from '@/core/constants';
import { ENV } from '@/core/config';
import { ReportService } from '../../data/report.service';
import { mockReports, mockReportSummary } from '../../data/report.mock';
import type { ReportFilters, GenerateReportDTO } from '../../domain';

export function useReports(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.list(filters),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        let filtered = [...mockReports];
        
        if (filters.type) {
          filtered = filtered.filter(r => r.type === filters.type);
        }
        
        if (filters.period) {
          filtered = filtered.filter(r => r.period === filters.period);
        }
        
        return {
          data: filtered,
          pagination: {
            total: filtered.length,
            page: 1,
            pageSize: 20,
            totalPages: 1,
          },
        };
      }
      
      return ReportService.fetchReports(filters);
    },
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.detail(id),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const report = mockReports.find(r => r.id === id);
        if (!report) throw new Error('Relatório não encontrado');
        return report;
      }
      return ReportService.getReportById(id);
    },
    enabled: !!id,
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: GenerateReportDTO) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve({
          ...data,
          id: `mock-${Date.now()}`,
          status: 'COMPLETED',
          generatedBy: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return ReportService.generateReport(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS.all });
      toast.success('Relatório gerado', { description: MESSAGES.SUCCESS.CREATED });
    },
    onError: (error: Error) => {
      toast.error('Erro ao gerar relatório', { description: error.message });
    },
  });
}

export function useReportSummary(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['reports', 'summary', startDate, endDate],
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockReportSummary;
      }
      return ReportService.getSummary(startDate, endDate);
    },
    enabled: !!startDate && !!endDate,
  });
}
