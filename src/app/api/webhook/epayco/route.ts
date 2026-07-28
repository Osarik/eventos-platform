import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  const x_ref_payco = payload.x_ref_payco;
  const x_transaction_id = payload.x_transaction_id;
  const x_cod_response = payload.x_cod_response;
  const x_response = payload.x_response;

  console.log("[ePayco Webhook] Recibido:", {
    ref: x_ref_payco,
    transaction: x_transaction_id,
    code: x_cod_response,
    response: x_response
  });

  if (x_cod_response === "1") {
    console.log("[ePayco Webhook] Pago aprobado:", x_ref_payco);
  } else if (x_cod_response === "2") {
    console.log("[ePayco Webhook] Pago rechazado:", x_ref_payco);
  } else {
    console.log("[ePayco Webhook] Estado desconocido:", x_cod_response);
  }

  return NextResponse.json({ status: "ok" });
}
