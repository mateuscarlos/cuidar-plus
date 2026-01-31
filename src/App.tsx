import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/core/lib/query-client";
import { validateEnv } from "@/core/config/env.config";
import AppLayout from "./components/layout/AppLayout";
import { lazy } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const PatientsPage = lazy(() => import("@/modules/patients/presentation/pages").then(m => ({ default: m.PatientsPage })));
const InventoryPage = lazy(() => import("@/modules/inventory/presentation/pages").then(m => ({ default: m.InventoryPage })));
const ReportsPage = lazy(() => import("@/modules/reports/presentation/pages").then(m => ({ default: m.ReportsPage })));
const UsersPage = lazy(() => import("@/modules/users/presentation/pages").then(m => ({ default: m.UsersPage })));
const NotFound = lazy(() => import("./pages/NotFound"));

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
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
