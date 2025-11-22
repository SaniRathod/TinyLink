export async function GET() {
  return new Response(JSON.stringify({ ok: true, version: "1.0" }), { status: 200, headers: { "content-type": "application/json" } });
}
