import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/core/lib/query-client";
import { validateEnv } from "@/core/config/env.config";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import { PatientsPage } from "@/modules/patients/presentation/pages";
import { InventoryPage } from "@/modules/inventory/presentation/pages";
import { ReportsPage } from "@/modules/reports/presentation/pages";
import { UsersPage } from "@/modules/users/presentation/pages";
import InsurersPage from "./pages/Insurers";
import ProvidersPage from "./pages/Providers";
import NotFound from "./pages/NotFound";

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