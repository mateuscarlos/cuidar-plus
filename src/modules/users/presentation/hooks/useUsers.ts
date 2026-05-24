import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/core/lib/query-client';
import { MESSAGES } from '@/core/constants';
import { ENV } from '@/core/config';
import { UserService } from '../../data/user.service';
import { getMockUsers, addMockUser, updateMockUser, deleteMockUser } from '../../data/user.mock';
import type { User, UserFilters, CreateUserDTO, UpdateUserDTO } from '../../domain';
import { UserStatus } from '../../domain';

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.list(filters),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = getMockUsers();

        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            u =>
              u.name.toLowerCase().includes(search) ||
              u.email.toLowerCase().includes(search) ||
              u.cpf.includes(search)
          );
        }
        if (filters.role) filtered = filtered.filter(u => u.role === filters.role);
        if (filters.status) filtered = filtered.filter(u => u.status === filters.status);

        return {
          data: filtered,
          pagination: { total: filtered.length, page: 1, pageSize: 20, totalPages: 1 },
        };
      }

      return UserService.fetchUsers(filters);
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.detail(id),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const user = getMockUsers().find(u => u.id === id);
        if (!user) throw new Error('Usuário não encontrado');
        return user;
      }
      return UserService.getUserById(id);
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDTO): Promise<User> => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newUser: User = {
          ...data,
          id: `user-${Date.now()}`,
          status: UserStatus.ACTIVE,
          permissions: data.permissions ?? [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addMockUser(newUser);
        return newUser;
      }
      return UserService.createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.all });
      toast.success('Usuário cadastrado com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao cadastrar usuário', { description: error.message });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateUserDTO }) => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const updated = updateMockUser(id, updates);
        if (!updated) throw new Error('Usuário não encontrado');
        return updated;
      }
      return UserService.updateUser(id, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.detail(variables.id) });
      toast.success('Usuário atualizado', { description: MESSAGES.SUCCESS.UPDATED });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        deleteMockUser(id);
        return;
      }
      return UserService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.all });
      toast.success('Usuário removido', { description: MESSAGES.SUCCESS.DELETED });
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.detail('me'),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return getMockUsers()[2]; // Admin user
      }
      return UserService.getCurrentUser();
    },
  });
}
