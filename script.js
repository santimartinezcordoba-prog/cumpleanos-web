
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. CONEXIÓN CON SUPABASE
    // ==========================================

    const SUPABASE_URL = "https://ckcfqaxqexyiybqsldow.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_odFbdmCLZ1zryWfYS4GJFA_yWJS3nxc";

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    // ==========================================
    // 2. ELEMENTOS HTML
    // ==========================================

    const seleccion = document.getElementById("seleccion-usuario");
    const accesoBrenda = document.getElementById("acceso-brenda");
    const zonaBrenda = document.getElementById("zona-brenda");
    const zonaInvitado = document.getElementById("zona-invitado");

    const volverInicio = document.getElementById("volverInicio");
    const piePagina = document.getElementById("piePagina");

    const btnBrenda = document.getElementById("btnBrenda");
    const btnInvitado = document.getElementById("btnInvitado");

    const formCodigo = document.getElementById("formCodigo");
    const codigoBrenda = document.getElementById("codigoBrenda");
    const estadoCodigo = document.getElementById("estadoCodigo");
    const btnVerificarCodigo = document.getElementById("btnVerificarCodigo");

    const abrirSorpresa = document.getElementById("abrirSorpresa");
    const zonaCartas = document.getElementById("zona-cartas");
    const muro = document.getElementById("muroFelicitaciones");
    const abrirSorpresaFinal = document.getElementById("abrirSorpresaFinal");

    const cartaAnterior = document.getElementById("cartaAnterior");
    const cartaSiguiente = document.getElementById("cartaSiguiente");
    // Ventana de las cartas
    const modalCarta = document.getElementById("modalCarta");
    const cerrarCarta = document.getElementById("cerrarCarta");
    const numeroCarta = document.getElementById("numeroCarta");
    const nombreCarta = document.getElementById("nombreCarta");
    const mensajeCarta = document.getElementById("mensajeCarta");

    const zonaFinal = document.getElementById("zona-final");
    const galeria = document.getElementById("galeriaVideos");
    const videoAnterior = document.getElementById("videoAnterior");
    const videoSiguiente = document.getElementById("videoSiguiente");
    const volverCartas = document.getElementById("volverCartas");
    const volverColeccionVideos = document.getElementById("volverColeccionVideos");
    const pantallaReproduccion = document.getElementById("pantallaReproduccion");
    const coleccionVideos = document.getElementById("coleccionVideos");
    const listaVideos = document.getElementById("listaVideos");
    const volverCartasColeccion = document.getElementById("volverCartasColeccion");
    const terminarSorpresa = document.getElementById("terminarSorpresa");
    const pantallaFinal = document.getElementById("pantallaFinal");
    const volverCartasFinal = document.getElementById("volverCartasFinal");

    const form = document.getElementById("formFelicitacion");
    const estadoFormulario = document.getElementById("estadoFormulario");

    const panelMusica = document.getElementById("panel-musica");
    const panelPersonaje = document.getElementById("panel-personaje");

    // Comprobar que el HTML y el JS coinciden.
const elementos = {
    seleccion, accesoBrenda, zonaBrenda, zonaInvitado,
    volverInicio, piePagina, btnBrenda, btnInvitado,
    formCodigo, codigoBrenda, estadoCodigo,
    btnVerificarCodigo, abrirSorpresa, zonaCartas,
    muro, abrirSorpresaFinal,
    modalCarta, cerrarCarta, numeroCarta,
    nombreCarta, mensajeCarta,
    zonaFinal, galeria, form, estadoFormulario,
    panelMusica, panelPersonaje,
    cartaAnterior,cartaSiguiente,
    videoAnterior,videoSiguiente,volverCartas,
    volverColeccionVideos, pantallaReproduccion, coleccionVideos,
    listaVideos, volverCartasColeccion, terminarSorpresa,
    pantallaFinal, volverCartasFinal,
};

    const faltante = Object.entries(elementos)
        .find(([, elemento]) => !elemento);

    if (faltante) {
        console.error("Falta un elemento HTML:", faltante[0]);
        return;
    }
    // La ventana de vídeos debe estar fuera de la tarjeta principal.
        document.body.appendChild(zonaFinal);

    // ==========================================
    // 3. ESTADO DE LA PÁGINA
    // ==========================================

    let felicitacionesPrivadas = [];
    let indiceCarta = 0;
    let accesoAutorizado = false;

    let videosCargados = false;
    let videosDisponibles = [];
    let indiceVideo = 0;
    let videoDesdeColeccion = false;

    function ocultarTodo() {
        seleccion.classList.add("oculto");
        accesoBrenda.classList.add("oculto");
        zonaBrenda.classList.add("oculto");
        zonaInvitado.classList.add("oculto");
        volverInicio.classList.add("oculto");
        piePagina.classList.add("oculto");
        panelMusica.classList.add("oculto");
        panelPersonaje.classList.add("oculto");
    }

    function mostrarPantalla(elemento) {
        ocultarTodo();
        elemento.classList.remove("oculto");
        volverInicio.classList.remove("oculto");
        piePagina.classList.remove("oculto");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    ocultarTodo();
    seleccion.classList.remove("oculto");

    // ==========================================
    // 4. NAVEGACIÓN
    // ==========================================

    btnBrenda.addEventListener("click", () => {
        mostrarPantalla(accesoBrenda);
        codigoBrenda.focus();
    });

    btnInvitado.addEventListener("click", () => {
        mostrarPantalla(zonaInvitado);
    });

    volverInicio.addEventListener("click", () => {

    detenerCorazones();
    detenerVideoActual();

    document.body.classList.remove("modo-videos");

    videosDisponibles = [];
    indiceVideo = 0;

    // El resto de tu código continúa igual.

        accesoAutorizado = false;
        felicitacionesPrivadas = [];
        indiceCarta = 0;
        videosCargados = false;

        codigoBrenda.value = "";
        estadoCodigo.textContent = "";

        zonaCartas.classList.add("oculto");
        zonaFinal.classList.add("oculto");
        muro.replaceChildren();
        galeria.replaceChildren();

        abrirSorpresa.disabled = false;
        abrirSorpresa.textContent = "💌 Descubrir tus cartas";

        cerrarModalCarta();
        abrirSorpresaFinal.classList.add("oculto");

        mostrarPantalla(seleccion);
    });

    // ==========================================
    // 5. CÓDIGO SECRETO DE BRENDA
    // ==========================================

    formCodigo.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const codigo = codigoBrenda.value.trim();

        if (!codigo) {
            estadoCodigo.textContent = "Introduce tu código secreto.";
            return;
        }

        btnVerificarCodigo.disabled = true;
        btnVerificarCodigo.textContent = "🔐 Comprobando...";
        estadoCodigo.textContent = "";

        try {
            /*
              Esta función se creará en Supabase más adelante.

              Nunca escribiremos el código secreto aquí.
              La comprobación se realizará en el servidor.
            */

            const respuesta = await fetch(
                `${SUPABASE_URL}/functions/v1/brenda-access`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": SUPABASE_PUBLISHABLE_KEY
                    },
                    body: JSON.stringify({ password: codigo })
                }
            );

            const resultado = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok || !resultado.ok) {
                throw new Error(
                    resultado.error || "El código no es correcto."
                );
            }

            if (!Array.isArray(resultado.felicitaciones)) {
                throw new Error("La respuesta del servidor no es válida.");
            }

            felicitacionesPrivadas = resultado.felicitaciones;
            accesoAutorizado = true;

            mostrarPantalla(zonaBrenda);

            panelMusica.classList.remove("oculto");
            panelPersonaje.classList.remove("oculto");

            lanzarConfeti();
            iniciarCorazones();

        } catch (error) {
            console.error("Error verificando el código:", error);

            estadoCodigo.textContent =
                error.message || "No se pudo verificar el código.";
        } finally {
            btnVerificarCodigo.disabled = false;
            btnVerificarCodigo.textContent = "🔐 Desbloquear";
            codigoBrenda.value = "";
        }
    });

    
    // ==========================================
    // 6. SISTEMA DE CARTAS
    // ==========================================

    indiceCartaActual = 0;

    modalCarta.classList.add("oculto");

    document.body.classList.remove("modal-abierto");

    muro.classList.add("oculto");

    abrirSorpresaFinal.classList.add("oculto");

    // Al descubrir las cartas, aparece directamente la primera.
    abrirSorpresa.addEventListener("click", () => {

        if (!accesoAutorizado) return;

        zonaCartas.classList.remove("oculto");

        abrirSorpresa.disabled = true;
        abrirSorpresa.textContent = "💖 Tus cartas";

        muro.classList.add("oculto");
        abrirSorpresaFinal.classList.add("oculto");

        zonaCartas.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        if (felicitacionesPrivadas.length === 0) {

            muro.classList.remove("oculto");

            muro.textContent =
                "Todavía no hay felicitaciones. ¡Seguro que pronto llegarán! 💖";

            abrirSorpresaFinal.classList.remove("oculto");

            return;
        }

        indiceCartaActual = 0;

        mostrarCarta(0);
    });


    // Mostrar una carta concreta
    function mostrarCarta(indice) {

        if (!accesoAutorizado) return;

        if (
            indice < 0 ||
            indice >= felicitacionesPrivadas.length
        ) return;

        indiceCartaActual = indice;

        const f = felicitacionesPrivadas[indice];

        numeroCarta.textContent =
            `CARTA ${indice + 1} DE ${felicitacionesPrivadas.length}`;

        nombreCarta.textContent =
            `💌 ${f.nombre || "Alguien especial"}`;

        mensajeCarta.textContent =
            f.mensaje || "";

        // Mostrar ventana
        modalCarta.classList.remove("oculto");

        document.body.classList.add("modal-abierto");

        // Botón anterior
        cartaAnterior.disabled = indice === 0;

        // Texto del botón siguiente
        if (indice === felicitacionesPrivadas.length - 1) {

            cartaSiguiente.textContent =
                "Ver todas las cartas ✨";

        } else {

            cartaSiguiente.textContent =
                "Siguiente carta →";

        }
    }


    // Carta anterior
    cartaAnterior.addEventListener("click", () => {

        if (indiceCartaActual > 0) {

            mostrarCarta(indiceCartaActual - 1);

        }

    });


    // Siguiente carta o terminar la lectura
    cartaSiguiente.addEventListener("click", () => {

        if (
            indiceCartaActual <
            felicitacionesPrivadas.length - 1
        ) {

            mostrarCarta(indiceCartaActual + 1);

        } else {

            mostrarColeccionCartas();

        }

    });


    // Crear la colección de sobres
    function renderizarColeccionCartas() {

        muro.replaceChildren();

        if (felicitacionesPrivadas.length === 0) {

            muro.textContent =
                "Todavía no hay felicitaciones. 💖";

            return;
        }

        felicitacionesPrivadas.forEach((f, index) => {

            const sobre = document.createElement("button");

            sobre.type = "button";
            sobre.className = "sobre-carta";

            const icono = document.createElement("span");
            icono.className = "icono-sobre";
            icono.textContent = "💌";

            const titulo = document.createElement("strong");
            titulo.textContent = "Una carta para ti";

            const remitente = document.createElement("span");

            remitente.textContent =
                `De: ${f.nombre || "Alguien especial"}`;

            const accion = document.createElement("span");
            accion.className = "abrir-sobre-texto";
            accion.textContent = "Pulsa para abrir ✨";

            sobre.append(
                icono,
                titulo,
                remitente,
                accion
            );

            // Abrir cualquier carta de la colección
            sobre.addEventListener("click", () => {

                mostrarCarta(index);

            });

            muro.appendChild(sobre);

        });

    }


    // Mostrar todas las cartas después de la lectura
    function mostrarColeccionCartas() {

        modalCarta.classList.add("oculto");

        document.body.classList.remove("modal-abierto");

        renderizarColeccionCartas();

        muro.classList.remove("oculto");

        abrirSorpresaFinal.classList.remove("oculto");

    }


    // Cerrar la carta con la X
    cerrarCarta.addEventListener("click", () => {

        mostrarColeccionCartas();

    });


    // Cerrar pulsando fuera de la carta
    modalCarta.addEventListener("click", (evento) => {

        if (evento.target === modalCarta) {

            mostrarColeccionCartas();

        }

    });


    // Cerrar pulsando Escape
    document.addEventListener("keydown", (evento) => {

        if (
            evento.key === "Escape" &&
            !modalCarta.classList.contains("oculto")
        ) {

            mostrarColeccionCartas();

        }

    });

    // Abrir una carta en el centro de la pantalla
    function abrirCarta(f, index, origen) {

        if (!accesoAutorizado) return;

        ultimaCartaAbierta = origen;

        numeroCarta.textContent =
            `CARTA ${index + 1} DE ${felicitacionesPrivadas.length}`;

        nombreCarta.textContent =
            `💌 ${f.nombre || "Alguien especial"}`;

        mensajeCarta.textContent =
            f.mensaje || "";

        modalCarta.classList.remove("oculto");

        document.body.classList.add("modal-abierto");

        cerrarCarta.focus();
    }

    // Cerrar la carta
    function cerrarModalCarta() {

        if (modalCarta.classList.contains("oculto")) return;

        modalCarta.classList.add("oculto");

        document.body.classList.remove("modal-abierto");

        if (ultimaCartaAbierta && ultimaCartaAbierta.isConnected) {
            ultimaCartaAbierta.focus();
        }
    }

    cerrarCarta.addEventListener("click", cerrarModalCarta);

    // Cerrar al pulsar fuera de la carta
    modalCarta.addEventListener("click", (evento) => {

        if (evento.target === modalCarta) {
            cerrarModalCarta();
        }

    });

    // Cerrar también con Escape
    document.addEventListener("keydown", (evento) => {

        if (
            evento.key === "Escape" &&
            !modalCarta.classList.contains("oculto")
        ) {
            cerrarModalCarta();
        }

    });

   
    // ==========================================
    // 7. SORPRESA FINAL: VÍDEOS
    // ==========================================

    abrirSorpresaFinal.addEventListener("click", async () => {
        if (!accesoAutorizado || abrirSorpresaFinal.disabled) return;

        abrirSorpresaFinal.disabled = true;
        abrirSorpresaFinal.textContent = "🎬 Preparando sorpresa...";

        pantallaFinal.classList.add("oculto");
        coleccionVideos.classList.add("oculto");
        pantallaReproduccion.classList.remove("oculto");
        zonaFinal.classList.remove("modo-final", "oculto");
        document.body.classList.remove("modo-final");
        document.body.classList.add("modo-videos");

        lanzarConfeti();

        if (!videosCargados) {
            videosCargados = await cargarVideos();
        }

        indiceVideo = 0;
        videoDesdeColeccion = false;
        mostrarVideo();
    });


    // videos.json solo se solicita después de que Brenda desbloquee la sorpresa.
    async function cargarVideos() {
        galeria.textContent = "🎬 Preparando tus vídeos...";

        try {
            const respuesta = await fetch("./videos.json", { cache: "no-store" });
            if (!respuesta.ok) throw new Error("No se pudo encontrar videos.json");

            const datos = await respuesta.json();
            if (!Array.isArray(datos)) throw new Error("videos.json no contiene una lista");

            videosDisponibles = datos.filter(item =>
                item && typeof item.archivo === "string" &&
                item.archivo.trim().length > 0
            );
            return true;
        } catch (error) {
            console.error("Error al cargar vídeos:", error);
            videosDisponibles = [];
            return false;
        }
    }


    function detenerVideoActual() {
        galeria.querySelectorAll("video").forEach(video => {
            video.pause();
            video.removeAttribute("src");
            video.querySelectorAll("source").forEach(source => {
                source.removeAttribute("src");
            });
            video.load();
        });
    }


    // Ventana emergente de un solo vídeo.
    function mostrarVideo() {
        if (!accesoAutorizado) return;

        detenerVideoActual();
        galeria.replaceChildren();
        pantallaReproduccion.classList.remove("oculto");
        coleccionVideos.classList.add("oculto");
        pantallaFinal.classList.add("oculto");

        volverCartas.classList.remove("oculto");
        volverColeccionVideos.classList.toggle("oculto", !videoDesdeColeccion);

        if (!videosDisponibles.length) {
            const aviso = document.createElement("p");
            aviso.textContent = videosCargados
                ? "Todavía no hay vídeos para mostrar. 💖"
                : "No se pudieron cargar los vídeos. Comprueba videos.json.";
            galeria.appendChild(aviso);
            videoAnterior.classList.add("oculto");
            videoSiguiente.classList.add("oculto");
            return;
        }

        const item = videosDisponibles[indiceVideo];

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-video animar-video";

        const numero = document.createElement("p");
        numero.textContent = "VÍDEO " + (indiceVideo + 1) +
            " DE " + videosDisponibles.length;

        const titulo = document.createElement("h3");
        titulo.textContent = item.titulo || "Una felicitación especial";

        const autor = document.createElement("p");
        autor.textContent = "🎥 De: " + (item.nombre || "Alguien especial");

        const reproductor = document.createElement("video");
        reproductor.controls = true;
        reproductor.preload = "metadata";
        reproductor.playsInline = true;

        const fuente = document.createElement("source");
        fuente.src = item.archivo;
        fuente.type = "video/mp4";
        reproductor.appendChild(fuente);

        tarjeta.append(numero, titulo, autor, reproductor);
        galeria.appendChild(tarjeta);

        videoAnterior.classList.toggle("oculto", indiceVideo === 0);

        // En el último vídeo, el botón conduce a la colección completa.
        videoSiguiente.classList.remove("oculto");
        videoSiguiente.textContent =
            indiceVideo === videosDisponibles.length - 1
                ? "🎬 Ver todos los vídeos"
                : "Siguiente vídeo →";
    }


    videoAnterior.addEventListener("click", () => {
        if (indiceVideo > 0) {
            indiceVideo--;
            mostrarVideo();
        }
    });

    videoSiguiente.addEventListener("click", () => {
        if (!videosDisponibles.length) return;

        if (indiceVideo < videosDisponibles.length - 1) {
            indiceVideo++;
            mostrarVideo();
        } else {
            mostrarColeccionVideos();
        }
    });


    // Cuadrícula de vídeos: cada tarjeta abre el reproductor individual.
    function mostrarColeccionVideos() {
        if (!accesoAutorizado) return;

        detenerVideoActual();
        galeria.replaceChildren();
        listaVideos.replaceChildren();

        pantallaReproduccion.classList.add("oculto");
        pantallaFinal.classList.add("oculto");
        coleccionVideos.classList.remove("oculto");
        videoDesdeColeccion = true;

        if (!videosDisponibles.length) {
            listaVideos.textContent = "No hay vídeos disponibles todavía.";
            return;
        }

        videosDisponibles.forEach((item, index) => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "miniatura-video";
            boton.setAttribute("aria-label",
                "Ver vídeo de " + (item.nombre || "Alguien especial"));

            const icono = document.createElement("span");
            icono.className = "miniatura-video-icono";
            icono.textContent = "▶";

            const titulo = document.createElement("strong");
            titulo.textContent = item.titulo || "Una felicitación especial";

            const autor = document.createElement("span");
            autor.textContent = "De: " + (item.nombre || "Alguien especial");

            boton.append(icono, titulo, autor);
            boton.addEventListener("click", () => {
                indiceVideo = index;
                videoDesdeColeccion = true;
                mostrarVideo();
            });
            listaVideos.appendChild(boton);
        });
    }

    volverColeccionVideos.addEventListener("click", mostrarColeccionVideos);


    // Volver a las cartas sin repetir la contraseña.
    function volverALasCartas() {
        detenerVideoActual();
        galeria.replaceChildren();

        zonaFinal.classList.add("oculto");
        zonaFinal.classList.remove("modo-final");
        pantallaFinal.classList.add("oculto");
        coleccionVideos.classList.add("oculto");
        pantallaReproduccion.classList.remove("oculto");

        document.body.classList.remove("modo-videos", "modo-final");

        abrirSorpresaFinal.disabled = false;
        abrirSorpresaFinal.textContent = "🎁 Abrir la sorpresa final";

        zonaCartas.classList.remove("oculto");
        mostrarColeccionCartas();
        zonaCartas.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    volverCartas.addEventListener("click", volverALasCartas);
    volverCartasColeccion.addEventListener("click", volverALasCartas);
    volverCartasFinal.addEventListener("click", volverALasCartas);


    // Felicitación final: ocultamos las cartas y los vídeos, pero no
    // los personajes ni la playlist de Brenda.
    terminarSorpresa.addEventListener("click", () => {
        if (!accesoAutorizado) return;
        detenerVideoActual();
        galeria.replaceChildren();

        coleccionVideos.classList.add("oculto");
        pantallaReproduccion.classList.add("oculto");
        pantallaFinal.classList.remove("oculto");

        document.body.classList.remove("modo-videos");
        document.body.classList.add("modo-final");
        zonaFinal.classList.add("modo-final");
        panelPersonaje.classList.remove("oculto");
        panelMusica.classList.remove("oculto");

        lanzarConfeti();
    });


    // ==========================================
    // 8. ENVIAR FELICITACIONES
    // ==========================================

    form.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        const boton = form.querySelector('button[type="submit"]');

        if (!nombre || !mensaje) {
            estadoFormulario.textContent =
                "Escribe tu nombre y tu felicitación ❤️";
            return;
        }

        boton.disabled = true;
        boton.textContent = "💌 Enviando...";
        estadoFormulario.textContent = "";

        try {

            const { error } = await supabaseClient
    .from("felicitaciones")
    .insert([{
        nombre: nombre,
        mensaje: mensaje
    }]);

            if (error) throw error;

            form.reset();

            estadoFormulario.textContent =
                "¡Tu felicitación se ha enviado! Gracias por participar. 💖";

            lanzarConfeti();

        } catch (error) {

            console.error("Error al enviar felicitación:", error);

            estadoFormulario.textContent =
                "No se pudo enviar la felicitación. Inténtalo de nuevo.";

        } finally {

            boton.disabled = false;
            boton.textContent = "💖 Enviar felicitación";
        }
    });

    // ==========================================
    // 9. CONFETI
    // ==========================================

    function lanzarConfeti() {

        const colores = [
            "#ff69b4",
            "#ffd700",
            "#b86bff",
            "#ffffff",
            "#ff99cc"
        ];

        for (let i = 0; i < 120; i++) {

            const pieza = document.createElement("div");
            const tamano = Math.random() * 8 + 5;

            pieza.style.cssText = `
                position:fixed;
                width:${tamano}px;
                height:${tamano}px;
                background:${colores[Math.floor(Math.random() * colores.length)]};
                left:${Math.random() * 100}vw;
                top:-20px;
                border-radius:2px;
                z-index:9999;
                pointer-events:none;
            `;

            document.body.appendChild(pieza);

            const animacion = pieza.animate(
                [
                    {
                        transform: "translateY(0) rotate(0deg)",
                        opacity: 1
                    },
                    {
                        transform: `translateY(105vh) rotate(${Math.random() * 720}deg)`,
                        opacity: 0
                    }
                ],
                {
                    duration: Math.random() * 2500 + 2500,
                    easing: "linear"
                }
            );

            animacion.onfinish = () => pieza.remove();
        }
    }

    // ==========================================
    // 10. CORAZONES FLOTANTES
    // ==========================================

    let intervaloCorazones = null;

    function crearCorazon() {

        const corazon = document.createElement("span");

        const corazones = ["💖", "💕", "💗", "❤️", "✨"];

        corazon.textContent =
            corazones[Math.floor(Math.random() * corazones.length)];

        corazon.className = "corazon-flotante";

        corazon.style.left = `${Math.random() * 100}vw`;
        corazon.style.fontSize = `${Math.random() * 15 + 15}px`;

        document.body.appendChild(corazon);

        const duracion = Math.random() * 3000 + 4000;

        const animacion = corazon.animate(
            [
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
            ],
            {
                duration: duracion,
                easing: "linear"
            }
        );

        animacion.onfinish = () => corazon.remove();
    }

    function iniciarCorazones() {
        detenerCorazones();
        crearCorazon();
        intervaloCorazones = setInterval(crearCorazon, 700);
    }

    function detenerCorazones() {

        if (intervaloCorazones !== null) {
            clearInterval(intervaloCorazones);
            intervaloCorazones = null;
        }

        document.querySelectorAll(".corazon-flotante")
            .forEach(corazon => corazon.remove());
    }

});
