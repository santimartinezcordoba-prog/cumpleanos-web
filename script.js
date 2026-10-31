document.addEventListener("DOMContentLoaded", () => {
  const seleccion = document.getElementById("seleccion-usuario");
  const zonaBrenda = document.getElementById("zona-brenda");
  const zonaInvitado = document.getElementById("zona-invitado");
  const contenidoSorpresa = document.getElementById("contenido-sorpresa");
  const volverInicio = document.getElementById("volverInicio");
  const piePagina = document.getElementById("piePagina");

  const btnBrenda = document.getElementById("btnBrenda");
  const btnInvitado = document.getElementById("btnInvitado");
  const abrirSorpresa = document.getElementById("abrirSorpresa");
  const form = document.getElementById("formFelicitacion");
  const muro = document.getElementById("muroFelicitaciones");
  const galeria = document.getElementById("galeriaVideos");
  const panelMusica = document.getElementById("panel-musica");

contenidoSorpresa.classList.remove("oculto");
panelMusica.classList.remove("oculto");
  const estadoFormulario = document.getElementById("estadoFormulario");

  function mostrarModo(modo) {
    seleccion.classList.add("oculto");
    zonaBrenda.classList.add("oculto");
    zonaInvitado.classList.add("oculto");
    contenidoSorpresa.classList.add("oculto");

    if (modo === "brenda") zonaBrenda.classList.remove("oculto");
    if (modo === "invitado") zonaInvitado.classList.remove("oculto");

    volverInicio.classList.remove("oculto");
    piePagina.classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  btnBrenda.addEventListener("click", () => mostrarModo("brenda"));
  btnInvitado.addEventListener("click", () => mostrarModo("invitado"));

  volverInicio.addEventListener("click", () => {
    detenerCorazones();
    zonaBrenda.classList.add("oculto");
    zonaInvitado.classList.add("oculto");
    contenidoSorpresa.classList.add("oculto");
    seleccion.classList.remove("oculto");
    volverInicio.classList.add("oculto");
    piePagina.classList.add("oculto");
    abrirSorpresa.disabled = false;
    abrirSorpresa.textContent = "🎁 Abrir mi sorpresa";
    window.scrollTo({ top: 0, behavior: "smooth" });
    panelMusica.classList.add("oculto");
  });

  function lanzarConfeti() {
    const colores = ["#ff69b4", "#ffd700", "#b86bff", "#ffffff", "#ff99cc"];
    for (let i = 0; i < 120; i++) {
      const pieza = document.createElement("div");
      pieza.style.cssText = `position:fixed;width:${Math.random()*8+5}px;height:${Math.random()*8+5}px;background:${colores[Math.floor(Math.random()*colores.length)]};left:${Math.random()*100}vw;top:-20px;border-radius:2px;z-index:9999;pointer-events:none`;
      document.body.appendChild(pieza);
      const animacion = pieza.animate([
        { transform: "translateY(0) rotate(0deg)", opacity: 1 },
        { transform: `translateY(105vh) rotate(${Math.random()*720}deg)`, opacity: 0 }
      ], { duration: Math.random()*2500+2500, easing: "linear" });
      animacion.onfinish = () => pieza.remove();
    }
  }


abrirSorpresa.addEventListener("click", async () => {
    contenidoSorpresa.classList.remove("oculto");
    panelMusica.classList.remove("oculto");

    lanzarConfeti();
    iniciarCorazones();

    abrirSorpresa.textContent = "💖 ¡Sorpresa!";
    abrirSorpresa.disabled = true;

    await Promise.all([
        cargarFelicitaciones(),
        cargarVideos()
    ]);

    activarRevelaciones();

    contenidoSorpresa.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


  async function cargarFelicitaciones() {
    muro.textContent = "💌 Cargando felicitaciones...";
    try {
      const respuesta = await fetch("/api/felicitaciones");
      if (!respuesta.ok) throw new Error("Error al cargar los mensajes");
      const felicitaciones = await respuesta.json();
      muro.replaceChildren();

      if (!Array.isArray(felicitaciones) || felicitaciones.length === 0) {
        muro.textContent = "Todavía no hay felicitaciones. ¡Seguro que pronto llegarán! 💖";
        return;
      }

      felicitaciones.forEach((f) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "felicitacion";
        const nombre = document.createElement("h3");
        nombre.textContent = `💌 ${f.nombre || "Alguien especial"}`;
        const mensaje = document.createElement("p");
        mensaje.textContent = f.mensaje || "";
        tarjeta.append(nombre, mensaje);
        muro.appendChild(tarjeta);
      });
    } catch (error) {
      console.error(error);
      muro.textContent = "No se pudieron cargar las felicitaciones. Inténtalo más tarde.";
    }
  }

  async function cargarVideos() {
    galeria.textContent = "🎬 Cargando vídeos...";
    try {
      const respuesta = await fetch("/videos.json");
      if (!respuesta.ok) throw new Error("No se pudo encontrar videos.json");
      const videos = await respuesta.json();
      galeria.replaceChildren();

      if (!Array.isArray(videos) || videos.length === 0) {
        galeria.textContent = "Todavía no hay vídeos.";
        return;
      }

      videos.forEach((item) => {
        if (!item || typeof item.archivo !== "string") return;
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-video";
        const titulo = document.createElement("h3");
        titulo.textContent = item.titulo || "Una felicitación especial";
        const autor = document.createElement("p");
        autor.textContent = `🎥 De: ${item.nombre || "Alguien especial"}`;
        const reproductor = document.createElement("video");
        reproductor.controls = true;
        reproductor.preload = "metadata";
        reproductor.playsInline = true;
        const source = document.createElement("source");
        source.src = item.archivo;
        source.type = "video/mp4";
        reproductor.appendChild(source);
        tarjeta.append(titulo, autor, reproductor);
        galeria.appendChild(tarjeta);
      });

      if (!galeria.children.length) galeria.textContent = "No hay vídeos válidos en la galería.";
    } catch (error) {
      console.error(error);
      galeria.textContent = "No se pudieron cargar los vídeos.";
    }
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const boton = form.querySelector('button[type="submit"]');

    if (!nombre || !mensaje) {
      estadoFormulario.textContent = "Escribe tu nombre y tu felicitación ❤️";
      return;
    }

    const datos = new FormData();
    datos.append("nombre", nombre);
    datos.append("mensaje", mensaje);
    boton.disabled = true;
    boton.textContent = "💌 Enviando...";
    estadoFormulario.textContent = "";

    try {
      const respuesta = await fetch("/api/felicitaciones", { method: "POST", body: datos });
      const resultado = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok) throw new Error(resultado.error || "No se pudo enviar la felicitación.");
      form.reset();
      estadoFormulario.textContent = "¡Tu felicitación se ha enviado! Brenda podrá verla al abrir su sorpresa. 💖";
      lanzarConfeti();
    } catch (error) {
      console.error(error);
      estadoFormulario.textContent = error.message || "Ha ocurrido un error al enviar el mensaje.";
    } finally {
      boton.disabled = false;
      boton.textContent = "💖 Enviar felicitación";
    }
  });
  // ========================================
// 8. ANIMACIONES DINÁMICAS
// ========================================

// Crear corazones flotantes
function crearCorazon() {
    const corazon = document.createElement("span");

    const corazones = ["💖", "💕", "💗", "❤️", "✨"];

    corazon.textContent =
        corazones[Math.floor(Math.random() * corazones.length)];

    corazon.className = "corazon-flotante";

    corazon.style.left = Math.random() * 100 + "vw";
    corazon.style.fontSize = (Math.random() * 15 + 15) + "px";

    document.body.appendChild(corazon);

    const duracion = Math.random() * 3000 + 4000;

    const animacion = corazon.animate([
        {
            transform: "translateY(0) rotate(0deg)",
            opacity: 0
        },
        {
            opacity: 1,
            offset: 0.15
        },
        {
            transform: "translateY(-110vh) rotate(360deg)",
            opacity: 0
        }
    ], {
        duration: duracion,
        easing: "linear"
    });

    animacion.onfinish = () => corazon.remove();
}


// Iniciar lluvia de corazones
let intervaloCorazones;

function iniciarCorazones() {
    detenerCorazones();

    crearCorazon();

    intervaloCorazones = setInterval(() => {
        crearCorazon();
    }, 500);
}


// Detener lluvia de corazones
function detenerCorazones() {
    clearInterval(intervaloCorazones);

    document.querySelectorAll(".corazon-flotante")
        .forEach(corazon => corazon.remove());
}


// Revelar mensajes y vídeos progresivamente
function activarRevelaciones() {
    const elementos = document.querySelectorAll(
        "#contenido-sorpresa h2, " +
        "#muroFelicitaciones, " +
        "#galeriaVideos, " +
        ".tarjeta-video, " +
        ".felicitacion"
    );

    elementos.forEach((elemento, indice) => {
        elemento.classList.add("revelar-dinamico");

        setTimeout(() => {
            elemento.classList.add("visible");
        }, indice * 180);
    });
}
});
