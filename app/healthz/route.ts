// Process health only: database availability must not trigger restart loops.
export function GET() {
  return Response.json({ status: "ok" });
}
