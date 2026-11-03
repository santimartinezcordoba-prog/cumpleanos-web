
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
    const siguienteCarta = document.getElementById("siguienteCarta");
    const abrirSorpresaFinal = document.getElementById("abrirSorpresaFinal");

    const zonaFinal = document.getElementById("zona-final");
    const galeria = document.getElementById("galeriaVideos");

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
        muro, siguienteCarta, abrirSorpresaFinal,
        zonaFinal, galeria, form, estadoFormulario,
        panelMusica, panelPersonaje
    };

    const faltante = Object.entries(elementos)
        .find(([, elemento]) => !elemento);

    if (faltante) {
        console.error("Falta un elemento HTML:", faltante[0]);
        return;
    }

    // ==========================================
    // 3. ESTADO DE LA PÁGINA
    // ==========================================

    let felicitacionesPrivadas = [];
    let indiceCarta = 0;
    let accesoAutorizado = false;
    let videosCargados = false;

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

        siguienteCarta.classList.add("oculto");
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
    // 6. ABRIR LAS CARTAS
    // ==========================================

    abrirSorpresa.addEventListener("click", () => {

        if (!accesoAutorizado) return;

        zonaCartas.classList.remove("oculto");
        abrirSorpresa.disabled = true;
        abrirSorpresa.textContent = "💖 Tus cartas";

        indiceCarta = 0;

        mostrarCarta();

        zonaCartas.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    function mostrarCarta() {

        muro.replaceChildren();

        if (felicitacionesPrivadas.length === 0) {
            muro.textContent =
                "Todavía no hay felicitaciones. ¡Seguro que pronto llegarán! 💖";

            siguienteCarta.classList.add("oculto");
            abrirSorpresaFinal.classList.remove("oculto");
            return;
        }

        const f = felicitacionesPrivadas[indiceCarta];

        const tarjeta = document.createElement("article");
        tarjeta.className = "felicitacion";
        tarjeta.id = "cartaActual";

        const numero = document.createElement("p");
        numero.textContent =
            `✉️ Carta ${indiceCarta + 1} de ${felicitacionesPrivadas.length}`;

        const nombre = document.createElement("h3");
        nombre.textContent = `💌 ${f.nombre || "Alguien especial"}`;

        const mensaje = document.createElement("p");
        mensaje.textContent = f.mensaje || "";

        tarjeta.append(numero, nombre, mensaje);
        muro.appendChild(tarjeta);

        tarjeta.classList.add("revelar-dinamico");

        requestAnimationFrame(() => {
            tarjeta.classList.add("visible");
        });

        if (indiceCarta < felicitacionesPrivadas.length - 1) {
            siguienteCarta.classList.remove("oculto");
            abrirSorpresaFinal.classList.add("oculto");
        } else {
            siguienteCarta.classList.add("oculto");
            abrirSorpresaFinal.classList.remove("oculto");
        }
    }

    siguienteCarta.addEventListener("click", () => {
        if (!accesoAutorizado) return;

        if (indiceCarta < felicitacionesPrivadas.length - 1) {
            indiceCarta++;
            mostrarCarta();
        }
    });

    // ==========================================
    // 7. SORPRESA FINAL: VÍDEOS
    // ==========================================

    abrirSorpresaFinal.addEventListener("click", async () => {

        if (!accesoAutorizado) return;

        zonaFinal.classList.remove("oculto");
        abrirSorpresaFinal.disabled = true;
        abrirSorpresaFinal.textContent = "🎬 Preparando sorpresa...";

        lanzarConfeti();

        if (!videosCargados) {
            await cargarVideos();
            videosCargados = true;
        }

        abrirSorpresaFinal.textContent = "💖 ¡Sorpresa final!";

        zonaFinal.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // Los vídeos no se solicitan hasta abrir la sorpresa final.
    async function cargarVideos() {

        galeria.textContent = "🎬 Preparando tus vídeos...";

        try {
            const respuesta = await fetch("./videos.json", {
                cache: "no-store"
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo encontrar videos.json");
            }

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
                titulo.textContent =
                    item.titulo || "Una felicitación especial";

                const autor = document.createElement("p");
                autor.textContent =
                    `🎥 De: ${item.nombre || "Alguien especial"}`;

                const reproductor = document.createElement("video");
                reproductor.controls = true;
                reproductor.preload = "none";
                reproductor.playsInline = true;

                const source = document.createElement("source");
                source.src = item.archivo;
                source.type = "video/mp4";

                reproductor.appendChild(source);
                tarjeta.append(titulo, autor, reproductor);

                galeria.appendChild(tarjeta);
            });

            if (!galeria.children.length) {
                galeria.textContent = "No hay vídeos válidos en la galería.";
            }

        } catch (error) {
            console.error("Error al cargar vídeos:", error);
            galeria.textContent = "No se pudieron cargar los vídeos.";

            // Permite volver a intentar.
            videosCargados = false;
        }
    }

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
git 
if (error) throw error;

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
