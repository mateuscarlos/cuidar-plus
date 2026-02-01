import { useState, Suspense } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LoadingSpinner } from "@/shared/ui/loading-spinner";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileBarChart, 
  Settings, 
  Menu, 
  X,
  Stethoscope,
  LogOut,
  ChevronDown,
  ChevronRight,
  Building2,
  Building
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { cn } from "@/shared/utils/cn";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";

const Sidebar = ({ className, onClose }: { className?: string, onClose?: () => void }) => {
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(
    location.pathname.startsWith('/users') || 
    location.pathname.startsWith('/insurers') || 
    location.pathname.startsWith('/providers')
  );
  
  const mainMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Pacientes", path: "/patients" },
    { icon: Package, label: "Insumos & Farmácia", path: "/inventory" },
    { icon: FileBarChart, label: "Relatórios", path: "/reports" },
  ];

  const adminMenuItems = [
    { icon: Users, label: "Usuários", path: "/users" },
    { icon: Building2, label: "Operadoras", path: "/insurers" },
    { icon: Building, label: "Prestadoras", path: "/providers" },
  ];

  const isAdminActive = location.pathname.startsWith('/users') || 
                        location.pathname.startsWith('/insurers') || 
                        location.pathname.startsWith('/providers');

  return (
    <div className={cn("flex flex-col h-full bg-white border-r", className)}>
      <div className="p-6 flex items-center gap-2 border-b">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-xl text-primary">Cuidar +</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Main Menu Items */}
        {mainMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {/* Administration Collapsible Menu */}
        <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
          <CollapsibleTrigger 
            className={cn(
              "flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              isAdminActive 
                ? "bg-primary/10 text-primary" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              <span>Administração</span>
            </div>
            {adminOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
            {adminMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 pl-10 pr-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-full">
        <Sidebar className="h-full" />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-primary">Cuidar +</span>
          </div>
          
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar onClose={() => setIsMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingSpinner /></div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;