
import { performance } from 'perf_hooks';

// Minimal types for the benchmark
enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  status: UserStatus;
}

interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

// Generate mock data
const ROLES = [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST];
const STATUSES = [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED];

function generateUsers(count: number): User[] {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: `user-${i}`,
      name: `User Name ${i}`,
      email: `user${i}@example.com`,
      cpf: `123.456.789-${(i % 100).toString().padStart(2, '0')}`,
      role: ROLES[i % ROLES.length],
      status: STATUSES[i % STATUSES.length],
    });
  }
  return users;
}

const USERS_COUNT = 100000;
console.log(`Generating ${USERS_COUNT} users...`);
const mockUsers = generateUsers(USERS_COUNT);
console.log('Users generated.');

// Test filters
const filters: UserFilters = {
  search: '50', // Should match some names, emails, cpfs
  role: UserRole.DOCTOR,
  status: UserStatus.ACTIVE,
};

// Current Implementation (Chained)
function filterChained(users: User[], filters: UserFilters): User[] {
  let filtered = [...users];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.cpf.includes(search)
    );
  }

  if (filters.role) {
    filtered = filtered.filter(u => u.role === filters.role);
  }

  if (filters.status) {
    filtered = filtered.filter(u => u.status === filters.status);
  }

  return filtered;
}

// Optimized Implementation (Single pass)
function filterOptimized(users: User[], filters: UserFilters): User[] {
  const search = filters.search ? filters.search.toLowerCase() : null;

  return users.filter(u => {
    // Search filter
    if (search) {
      const matchesSearch =
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.cpf.includes(search);

      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters.role && u.role !== filters.role) {
      return false;
    }

    // Status filter
    if (filters.status && u.status !== filters.status) {
      return false;
    }

    return true;
  });
}

function runBenchmark() {
  const ITERATIONS = 100;

  // Warmup
  filterChained(mockUsers, filters);
  filterOptimized(mockUsers, filters);

  // Measure Chained
  let start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    filterChained(mockUsers, filters);
  }
  let end = performance.now();
  const chainedTime = (end - start) / ITERATIONS;
  console.log(`Chained Filter Average Time: ${chainedTime.toFixed(4)} ms`);

  // Measure Optimized
  start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    filterOptimized(mockUsers, filters);
  }
  end = performance.now();
  const optimizedTime = (end - start) / ITERATIONS;
  console.log(`Optimized Filter Average Time: ${optimizedTime.toFixed(4)} ms`);

  const improvement = ((chainedTime - optimizedTime) / chainedTime) * 100;
  console.log(`Improvement: ${improvement.toFixed(2)}%`);
  console.log(`Speedup: ${(chainedTime / optimizedTime).toFixed(2)}x`);

  // Verify correctness
  const res1 = filterChained(mockUsers, filters);
  const res2 = filterOptimized(mockUsers, filters);

  console.log(`Results match length: ${res1.length === res2.length}`);
  if (res1.length !== res2.length) {
      console.error('Mismatch in result length!', res1.length, res2.length);
  }
}

runBenchmark();
