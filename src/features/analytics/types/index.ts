export type SalesByEvent = {
  eventId: string;
  eventTitle: string;
  ticketsSold: number;
  ticketsAvailable: number;
  ticketsUsed: number;
  revenue: number;
  attendanceRate: number;
};

export type AnalyticsSummary = {
  totalRevenue: number;
  totalTicketsSold: number;
  totalTicketsUsed: number;
  averageAttendanceRate: number;
  salesByEvent: SalesByEvent[];
};

export type TimeSeriesPoint = {
  date: string;
  value: number;
};
