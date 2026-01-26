import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Plus, Shield, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Administração de Usuários</h2>
          <p className="text-muted-foreground">Gerencie acesso e permissões da equipe.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: "Dr. Roberto", role: "Médico Supervisor", type: "Admin", email: "roberto@cuidar.mais" },
          { name: "Enf. Ana", role: "Enfermeira Chefe", type: "Gestor", email: "ana@cuidar.mais" },
          { name: "Carlos Adm", role: "Administrativo", type: "Operador", email: "carlos@cuidar.mais" },
        ].map((user, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <CardDescription>{user.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm mt-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <Shield className="h-4 w-4" />
                  {user.type}
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <UserCog className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                {user.email}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;