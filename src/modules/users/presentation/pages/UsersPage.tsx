/**
 * Users Page
 */

import { useState, useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Plus, Users as UsersIcon, UserCheck, UserX } from 'lucide-react';
import { useUsers } from '../hooks';
import { UserFilters, UserStatus } from '../../domain';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { getUserRoleLabel, getUserRoleColor, getUserStatusColor } from '../../domain/User.rules';
import { formatDate } from '@/core/lib/formatters';

export function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({ page: 1, pageSize: 20 });
  const { data, isLoading } = useUsers(filters);

  const stats = useMemo(() => {
    const users = data?.data || [];
    return users.reduce(
      (acc, user) => {
        acc.total++;
        if (user.status === UserStatus.ACTIVE) acc.active++;
        else if (user.status === UserStatus.INACTIVE) acc.inactive++;
        return acc;
      },
      { total: 0, active: 0, inactive: 0 }
    );
  }, [data?.data]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Usuários</h2>
          <p className="text-muted-foreground">Gestão de usuários e permissões</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Usuário
        </Button>
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
                <p className="text-sm text-muted-foreground">Usuários Inativos</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center">Carregando...</div>
            ) : data?.data.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Último acesso: {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={getUserRoleColor(user.role)} variant="secondary">
                      {getUserRoleLabel(user.role)}
                    </Badge>
                    <br />
                    <Badge className={`${getUserStatusColor(user.status)} mt-2`} variant="secondary">
                      {user.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UsersPage;
