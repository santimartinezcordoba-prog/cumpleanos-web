
export async function onRequestGet({ env }) {
    const { results } = await env.DB.prepare(`
        SELECT id, nombre, mensaje, created_at
        FROM felicitaciones
        ORDER BY created_at DESC
        LIMIT 100
    `).all();

    return Response.json(results);
}

export async function onRequestPost({ request, env }) {
    const datos = await request.formData();

    const nombre = String(datos.get("nombre") || "").trim();
    const mensaje = String(datos.get("mensaje") || "").trim();

    if (!nombre || !mensaje ||
        nombre.length > 60 || mensaje.length > 2000) {
        return Response.json(
            { error: "Nombre o mensaje inválido" },
            { status: 400 }
        );
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(`
        INSERT INTO felicitaciones
        (id, nombre, mensaje, created_at)
        VALUES (?, ?, ?, ?)
    `).bind(
        id,
        nombre,
        mensaje,
        new Date().toISOString()
    ).run();

    return Response.json({ ok: true }, { status: 201 });
}
