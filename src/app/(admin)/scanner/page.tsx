import { QrScanner } from "@/features/scanner/components/qr-scanner";

export const metadata = {
  title: "Scanner"
};

export default function ScannerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Scanner QR</h2>
        <p className="mt-2 text-muted-foreground">
          Valida entradas con camara y deja listo el flujo para Supabase.
        </p>
      </div>
      <QrScanner />
    </div>
  );
}
