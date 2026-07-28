import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Configuracion"
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Configuracion</h2>
        <p className="mt-2 text-muted-foreground">
          Variables operativas para organizadores, pagos y notificaciones.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Organizacion</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="orgName">Nombre</Label>
            <Input id="orgName" defaultValue="Eventos Platform" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Correo soporte</Label>
            <Input id="supportEmail" defaultValue="soporte@eventos.com" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
