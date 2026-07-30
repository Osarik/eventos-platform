import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  QrCode,
  Settings,
  TicketCheck,
  BarChart3
} from "lucide-react";

import { EventCard } from "@/features/events/components/event-card";
import { Button } from "@/components/ui/button";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";
import { createSupabaseServerPageClient } from "@/services/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServerPageClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("usuarios")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  const isAdmin =
    role === "super_admin" || role === "admin" || role === "staff";

  if (isAdmin) {
    return <AdminDashboard role={role!} />;
  }

  return <PublicHome />;
}

async function PublicHome() {
  const eventRepo = new EventMockRepository();
  const featuredEvents = await eventRepo.listActive();

  return (
    <main>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/80" />
        </div>
        <div className="container relative z-10 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-in-up text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span>Los </span>
              <span>mejores </span>
              <span>partidos </span>
              <span>los </span>
              <span>vives </span>
              <span>en </span>
              <span>
                <span className="text-glow text-primary">La Jugada</span>
                <span> Bar</span>
              </span>
            </h1>
            <p className="animate-fade-in-up animation-delay-200 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              El parche oficial del fútbol en Cali. Compra tus entradas al
              instante y asegura tu lugar.
            </p>
            <div className="animate-fade-in-up animation-delay-400 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/eventos">
                  Próximos eventos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-20">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <p className="text-sm font-medium text-primary">
            ¿Por qué La Jugada?
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Vive el fútbol como nunca antes
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: CalendarDays,
              title: "Pantallas gigantes",
              text: "Fútbol en vivo con calidad de estadio. Vive cada jugada como si estuvieras en la cancha."
            },
            {
              icon: TicketCheck,
              title: "Entradas con QR",
              text: "Compra y recibe tu código QR al instante. Acceso rápido y sin filas a todos nuestros eventos."
            },
            {
              icon: MapPin,
              title: "Dos sedes en Cali",
              text: "Sede Ingenio y Sede Aristi. El mejor ambiente futbolero te espera en ambas ubicaciones."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border bg-card p-6 text-center"
            >
              <item.icon className="mx-auto mb-4 h-6 w-6 text-primary" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Próximos eventos
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                No te pierdas ni una jugada
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/eventos">Ver todos</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const adminLinks = [
  {
    href: "/dashboard/eventos",
    icon: CalendarDays,
    title: "Eventos",
    desc: "Gestionar eventos, crear nuevos, editar"
  },
  {
    href: "/dashboard/tickets",
    icon: TicketCheck,
    title: "Tickets",
    desc: "Ver entradas vendidas y su estado"
  },
  {
    href: "/dashboard/ventas",
    icon: BarChart3,
    title: "Ventas",
    desc: "Reportes y estadisticas de ventas"
  },
  {
    href: "/scanner",
    icon: QrCode,
    title: "Scanner QR",
    desc: "Validar entradas en la puerta del evento"
  },
  {
    href: "/dashboard/configuracion",
    icon: Settings,
    title: "Configuracion",
    desc: "Ajustes de la plataforma"
  }
];

async function AdminDashboard({ role }: { role: string }) {
  const eventRepo = new EventMockRepository();
  const events = await eventRepo.list();
  const totalCapacity = events.reduce((acc, e) => acc + e.capacity, 0);

  const supabasePage = await createSupabaseServerPageClient();
  const { count: ticketCount } = await supabasePage
    .from("tickets")
    .select("*", { count: "exact", head: true });

  return (
    <main className="container py-14">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Panel de administracion
        </h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenido, administrador ({role})
        </p>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Eventos activos</p>
          <p className="mt-1 text-3xl font-semibold">{events.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Capacidad total</p>
          <p className="mt-1 text-3xl font-semibold">
            {totalCapacity.toLocaleString("es-CO")}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Tickets emitidos</p>
          <p className="mt-1 text-3xl font-semibold">{ticketCount ?? 0}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-lg border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <link.icon className="mb-4 h-5 w-5 text-primary" />
            <h3 className="font-semibold group-hover:text-primary">
              {link.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{link.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
