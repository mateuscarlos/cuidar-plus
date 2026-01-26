/**
 * Report Business Rules
 */

import { Report, ReportType, ReportPeriod } from './Report.entity';

export class ReportValidator {
  static validate(report: Partial<Report>): string[] {
    const errors: string[] = [];

    if (!report.type) {
      errors.push('Tipo de relatório obrigatório');
    }

    if (!report.title?.trim()) {
      errors.push('Título obrigatório');
    }

    if (!report.startDate) {
      errors.push('Data inicial obrigatória');
    }

    if (!report.endDate) {
      errors.push('Data final obrigatória');
    }

    if (report.startDate && report.endDate) {
      const start = new Date(report.startDate);
      const end = new Date(report.endDate);
      
      if (start > end) {
        errors.push('Data inicial deve ser anterior à data final');
      }
    }

    return errors;
  }

  static isValidDateRange(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  }

  static getDefaultDateRange(period: ReportPeriod): { startDate: string; endDate: string } {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate: Date;

    switch (period) {
      case ReportPeriod.DAILY:
        startDate = new Date(now);
        break;
      case ReportPeriod.WEEKLY:
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case ReportPeriod.MONTHLY:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case ReportPeriod.YEARLY:
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate,
    };
  }
}

export function getReportTypeLabel(type: ReportType): string {
  const labels = {
    [ReportType.PATIENTS]: 'Relatório de Pacientes',
    [ReportType.INVENTORY]: 'Relatório de Estoque',
    [ReportType.FINANCIAL]: 'Relatório Financeiro',
    [ReportType.APPOINTMENTS]: 'Relatório de Atendimentos',
  };
  return labels[type];
}

export function getReportPeriodLabel(period: ReportPeriod): string {
  const labels = {
    [ReportPeriod.DAILY]: 'Diário',
    [ReportPeriod.WEEKLY]: 'Semanal',
    [ReportPeriod.MONTHLY]: 'Mensal',
    [ReportPeriod.YEARLY]: 'Anual',
    [ReportPeriod.CUSTOM]: 'Personalizado',
  };
  return labels[period];
}
