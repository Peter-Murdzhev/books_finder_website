export async function GET() {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/keep_alive?select=id`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      }
    );

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Error in keep alive endpoint" });
  }
}