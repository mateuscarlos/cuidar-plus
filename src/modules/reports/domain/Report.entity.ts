/**
 * Report Entity
 */

import { BaseEntity } from '@/core/types';

export enum ReportType {
  PATIENTS = 'PATIENTS',
  INVENTORY = 'INVENTORY',
  FINANCIAL = 'FINANCIAL',
  APPOINTMENTS = 'APPOINTMENTS',
}

export enum ReportPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

export interface Report extends BaseEntity {
  type: ReportType;
  title: string;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  format: ReportFormat;
  generatedBy: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  downloadUrl?: string;
  data?: Record<string, unknown>;
}

export interface ReportFilters {
  type?: ReportType;
  period?: ReportPeriod;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface GenerateReportDTO {
  type: ReportType;
  title: string;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  format: ReportFormat;
}

export interface ReportSummary {
  totalPatients: number;
  newPatients: number;
  dischargedPatients: number;
  activePatients: number;
  totalRevenue: number;
  totalExpenses: number;
  inventoryValue: number;
  lowStockItems: number;
}
