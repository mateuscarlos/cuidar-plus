import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { queryClient } from "@/core/lib/query-client";
import { validateEnv } from "@/core/config/env.config";
import { AppLayout } from "@/shared/layouts";
import { NotFound } from "@/shared/pages";

const DashboardPage = lazy(() =>
  import("@/modules/dashboard").then(m => ({ default: m.DashboardPage }))
);
const PatientsPage = lazy(() =>
  import("@/modules/patients/presentation/pages").then(m => ({ default: m.PatientsPage }))
);
const InventoryPage = lazy(() =>
  import("@/modules/inventory/presentation/pages").then(m => ({ default: m.InventoryPage }))
);
const ReportsPage = lazy(() =>
  import("@/modules/reports/presentation/pages").then(m => ({ default: m.ReportsPage }))
);
const UsersPage = lazy(() =>
  import("@/modules/users/presentation/pages").then(m => ({ default: m.UsersPage }))
);

validateEnv();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
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
