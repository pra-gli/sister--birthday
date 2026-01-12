// DOM Elements
const stage1 = document.getElementById('stage-1');
const stage2 = document.getElementById('stage-2');
const stage3 = document.getElementById('stage-3');
const mainContent = document.getElementById('main-content');

// Buttons
const btnStage1 = document.getElementById('btn-stage-1');
const btnStage2Correct = document.getElementById('btn-stage-2-correct');
const btnStage2Wrong = document.getElementById('btn-stage-2-wrong');
const btnStage3 = document.getElementById('btn-stage-3');

const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const typingText = document.getElementById('typing-text');
const circularSlider = document.getElementById('circular-slider');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const blowCandleBtn = document.getElementById('blow-candle');
const candle = document.querySelector('.candle');
const cake = document.querySelector('.cake');
const roastOverlay = document.getElementById('roast-overlay');
const closeRoastBtn = document.getElementById('close-roast');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

// Navigation within Main Content
const nextBtns = document.querySelectorAll('.next-page-btn');
const prevBtns = document.querySelectorAll('.prev-page-btn');

// State
let isMusicPlaying = false;
let rotation = 0;
let autoRotateInterval;
let isFireworksRunning = false;

// Remove Duplicate Images
function removeDuplicateImages() {
    const slides = document.querySelectorAll('.slide');
    const seenSrc = new Set();
    
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            const src = img.getAttribute('src');
            if (seenSrc.has(src)) {
                slide.remove(); // Remove duplicate
            } else {
                seenSrc.add(src);
            }
        }
    });
}

// Birthday Message
const message = "To the most amazing sister in the world... Happy Birthday! 🎉 You bring so much joy and laughter into our lives. May your day be as sweet as cake and as bright as your smile. Keep shining! ✨ Love you loads! 💖";

// Helper to switch sections
function switchSection(current, next) {
    current.style.opacity = '0';
    setTimeout(() => {
        current.classList.add('hidden');
        next.classList.remove('hidden');
        // Trigger reflow
        void next.offsetWidth;
        next.style.opacity = '1';
    }, 500);
}

// Stage 1: Intro -> Stage 2
btnStage1.addEventListener('click', () => {
    switchSection(stage1, stage2);
    playMusic();
});

// Stage 2: Tricky Question -> Stage 3
btnStage2Correct.addEventListener('click', () => {
    switchSection(stage2, stage3);
});

btnStage2Wrong.addEventListener('click', () => {
    alert("Wrong answer! Try again... (Hint: It's NOT you 😜)");
});

// Stage 3: Catch Button -> Main Content
btnStage3.addEventListener('mouseover', () => {
    // 80% chance to run away
    if (Math.random() > 0.2) {
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 100);
        btnStage3.style.position = 'absolute';
        btnStage3.style.left = `${x}px`;
        btnStage3.style.top = `${y}px`;
    }
});

btnStage3.addEventListener('click', () => {
    switchSection(stage3, mainContent);
    // Show first page of main content
    const page1 = document.getElementById('page-1');
    page1.classList.remove('hidden');
    page1.style.opacity = '1';
    startTyping();
    startAutoRotate();
});

// Main Content Navigation
nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const nextId = btn.getAttribute('data-next');
        const currentSection = btn.closest('.page');
        const nextSection = document.getElementById(nextId);
        switchSection(currentSection, nextSection);
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const prevId = btn.getAttribute('data-prev');
        const currentSection = btn.closest('.page');
        const prevSection = document.getElementById(prevId);
        switchSection(currentSection, prevSection);
    });
});

// Music Control
musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.textContent = '🎵 Play Music';
    } else {
        bgMusic.play();
        musicBtn.textContent = '⏸️ Pause Music';
    }
    isMusicPlaying = !isMusicPlaying;
});

function playMusic() {
    bgMusic.volume = 1.0;
    
    // Check if already playing
    if (!bgMusic.paused) {
        isMusicPlaying = true;
        musicBtn.textContent = '⏸️ Pause Music';
        return;
    }

    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            musicBtn.textContent = '⏸️ Pause Music';
            removeUnlockListeners();
        }).catch(err => {
            console.log("Auto-play blocked. Waiting for user interaction.");
            isMusicPlaying = false;
        });
    }
}

// Unlock Audio on ANY interaction - Aggressive Mode
const interactions = ['click', 'mousemove', 'touchstart', 'keydown', 'scroll', 'mouseover', 'mousedown', 'load'];

function unlockAudio() {
    // If we haven't played yet, try to play
    if (!isMusicPlaying) {
        playMusic();
    }
}

function removeUnlockListeners() {
    interactions.forEach(event => {
        window.removeEventListener(event, unlockAudio);
    });
}

// Add listeners to window to catch everything
interactions.forEach(event => {
    window.addEventListener(event, unlockAudio, { once: true });
});

// Clean up images after they are fully loaded
window.addEventListener('load', () => {
    removeDuplicateImages(); 
});


// Typing Effect
function startTyping() {
    let i = 0;
    typingText.innerHTML = '';
    const speed = 50;

    function type() {
        if (i < message.length) {
            typingText.innerHTML += message.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Note: Removed Intersection Observer as we use manual navigation now

// Circular Slider Logic (Infinite Smooth Rotation)
let currentRotation = 0;
let targetRotation = 0;
let isDragging = false;
const rotationSpeed = 0.2; // Speed of auto-rotation

function updateSlider() {
    if (!isDragging) {
        targetRotation -= rotationSpeed;
    }
    
    circularSlider.style.transform = `rotateY(${targetRotation}deg)`;
    
    requestAnimationFrame(updateSlider);
}

prevBtn.addEventListener('click', () => {
    targetRotation += 22.5;
    // Reset auto-rotation temporarily or permanently? 
    // Let's reset the "drift" so it doesn't fight the user immediately? 
    // Actually the logic above `targetRotation -= rotationSpeed` runs every frame, 
    // so adding to targetRotation just shifts the current position.
});

nextBtn.addEventListener('click', () => {
    targetRotation -= 22.5;
});

function startAutoRotate() {
    updateSlider();
}

// 5. Cake Interaction & Surprise Mode
blowCandleBtn.addEventListener('click', () => {
    candle.classList.add('off');
    blowCandleBtn.textContent = "YAY! 🎉";
    blowCandleBtn.disabled = true;
    fireConfetti();
    alert("Make a wish! ✨");
});

cake.addEventListener('click', () => {
    // Only trigger if not already running
    if (isFireworksRunning) return;
    
    // Stop auto confetti if running
    confetti = [];
    
    // Start fireworks
    isFireworksRunning = true;
    fireFireworks();
    
    // Show roast message after 2 seconds
    setTimeout(() => {
        roastOverlay.classList.remove('hidden');
    }, 2000);
});

closeRoastBtn.addEventListener('click', () => {
    roastOverlay.classList.add('hidden');
    isFireworksRunning = false;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 6. Confetti & Fireworks Animation
let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' }
];

resizeCanvas();

window.addEventListener('resize', () => {
    resizeCanvas();
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function initConfetti() {
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            color: colors[Math.floor(randomRange(0, colors.length))],
            dimensions: {
                x: randomRange(10, 20),
                y: randomRange(10, 30)
            },
            position: {
                x: randomRange(0, canvas.width),
                y: canvas.height - 1
            },
            rotation: randomRange(0, 2 * Math.PI),
            scale: {
                x: 1,
                y: 1
            },
            velocity: {
                x: randomRange(-25, 25),
                y: randomRange(0, -50)
            },
            type: 'confetti'
        });
    }
}

// 7. Floating Hearts/Balloons on Mouse Move
let lastParticleTime = 0;
const particleInterval = 100; // ms

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastParticleTime > particleInterval) {
        createFloatingParticle(e.clientX, e.clientY);
        lastParticleTime = now;
    }
});

function createFloatingParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('floating-particle');
    
    // Random emoji
    const emojis = ['🎈', '💖', '✨', '💕'];
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Position
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 2000);
}

// Fireworks Logic
function createFirework() {
    const x = randomRange(canvas.width * 0.1, canvas.width * 0.9);
    const y = canvas.height;
    // Launch particle
    const launchParticle = {
        x: x,
        y: y,
        vx: randomRange(-2, 2),
        vy: randomRange(-15, -10),
        color: colors[Math.floor(randomRange(0, colors.length))].front,
        type: 'launch',
        alpha: 1
    };
    confetti.push(launchParticle);
}

function explodeFirework(x, y, color) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i;
        const speed = randomRange(2, 6);
        confetti.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            type: 'explosion',
            alpha: 1,
            decay: randomRange(0.01, 0.03)
        });
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Filter out dead particles
    confetti = confetti.filter(p => {
        if (p.type === 'confetti') {
            return p.position.y < canvas.height;
        } else if (p.type === 'launch') {
            return p.vy < 0; // Remove when it starts falling (apex)
        } else if (p.type === 'explosion') {
            return p.alpha > 0;
        }
        return false;
    });

    confetti.forEach((p) => {
        if (p.type === 'confetti') {
            // Existing confetti logic
            const width = p.dimensions.x * p.scale.x;
            const height = p.dimensions.y * p.scale.y;

            ctx.translate(p.position.x, p.position.y);
            ctx.rotate(p.rotation);

            p.velocity.x -= p.velocity.x * drag;
            p.velocity.y = Math.min(p.velocity.y + gravity, terminalVelocity);
            p.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

            p.position.x += p.velocity.x;
            p.position.y += p.velocity.y;

            if (p.position.x > canvas.width) p.position.x = 0;
            if (p.position.x < 0) p.position.x = canvas.width;

            p.scale.y = Math.cos(p.position.y * 0.1);
            ctx.fillStyle = p.scale.y > 0 ? p.color.front : p.color.back;

            ctx.fillRect(-width / 2, -height / 2, width, height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        } else if (p.type === 'launch') {
            // Firework Launching
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // Gravity

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Explode at apex (when velocity y becomes positive or close to 0)
            if (p.vy >= -1) {
                explodeFirework(p.x, p.y, p.color);
                p.vy = 100; // Force removal
            }

        } else if (p.type === 'explosion') {
            // Firework Explosion
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.alpha -= p.decay;

            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    });

    // Loop
    if (confetti.length > 0 || isFireworksRunning) {
        if (isFireworksRunning && Math.random() < 0.05) {
            createFirework();
        }
        window.requestAnimationFrame(render);
    }
}

function fireConfetti() {
    initConfetti();
    render();
}

function fireFireworks() {
    render(); // Start the loop if not running
}
