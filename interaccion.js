const canvas = document.getElementById('skyCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Lista de mensajes y deseos predefinidos para tu hermana
const presetWishes = [
    "¡Feliz Cumpleaños! 🎉",
    "Te quiero muchísimo ❤️",
    "¡Eres la mejor hermana!",
    "Brilla hoy y siempre ✨",
    "Que todos tus sueños se cumplan 🌟",
    "Gracias por tu alegría 😊",
    "¡Un año más maravillosa! 💖",
    "Felicidades en tu día especial 🎂",
    "Iluminas nuestras vidas 🌟",
    "¡Eres increíble! 💫",
    "¡Te deseo lo mejor siempre! 🌈",
    "¡Que la felicidad te acompañe! 🌸",
    "¡Eres única y especial! 💕",
    "¡Que tengas un día mágico! 🪄",
    "¡Felicidades, hermana querida! 🎁",
    "¡Que la vida te sonría siempre! 🌞",
    "¡Eres un regalo para todos! 🎀",
    "¡Que la alegría te rodee siempre! 🌺",
    "¡Dios te bendiga en tu cumpleaños! 🙏",   
    "¡Que la vida te regale momentos felices! 🌷",
    "gracias por ser una hermana tan maravillosa 💖",
    "sigue brillando y alcanzando tus sueños 🌟",
    "¡Feliz cumpleaños, que tengas un día lleno de amor y alegría! 🎉",
    "¡Que este nuevo año de vida te traiga muchas bendiciones y momentos felices! 🌈",
    "¡Eres una persona increíble y te mereces lo mejor en tu día especial! 💕",
    "¡Que la felicidad y el éxito te acompañen siempre! 🌸",
];

// Estrellas de fondo
const stars = [];
for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        radius: Math.random() * 1.3,
        alpha: Math.random(),
        speed: Math.random() * 0.01 + 0.003
    });
}

// Luna en el cielo
const moon = {
    x: width * 0.82,
    y: height * 0.18,
    radius: 42
};

// Partículas de luz / chispas
let particles = [];

class Sparkle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = '#ffe082';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Farolas y Paleta de colores cálidos
let lanterns = [];
const lanternColors = [
    { inner: '#ffe082', outer: '#ff8f00', border: '#e65100' }, 
    { inner: '#fff59d', outer: '#fbc02d', border: '#f57f17' }, 
    { inner: '#ffcc80', outer: '#f57c00', border: '#e65100' }  
];

class Lantern {
    constructor(x, y, text = "", depth = 1) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        
        this.depth = depth || (Math.random() * 0.6 + 0.4);
        this.radiusX = (Math.random() * 6 + 22) * this.depth; 
        this.radiusY = this.radiusX * 1.35;
        this.speedY = (Math.random() * 0.3 + 0.4) * this.depth;
        this.swayAmplitude = (Math.random() * 20 + 10) * this.depth;
        this.swaySpeed = Math.random() * 0.015 + 0.008;
        this.angle = Math.random() * Math.PI * 2;
        
        // Texto asignado (empieza vacío para las que se lanzan automáticamente)
        this.text = text;

        this.alpha = 0;
        this.maxAlpha = (Math.random() * 0.2 + 0.8) * (this.depth < 0.6 ? 0.75 : 1);
        this.flicker = 0;
        this.palette = lanternColors[Math.floor(Math.random() * lanternColors.length)];
        this.ribbonPhase = Math.random() * Math.PI;
    }

    update() {
        this.y -= this.speedY;
        this.angle += this.swaySpeed;
        this.x = this.originalX + Math.sin(this.angle) * this.swayAmplitude;
        this.flicker = Math.sin(Date.now() * 0.005 + this.x) * 2;
        this.ribbonPhase += 0.1;

        if (this.alpha < this.maxAlpha) {
            this.alpha += 0.015;
        }

        if (Math.random() < 0.15 && this.depth > 0.6) {
            particles.push(new Sparkle(this.x + (Math.random() - 0.5) * this.radiusX, this.y + this.radiusY * 0.8));
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);

        // 1. Resplandor exterior (Glow ambiental)
        const outerGlow = ctx.createRadialGradient(0, 0, this.radiusX * 0.4, 0, 0, this.radiusX * (2.4 + this.flicker * 0.05));
        outerGlow.addColorStop(0, 'rgba(255, 179, 0, 0.45)');
        outerGlow.addColorStop(0.6, 'rgba(255, 111, 0, 0.15)');
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(0, 0, this.radiusX * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. Cuerpo de papel
        const bodyGradient = ctx.createRadialGradient(-this.radiusX * 0.2, -this.radiusY * 0.2, 2, 0, 0, this.radiusY);
        bodyGradient.addColorStop(0, '#ffffff'); 
        bodyGradient.addColorStop(0.35, this.palette.inner);
        bodyGradient.addColorStop(0.85, this.palette.outer);
        bodyGradient.addColorStop(1, this.palette.border);

        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.moveTo(-this.radiusX * 0.7, -this.radiusY * 0.8);
        ctx.bezierCurveTo(-this.radiusX * 1.25, -this.radiusY * 0.2, -this.radiusX * 1.25, this.radiusY * 0.6, -this.radiusX * 0.6, this.radiusY * 0.9);
        ctx.lineTo(this.radiusX * 0.6, this.radiusY * 0.9);
        ctx.bezierCurveTo(this.radiusX * 1.25, this.radiusY * 0.6, this.radiusX * 1.25, -this.radiusY * 0.2, this.radiusX * 0.7, -this.radiusY * 0.8);
        ctx.closePath();
        ctx.fill();

        // 3. Pliegues horizontales
        ctx.strokeStyle = 'rgba(62, 39, 35, 0.18)';
        ctx.lineWidth = 1;
        for (let i = -0.5; i <= 0.6; i += 0.35) {
            ctx.beginPath();
            ctx.ellipse(0, this.radiusY * i, this.radiusX * (1.05 - Math.abs(i) * 0.3), this.radiusY * 0.1, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 4. Marcos
        ctx.strokeStyle = 'rgba(78, 52, 46, 0.8)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(0, -this.radiusY * 0.8, this.radiusX * 0.7, 2.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, this.radiusY * 0.9, this.radiusX * 0.6, 2, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 5. Cintas inferiores
        ctx.strokeStyle = '#d84315';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        let swayOffset = Math.sin(this.ribbonPhase) * 4;
        ctx.moveTo(-this.radiusX * 0.2, this.radiusY * 0.9);
        ctx.quadraticCurveTo(-this.radiusX * 0.3 + swayOffset, this.radiusY * 0.9 + 10, -this.radiusX * 0.2 + swayOffset * 1.5, this.radiusY * 0.9 + 18);
        ctx.moveTo(this.radiusX * 0.2, this.radiusY * 0.9);
        ctx.quadraticCurveTo(this.radiusX * 0.3 + swayOffset, this.radiusY * 0.9 + 10, this.radiusX * 0.2 + swayOffset * 1.5, this.radiusY * 0.9 + 18);
        ctx.stroke();

        // 6. ETIQUETA / MENSAJE VISIBLE (Solo si la farola tiene texto al hacerle clic)
        if (this.text && this.text !== "" && this.depth > 0.45) {
            ctx.save();
            const fontSize = Math.floor(12 * this.depth);
            ctx.font = `600 ${fontSize}px 'Segoe UI', sans-serif`;
            
            const textWidth = ctx.measureText(this.text).width;
            const padding = 8;
            const rectY = this.radiusY * 0.9 + 22;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = 'rgba(255, 213, 79, 0.8)';
            ctx.lineWidth = 1.2;

            ctx.beginPath();
            ctx.roundRect(-textWidth / 2 - padding, rectY - fontSize / 2 - 4, textWidth + padding * 2, fontSize + 8, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#fffde7';
            ctx.shadowColor = '#ffb74d';
            ctx.shadowBlur = 8;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, 0, rectY + 1);
            ctx.restore();
        }

        ctx.restore();
    }
}

// Silueta de montañas
function drawMountains() {
    ctx.fillStyle = '#04070d';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 70);
    ctx.quadraticCurveTo(width * 0.25, height - 120, width * 0.5, height - 60);
    ctx.quadraticCurveTo(width * 0.75, height - 20, width, height - 90);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#070b14';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 40);
    ctx.quadraticCurveTo(width * 0.3, height - 80, width * 0.65, height - 30);
    ctx.quadraticCurveTo(width * 0.85, height - 10, width, height - 50);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
}

// Silueta de árboles en el primer plano inferior
function drawTrees() {
    ctx.fillStyle = '#020408';
    
    const treePositions = [
        {x: width * 0.05, w: 60, h: 90},
        {x: width * 0.12, w: 45, h: 70},
        {x: width * 0.20, w: 70, h: 110},
        {x: width * 0.35, w: 50, h: 80},
        {x: width * 0.65, w: 55, h: 85},
        {x: width * 0.78, w: 75, h: 120},
        {x: width * 0.88, w: 50, h: 95},
        {x: width * 0.95, w: 60, h: 80}
    ];

    treePositions.forEach(t => {
        ctx.beginPath();
        ctx.moveTo(t.x - t.w / 2, height);
        ctx.lineTo(t.x, height - t.h);
        ctx.lineTo(t.x + t.w / 2, height);
        ctx.closePath();
        ctx.fill();
    });

    ctx.fillRect(0, height - 25, width, 25);
}

// Farolas iniciales (sin texto)
for (let i = 0; i < 5; i++) {
    lanterns.push(new Lantern(Math.random() * width, height + Math.random() * 300, ""));
}

// Animación principal
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Luna
    ctx.save();
    const moonGlow = ctx.createRadialGradient(moon.x, moon.y, moon.radius * 0.4, moon.x, moon.y, moon.radius * 3.5);
    moonGlow.addColorStop(0, 'rgba(255, 253, 231, 0.25)');
    moonGlow.addColorStop(0.5, 'rgba(255, 253, 231, 0.08)');
    moonGlow.addColorStop(1, 'rgba(255, 253, 231, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.radius * 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fffde7';
    ctx.shadowColor = '#fff9c4';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(230, 225, 190, 0.4)';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(moon.x - 12, moon.y - 8, 8, 0, Math.PI * 2);
    ctx.arc(moon.x + 10, moon.y + 12, 10, 0, Math.PI * 2);
    ctx.arc(moon.x + 15, moon.y - 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Estrellas
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Montañas y Árboles
    drawMountains();
    drawTrees();

    // Partículas
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(index, 1);
    });

    // Farolas
    lanterns.sort((a, b) => a.depth - b.depth);
    lanterns.forEach((lantern, index) => {
        lantern.update();
        lantern.draw();

        if (lantern.y < -100) {
            lanterns.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}
animate();

// Activar música y gestionar clics interactivos
let musicStarted = false;
window.addEventListener('click', (e) => {
    // Iniciar música con el primer clic del usuario
    const music = document.getElementById('bgMusic');
    if (music && !musicStarted) {
        music.volume = 0.4;
        music.play().then(() => {
            musicStarted = true;
        }).catch(err => console.log("Audio play prevented:", err));
    }

    if (e.target.closest('.ui-container') || e.target.closest('.modal') || e.target.closest('.birthday-card')) return;

    let clickedLantern = false;
    lanterns.forEach(l => {
        const dist = Math.hypot(e.clientX - l.x, e.clientY - l.y);
        if (dist < l.radiusX * 2) {
            clickedLantern = true;
            l.speedY += 0.8;
            
            // Soltar chispas
            for (let i = 0; i < 15; i++) {
                particles.push(new Sparkle(l.x, l.y));
            }

            // Al hacer clic en una farola existente, ¡revela un mensaje!
            if (!l.text || l.text === "") {
                l.text = presetWishes[Math.floor(Math.random() * presetWishes.length)];
            }
        }
    });

    // Si haces clic en el cielo vacío, nace una farola nueva limpia (sin texto)
    if (!clickedLantern) {
        lanterns.push(new Lantern(e.clientX, e.clientY + 20, "", 1));
    }
});

// Gran Momento de Cumpleaños
const grandFinaleBtn = document.getElementById('grandFinaleBtn');
const birthdayCard = document.getElementById('birthdayCard');
const closeCardBtn = document.getElementById('closeCardBtn');

grandFinaleBtn.addEventListener('click', () => {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            lanterns.push(new Lantern(Math.random() * width, height + Math.random() * 100, "", Math.random() * 0.6 + 0.4));
        }, i * 120);
    }

    setTimeout(() => {
        birthdayCard.classList.add('active');
    }, 1500);
});

closeCardBtn.addEventListener('click', () => {
    birthdayCard.classList.remove('active');
});