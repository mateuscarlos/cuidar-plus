/**
 * Mock Report Data
 */

import { Report, ReportType, ReportPeriod, ReportFormat } from '../domain';

export const mockReports: Report[] = [
  {
    id: '1',
    type: ReportType.PATIENTS,
    title: 'Relatório Mensal de Pacientes',
    period: ReportPeriod.MONTHLY,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    format: ReportFormat.PDF,
    generatedBy: 'admin',
    status: 'COMPLETED',
    downloadUrl: '/downloads/reports/patients-2024-12.pdf',
    data: {
      totalPatients: 45,
      newPatients: 12,
      dischargedPatients: 8,
    },
    createdAt: '2024-12-31T10:00:00Z',
    updatedAt: '2024-12-31T10:00:00Z',
  },
  {
    id: '2',
    type: ReportType.INVENTORY,
    title: 'Relatório de Estoque - Dezembro',
    period: ReportPeriod.MONTHLY,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    format: ReportFormat.EXCEL,
    generatedBy: 'admin',
    status: 'COMPLETED',
    downloadUrl: '/downloads/reports/inventory-2024-12.xlsx',
    data: {
      totalItems: 150,
      lowStockItems: 12,
      outOfStockItems: 3,
      inventoryValue: 125000,
    },
    createdAt: '2024-12-31T11:00:00Z',
    updatedAt: '2024-12-31T11:00:00Z',
  },
  {
    id: '3',
    type: ReportType.FINANCIAL,
    title: 'Relatório Financeiro Q4 2024',
    period: ReportPeriod.MONTHLY,
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    format: ReportFormat.PDF,
    generatedBy: 'admin',
    status: 'PROCESSING',
    createdAt: '2025-01-02T09:00:00Z',
    updatedAt: '2025-01-02T09:00:00Z',
  },
];

export const mockReportSummary = {
  totalPatients: 45,
  newPatients: 12,
  dischargedPatients: 8,
  activePatients: 37,
  totalRevenue: 450000,
  totalExpenses: 280000,
  inventoryValue: 125000,
  lowStockItems: 12,
};
