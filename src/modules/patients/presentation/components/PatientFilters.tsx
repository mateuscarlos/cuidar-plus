/**
 * Patient Filters Component
 * Barra de filtros e busca de pacientes
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { PatientStatus, PatientPriority } from '../../domain';

interface PatientFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: PatientStatus | 'all') => void;
  onPriorityChange: (priority: PatientPriority | 'all') => void;
}

export function PatientFilters({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: PatientFiltersProps) {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            aria-hidden="true"
          />
          <Input
            type="search"
            aria-label="Buscar pacientes"
            placeholder="Buscar por nome, prontuário ou CPF..."
            className="pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {search && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={handleClearSearch}
                  aria-label="Limpar busca"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Limpar busca</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="advanced-filters-panel"
              aria-label="Alternar filtros avançados"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filtros avançados</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {showFilters && (
        <div
          id="advanced-filters-panel"
          className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg bg-muted/50"
        >
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select onValueChange={(value) => onStatusChange(value as PatientStatus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value={PatientStatus.ACTIVE}>Ativo</SelectItem>
                <SelectItem value={PatientStatus.PENDING}>Pendente</SelectItem>
                <SelectItem value={PatientStatus.DISCHARGED}>Alta</SelectItem>
                <SelectItem value={PatientStatus.TRANSFERRED}>Transferido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Prioridade</label>
            <Select onValueChange={(value) => onPriorityChange(value as PatientPriority | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value={PatientPriority.LOW}>Baixa</SelectItem>
                <SelectItem value={PatientPriority.MEDIUM}>Média</SelectItem>
                <SelectItem value={PatientPriority.HIGH}>Alta</SelectItem>
                <SelectItem value={PatientPriority.URGENT}>Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
