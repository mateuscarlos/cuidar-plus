import React from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/core/lib/query-client";
import { validateEnv } from "@/core/config/env.config";
import AppLayout from "./components/layout/AppLayout";

// Lazy loading pages for performance optimization
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const PatientsPage = React.lazy(() => import("@/modules/patients/presentation/pages").then(module => ({ default: module.PatientsPage })));
const InventoryPage = React.lazy(() => import("@/modules/inventory/presentation/pages").then(module => ({ default: module.InventoryPage })));
const ReportsPage = React.lazy(() => import("@/modules/reports/presentation/pages").then(module => ({ default: module.ReportsPage })));
const UsersPage = React.lazy(() => import("@/modules/users/presentation/pages").then(module => ({ default: module.UsersPage })));
const InsurersPage = React.lazy(() => import("./pages/Insurers"));
const ProvidersPage = React.lazy(() => import("./pages/Providers"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Validar variáveis de ambiente na inicialização
validateEnv();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;