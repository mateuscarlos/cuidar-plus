import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Search, Users as UsersIcon, UserCheck, UserX } from 'lucide-react';
import { useUsers } from '../hooks';
import { UserFilters, UserStatus } from '../../domain';
import {
  getUserRoleLabel,
  getUserRoleColor,
  getUserStatusColor,
} from '../../domain/User.rules';
import { formatDate } from '@/core/lib/formatters';
import { UserForm } from '../components';

export function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({ page: 1, pageSize: 20 });
  const { data, isLoading } = useUsers(filters);

  const users = data?.data ?? [];
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === UserStatus.ACTIVE).length,
    inactive: users.filter(u => u.status !== UserStatus.ACTIVE).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Usuários</h2>
          <p className="text-muted-foreground">Gestão de usuários e permissões do sistema</p>
        </div>
        <UserForm />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inativos / Suspensos</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle>Lista de Usuários</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, e-mail ou CPF..."
              className="pl-8"
              value={filters.search ?? ''}
              onChange={e =>
                setFilters(prev => ({ ...prev, search: e.target.value || undefined }))
              }
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Carregando...</div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Último acesso:{' '}
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={getUserRoleColor(user.role)} variant="secondary">
                        {getUserRoleLabel(user.role)}
                      </Badge>
                      <Badge
                        className={getUserStatusColor(user.status)}
                        variant="secondary"
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UsersPage;
