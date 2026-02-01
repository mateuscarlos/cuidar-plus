import { lazy, Suspense } from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/core/lib/query-client";
import { validateEnv } from "@/core/config/env.config";
import AppLayout from "./components/layout/AppLayout";
import { LoadingSpinner } from "@/shared/ui/loading-spinner";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const PatientsPage = lazy(() => import("@/modules/patients/presentation/pages").then(module => ({ default: module.PatientsPage })));
const InventoryPage = lazy(() => import("@/modules/inventory/presentation/pages").then(module => ({ default: module.InventoryPage })));
const ReportsPage = lazy(() => import("@/modules/reports/presentation/pages").then(module => ({ default: module.ReportsPage })));
const UsersPage = lazy(() => import("@/modules/users/presentation/pages").then(module => ({ default: module.UsersPage })));
const InsurersPage = lazy(() => import("./pages/Insurers"));
const ProvidersPage = lazy(() => import("./pages/Providers"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Validar variáveis de ambiente na inicialização
validateEnv();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><LoadingSpinner /></div>}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/insurers" element={<InsurersPage />} />
              <Route path="/providers" element={<ProvidersPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;