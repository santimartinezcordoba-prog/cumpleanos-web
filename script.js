const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const surprise = document.getElementById('surprise');
let pieces = [];
let frame = null;
let width = 0;
let height = 0;
const palette = ['#ff79bb','#ffd982','#b49aff','#7de4d6','#ffffff','#ff9f80'];
function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);
}
window.addEventListener('resize', resize);
resize();
function celebrate(amount = 160) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < amount; i++) {
    pieces.push({
      x: Math.random() * width,
      y: -20 - Math.random() * height * .7,
      vx: (Math.random() - .5) * 3,
      vy: 1.5 + Math.random() * 3,
      size: 4 + Math.random() * 7,
      color: palette[Math.floor(Math.random() * palette.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * .15,
      sway: Math.random() * 7,
      life: 0
    });
  }
  if (frame === null) frame = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0,0,width,height);
  pieces = pieces.filter(p => p.y < height + 30 && p.life < 400);
  pieces.forEach(p => {
    p.life++;
    p.x += p.vx + Math.sin(p.life * .04 + p.sway) * .55;
    p.y += p.vy;
    p.angle += p.spin;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.65);
    ctx.restore();
  });
  if (pieces.length) frame = requestAnimationFrame(tick);
  else {frame = null;ctx.clearRect(0,0,width,height);}
}
document.getElementById('surpriseBtn').addEventListener('click', () => {
  surprise.hidden = false;
  celebrate(220);
  document.getElementById('surpriseBtn').textContent = '💖 ¡Sorpresa desbloqueada!';
});
document.getElementById('againBtn').addEventListener('click', () => celebrate(180));
window.addEventListener('load', () => setTimeout(() => celebrate(75), 350));

const form = document.getElementById("formFelicitacion");
const muro = document.getElementById("muroFelicitaciones");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const video = document.getElementById("video").files[0];

    if (!mensaje && !video) {
        alert("Escribe un mensaje o selecciona un vídeo.");
        return;
    }

    const felicitacion = document.createElement("div");
    felicitacion.classList.add("felicitacion");

    const titulo = document.createElement("h3");
    titulo.textContent = "💌 " + nombre;
    felicitacion.appendChild(titulo);

    if (mensaje) {
        const parrafo = document.createElement("p");
        parrafo.textContent = mensaje;
        felicitacion.appendChild(parrafo);
    }

    if (video) {
        const reproductor = document.createElement("video");
        reproductor.controls = true;
        reproductor.src = URL.createObjectURL(video);
        felicitacion.appendChild(reproductor);
    }

    muro.prepend(felicitacion);
    form.reset();
});