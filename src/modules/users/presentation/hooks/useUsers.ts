/**
 * Users Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/core/lib/query-client';
import { MESSAGES } from '@/core/constants';
import { ENV } from '@/core/config';
import { UserService } from '../../data/user.service';
import { mockUsers } from '../../data/user.mock';
import type { UserFilters, CreateUserDTO, UpdateUserDTO } from '../../domain';

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.list(filters),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const search = filters.search ? filters.search.toLowerCase() : null;
        
        const filtered = mockUsers.filter(u => {
          if (search) {
            const matchesSearch =
              u.name.toLowerCase().includes(search) ||
              u.email.toLowerCase().includes(search) ||
              u.cpf.includes(search);

            if (!matchesSearch) return false;
          }

          if (filters.role && u.role !== filters.role) {
            return false;
          }

          if (filters.status && u.status !== filters.status) {
            return false;
          }

          return true;
        });
        
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
      
      return UserService.fetchUsers(filters);
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.detail(id),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const user = mockUsers.find(u => u.id === id);
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
    mutationFn: (user: CreateUserDTO) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve({
          ...user,
          id: `mock-${Date.now()}`,
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return UserService.createUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.all });
      toast.success('Usuário cadastrado', { description: MESSAGES.SUCCESS.CREATED });
    },
    onError: (error: Error) => {
      toast.error('Erro ao cadastrar usuário', { description: error.message });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateUserDTO }) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve({ id, ...updates });
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
    mutationFn: (id: string) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve();
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
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockUsers[2]; // Admin user
      }
      return UserService.getCurrentUser();
    },
  });
}
