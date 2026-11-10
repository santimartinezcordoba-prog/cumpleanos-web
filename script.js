
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
    zonaFinal, volverCartasFinal, form, estadoFormulario,
    panelMusica, panelPersonaje, cartaAnterior, cartaSiguiente,
};

    const faltante = Object.entries(elementos)
        .find(([, elemento]) => !elemento);

    if (faltante) {
        console.error("Falta un elemento HTML:", faltante[0]);
        return;
    }
    // Los modales van directamente en body para no quedar recortados
    // por la tarjeta y poder desplazarse hasta los botones.
    document.body.appendChild(modalCarta);
    document.body.appendChild(zonaFinal);

    // ==========================================
    // 3. ESTADO DE LA PÁGINA
    // ==========================================

    let felicitacionesPrivadas = [];
    let indiceCarta = 0;
    let accesoAutorizado = false;

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
    document.body.classList.remove("modo-final", "modal-abierto");

        accesoAutorizado = false;
        felicitacionesPrivadas = [];
        indiceCarta = 0;

        codigoBrenda.value = "";
        estadoCodigo.textContent = "";

        zonaCartas.classList.add("oculto");
        zonaFinal.classList.add("oculto");
        muro.replaceChildren();

        abrirSorpresa.disabled = false;
        abrirSorpresa.classList.remove("oculto");
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

        // Ya estamos mostrando las cartas: ocultamos el botón redundante.
        abrirSorpresa.classList.add("oculto");

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
    // 7. FELICITACIÓN FINAL
    // ==========================================

    abrirSorpresaFinal.addEventListener("click", () => {
        if (!accesoAutorizado) return;

        cerrarModalCarta();
        document.body.classList.add("modo-final");
        zonaFinal.classList.remove("oculto");
        panelMusica.classList.remove("oculto");
        panelPersonaje.classList.remove("oculto");
        lanzarConfeti();
    });

    volverCartasFinal.addEventListener("click", () => {
        zonaFinal.classList.add("oculto");
        document.body.classList.remove("modo-final");
        zonaCartas.classList.remove("oculto");
        mostrarColeccionCartas();
        zonaCartas.scrollIntoView({ behavior: "smooth", block: "center" });
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
