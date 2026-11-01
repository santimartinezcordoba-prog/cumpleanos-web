export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, nombre, mensaje, created_at
      FROM felicitaciones
      ORDER BY created_at DESC
      LIMIT 100
    `).all();
    return Response.json(results);
  } catch (error) {
    console.error("Error leyendo felicitaciones:", error);
    return Response.json({ error: "No se pudieron cargar las felicitaciones." }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 100000) {
      return Response.json({ error: "El mensaje es demasiado grande." }, { status: 413 });
    }

    const datos = await request.formData();
    const nombre = String(datos.get("nombre") || "").trim();
    const mensaje = String(datos.get("mensaje") || "").trim();

    if (!nombre || !mensaje || nombre.length > 60 || mensaje.length > 2000) {
      return Response.json({ error: "Nombre o mensaje inválido." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO felicitaciones (id, nombre, mensaje, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(id, nombre, mensaje, new Date().toISOString()).run();

    return Response.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("Error guardando felicitación:", error);
    return Response.json({ error: "No se pudo guardar la felicitación." }, { status: 500 });
  }
}
