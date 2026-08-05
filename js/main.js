/*
   ==========================================================================
   Premium Birthday Website JS Logic - Vadla Venkata Chary (Nanna)
   Contains: Loader, GSAP ScrollTriggers, Canvas particles, Custom Lightbox,
             3D Scrapbook Page Flip, Wishes Slider, Web Audio API Synthesizer,
             Balloons System, and Canvas Fireworks Engine.
   ==========================================================================
*/

// Start the loader progress bar simulation immediately so the user isn't stuck on 0%
initLoader();

// Refresh ScrollTrigger once all images and assets are fully loaded (prevents layout shift issues)
window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

/* 1. INITIALIZATION & LOADER */
function initLoader() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const loaderProgressLine = document.querySelector('.loader-progress-line');

    // Simulate progress bar loading beautifully
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // GSAP fade-out loading screen
            gsap.to(loader, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    loader.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    
                    // Delay slightly to allow the browser to perform layout pass before calculating ScrollTrigger coordinates
                    setTimeout(() => {
                        initAllSystems();
                        if (typeof ScrollTrigger !== 'undefined') {
                            ScrollTrigger.refresh();
                        }
                    }, 100);
                }
            });
        }
        loaderProgressLine.style.width = `${progress}%`;
    }, 150);
}

// Global scope initialization
function initAllSystems() {
    // Show music widget (invisible during loading)
    document.getElementById('music-widget').style.display = 'block';

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Ignore mobile address bar resize events to prevent jumps/flickers
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.config({ ignoreMobileResize: true });
    }

    // Initialize individual components
    initScrollProgress();
    initMouseGlow();
    initHeroParticles();
    initGSAPScrollAnimations();
    initGalleryLightbox();
    initWishesCarousel();
    initCakeInteraction();
    initBalloonsSpawner();
    initMagneticButtons();
}

/* 2. SCROLL PROGRESS INDICATOR */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/* Helper: Smooth Scroll */
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/* 3. MOUSE GLOW FOLLOWER */
function initMouseGlow() {
    const glow = document.querySelector('.mouse-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Lerp interpolation for premium smooth lagging glow
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;
        
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* 4. MAGNETIC BUTTONS EFFECT */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            // Translate the button wrapper towards cursor
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Translate inner text towards cursor slightly less for depth
            const text = btn.querySelector('span');
            if (text) {
                gsap.to(text, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
            
            const text = btn.querySelector('span');
            if (text) {
                gsap.to(text, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    });
}

/* 5. HERO PARTICLES SYSTEM */
function initHeroParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const colors = ['#D4AF37', '#F4E5B8', '#AA8B2C', '#FFFFFF'];
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 1.5 + 0.5);
            this.speedX = Math.sin(Math.random() * 6) * 0.3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity -= this.fadeSpeed;
            
            if (this.y < 0 || this.opacity <= 0) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }
    
    // Spawn particles
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        ctx.globalAlpha = 1.0;
        requestAnimationFrame(animate);
    }
    animate();
}

/* 6. GSAP SCROLL TRIGGER ANIMATIONS */
function initGSAPScrollAnimations() {
    // Hero Title Fade-in
    gsap.from('.animate-title', { opacity: 0, y: 30, duration: 1.2, delay: 0.2, ease: 'power3.out' });
    gsap.from('.animate-subtitle', { opacity: 0, y: 20, duration: 1.2, delay: 0.5, ease: 'power3.out' });
    gsap.from('.animate-buttons', { opacity: 0, y: 15, duration: 1.2, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero-image-wrapper', { opacity: 0, scale: 0.9, duration: 1.5, ease: 'power2.out' });

    // Scroll reveal Story text
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 35,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Story image parallax
    gsap.to('.parallax-img', {
        scrollTrigger: {
            trigger: '.story-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        y: '10%',
        ease: 'none'
    });

    // Memory Gallery Stagger Reveal
    gsap.from('.gallery-item', {
        scrollTrigger: {
            trigger: '#gallery',
            start: 'top 70%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Timeline milestones stagger reveal
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        const direction = index % 2 === 0 ? -50 : 50; // slide left or right
        
        gsap.from(item.querySelector('.timeline-card'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: direction,
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.from(item.querySelector('.timeline-badge'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%'
            },
            scale: 0,
            duration: 0.5,
            delay: 0.2,
            ease: 'back.out(2)'
        });
    });

    // Thank you paper note lines fade-in typewriter style
    gsap.to('.note-line', {
        scrollTrigger: {
            trigger: '#thank-you-note',
            start: 'top 65%'
        },
        opacity: 1,
        y: 0,
        stagger: 0.3,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Reasons Cards Stagger Reveal
    gsap.from('.reason-card', {
        scrollTrigger: {
            trigger: '#reasons-section',
            start: 'top 75%'
        },
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Quote Parallax
    gsap.to('.quote-parallax-bg', {
        scrollTrigger: {
            trigger: '#quote-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        y: '20%',
        ease: 'none'
    });

    // Final Celebration Credits scrolling fade
    gsap.to('.credit-huge', {
        scrollTrigger: {
            trigger: '#celebration-section',
            start: 'top 50%'
        },
        opacity: 1,
        y: 0,
        stagger: 0.4,
        duration: 1.2,
        ease: 'power3.out'
    });
}

/* 7. MEMORY GALLERY LIGHTBOX */
let currentGalleryIndex = 0;
const galleryItems = [];

function initGalleryLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    // Select all items
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, idx) => {
        // Collect URLs & captions
        galleryItems.push({
            src: item.getAttribute('data-src'),
            caption: item.getAttribute('data-caption')
        });

        item.addEventListener('click', () => {
            currentGalleryIndex = idx;
            openLightbox();
        });
    });

    function openLightbox() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Stop background scrolling
        updateLightboxContent();
        
        // GSAP animate open
        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo('.lightbox-content-wrapper', { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'power2.out' });
    }

    function updateLightboxContent() {
        const currentItem = galleryItems[currentGalleryIndex];
        
        // Animate content swap
        gsap.to(lightboxImg, {
            opacity: 0,
            scale: 0.98,
            duration: 0.15,
            onComplete: () => {
                lightboxImg.src = currentItem.src;
                lightboxCaption.textContent = currentItem.caption;
                gsap.to(lightboxImg, { opacity: 1, scale: 1, duration: 0.25 });
            }
        });
    }

    function closeLightbox() {
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scroll
            }
        });
    }

    function showNext() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }

    function showPrev() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }

    // Lightbox triggers
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Close on clicking overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === document.querySelector('.lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }
    });
}

/* 8. PHOTO ALBUM (SCRAPBOOK PAGE FLIPPING) */
function flipPage(pageNum, isForward) {
    const page = document.getElementById(`p${pageNum}`);
    const bookContainer = document.getElementById('book-container');
    
    if (isForward) {
        page.classList.add('flipped');
        if (pageNum === 1) {
            bookContainer.classList.add('book-open');
        }
        
        // Handle double-page overlap z-index rules
        if (pageNum === 1) {
            document.getElementById('p1').style.zIndex = 1;
            document.getElementById('p2').style.zIndex = 10;
        } else if (pageNum === 2) {
            document.getElementById('p2').style.zIndex = 1;
            document.getElementById('p3').style.zIndex = 10;
        }
    } else {
        page.classList.remove('flipped');
        if (pageNum === 1) {
            bookContainer.classList.remove('book-open');
        }
        
        // Restore z-indices
        if (pageNum === 1) {
            document.getElementById('p1').style.zIndex = 10;
            document.getElementById('p2').style.zIndex = 9;
        } else if (pageNum === 2) {
            document.getElementById('p2').style.zIndex = 10;
            document.getElementById('p3').style.zIndex = 8;
        } else if (pageNum === 3) {
            document.getElementById('p3').style.zIndex = 9;
            document.getElementById('p2').style.zIndex = 10;
        }
    }
}

/* 9. WISHES CAROUSEL SYSTEM */
function initWishesCarousel() {
    const track = document.getElementById('wishes-track');
    const dots = document.querySelectorAll('#carousel-dots .dot');
    const cards = document.querySelectorAll('.wish-card');
    let currentIndex = 0;
    
    function updateCarousel() {
        const amountToMove = track.offsetWidth * currentIndex;
        track.scrollTo({
            left: amountToMove,
            behavior: 'smooth'
        });
        
        // Update dots
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentIndex = idx;
            updateCarousel();
        });
    });

    // Auto scroll wishes
    let autoPlay = setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }, 6000);

    // Pause autoplay on mouse hover/touch interaction
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 6000);
    });

    track.addEventListener('touchstart', () => clearInterval(autoPlay));
    track.addEventListener('touchend', () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 6000);
    });

    // Listen to scroll events to sync dot indicators during touch swiping
    let isScrolling;
    track.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const index = Math.round(track.scrollLeft / track.offsetWidth);
            if (index !== currentIndex && index >= 0 && index < cards.length) {
                currentIndex = index;
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentIndex);
                });
            }
        }, 100);
    });

    // Handle resize calculations
    window.addEventListener('resize', updateCarousel);
}

/* 10. INTERACTIVE CAKE & CELEBRATION RUNNERS */
let candlesLit = 3;
let activeCelebration = false;

function initCakeInteraction() {
    const candles = document.querySelectorAll('.active-candle');
    const videoWrapper = document.getElementById('video-wrapper');
    const birthdayVideo = document.getElementById('birthday-video');

    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            if (candle.classList.contains('extinguished')) return;
            
            candle.classList.add('extinguished');
            candlesLit--;
            
            // Pop sound trigger for candle
            playMusicBoxNote(523.25, 'triangle', 0.25); // high ding note
            
            if (candlesLit === 0) {
                triggerBirthdayCelebration();
            }
        });
    });

    // Video playback wrapper trigger
    videoWrapper.addEventListener('click', () => {
        videoWrapper.style.display = 'none';
        birthdayVideo.style.display = 'block';
        birthdayVideo.play().catch(e => console.log("Video autoplay blocked: " + e));
    });
}

function triggerBirthdayCelebration() {
    if (activeCelebration) return;
    activeCelebration = true;

    // 1. Confetti burst
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        // confettis from left and right edges
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    // 2. Hide cake glow, display congratulations text
    const banner = document.getElementById('celebration-banner');
    banner.classList.remove('hidden');
    setTimeout(() => banner.classList.add('show'), 100);
    document.querySelector('.cake-glow-effect').style.opacity = '0';

    // 3. Play happy birthday audio synthesizer
    startBirthdayMelody();

    // 4. Start fireworks engine
    startFireworksEngine();

    // 5. Release continuous balloons
    startEndlessBalloons();
}

/* 11. WEB AUDIO API SYNTH MELODY SYSTEM (PIANO/MUSIC BOX) */
let audioCtx = null;
let melodyTimeout = null;
let currentMelodyIndex = 0;
let isMuted = false;

// Happy Birthday in F Major
// format: [frequency (Hz), beat duration]
const birthdayMelody = [
    [261.63, 0.75], // C4 (Happy)
    [261.63, 0.25], // C4
    [293.66, 1.0],  // D4 (birth-)
    [261.63, 1.0],  // C4 (-day)
    [349.23, 1.0],  // F4 (to)
    [329.63, 2.0],  // E4 (you)
    
    [261.63, 0.75], // C4 (Happy)
    [261.63, 0.25], // C4
    [293.66, 1.0],  // D4 (birth-)
    [261.63, 1.0],  // C4 (-day)
    [392.00, 1.0],  // G4 (to)
    [349.23, 2.0],  // F4 (you)
    
    [261.63, 0.75], // C4 (Happy)
    [261.63, 0.25], // C4
    [523.25, 1.0],  // C5 (birth-)
    [440.00, 1.0],  // A4 (day)
    [349.23, 1.0],  // F4 (dear)
    [329.63, 1.0],  // E4 (Nan-)
    [293.66, 1.5],  // D4 (-na)
    
    [466.16, 0.75], // Bb4 (Happy)
    [466.16, 0.25], // Bb4
    [440.00, 1.0],  // A4 (birth-)
    [349.23, 1.0],  // F4 (-day)
    [392.00, 1.0],  // G4 (to)
    [349.23, 2.0],  // F4 (you)
];

// Music Box single note player
function playMusicBoxNote(freq, type = 'sine', duration = 0.5) {
    if (isMuted) return;
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Add sub-harmonic for a warmer piano-box tone
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();

    osc.type = type; // sine/triangle sounds like a chime/bell
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq / 2, audioCtx.currentTime);

    // Envelopes: sharp attack, long ringing decay
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    subGain.gain.setValueAtTime(0, audioCtx.currentTime);
    subGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    subOsc.connect(subGain);
    
    gainNode.connect(audioCtx.destination);
    subGain.connect(audioCtx.destination);

    osc.start();
    subOsc.start();
    
    osc.stop(audioCtx.currentTime + duration);
    subOsc.stop(audioCtx.currentTime + duration);
}

// Play loop scheduler
function startBirthdayMelody() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const widget = document.getElementById('music-widget');
    widget.classList.add('playing');
    
    const tempo = 450; // ms per beat

    function scheduleNextNote() {
        if (isMuted) {
            melodyTimeout = setTimeout(scheduleNextNote, 500);
            return;
        }

        const note = birthdayMelody[currentMelodyIndex];
        const freq = note[0];
        const beats = note[1];
        
        playMusicBoxNote(freq, 'sine', beats * 1.5);
        
        currentMelodyIndex = (currentMelodyIndex + 1) % birthdayMelody.length;
        
        // Schedule next note
        melodyTimeout = setTimeout(scheduleNextNote, beats * tempo);
    }

    // Audio volume mute toggle
    const toggleBtn = document.getElementById('music-toggle');
    toggleBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            widget.classList.remove('playing');
        } else {
            widget.classList.add('playing');
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }
    });

    scheduleNextNote();
}

/* 12. FLOATING PASTEL BALLOONS */
const balloonMessages = [
    "You are my hero, Nanna! ❤️",
    "Thank you for always putting us first. ❤️",
    "Your strength inspires me every single day. ❤️",
    "Wishing you a year as wonderful as you are! ❤️",
    "To the world's most honest and loving father. ❤️",
    "Every memory with you is a treasure. ❤️",
    "We love you to the moon and back, Nanna! ❤️",
    "Your guidance is the anchor of my life. ❤️",
    "Thank you for every hug and every sacrifice. ❤️",
    "Happy Birthday to our guiding light! ❤️"
];

function initBalloonsSpawner() {
    const container = document.getElementById('balloons-container');
    const colors = ['#E3EDF7', '#E2ECE9', '#FCECE7', '#F4E5B8', '#FFF8F0'];
    
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.backgroundColor = randomColor;
        balloon.style.color = randomColor; // Used for border drip shape in CSS
        
        // Random dimensions
        const sizeMultiplier = Math.random() * 0.4 + 0.8;
        balloon.style.transform = `scale(${sizeMultiplier})`;
        
        // Random starting position
        balloon.style.left = `${Math.random() * 90}%`;
        
        // String
        const string = document.createElement('div');
        string.className = 'balloon-string';
        balloon.appendChild(string);
        
        // Balloon clicking logic
        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            popBalloon(balloon);
        });
        
        container.appendChild(balloon);
        
        // Floating motion
        const floatDuration = Math.random() * 8 + 12; // 12 - 20s
        const sideMotion = Math.random() * 40 + 20; // wiggle scale
        
        // Animate balloon rising up
        gsap.to(balloon, {
            y: -window.innerHeight - 300,
            x: `+=${sideMotion}`,
            rotation: Math.random() * 20 - 10,
            duration: floatDuration,
            ease: 'none',
            onComplete: () => {
                balloon.remove();
            }
        });
        
        // Horizontal wobble oscillation
        gsap.to(balloon, {
            x: `-=${sideMotion * 2}`,
            duration: floatDuration / 4,
            repeat: 4,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
    
    // Spawn initial sparse balloons
    for (let i = 0; i < 5; i++) {
        setTimeout(createBalloon, Math.random() * 6000);
    }
    
    // Keep spawning them slowly
    setInterval(() => {
        if (container.children.length < 8) {
            createBalloon();
        }
    }, 4000);
}

function startEndlessBalloons() {
    const container = document.getElementById('balloons-container');
    // Release a burst of balloons immediately on celebration
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const clickEv = new Event('click');
            // Trigger balloon spawn helper
            const spawnEvent = new CustomEvent('spawn-balloon');
            window.dispatchEvent(spawnEvent);
        }, i * 300);
    }
}

// Global balloon pop
function popBalloon(balloonElement) {
    balloonElement.classList.add('pop');
    
    // Play pop noise synthesizer
    playMusicBoxNote(880.00, 'triangle', 0.08);
    
    // Select random loving toast
    const toast = document.getElementById('balloon-toast');
    const toastText = document.getElementById('balloon-toast-text');
    const randomMsg = balloonMessages[Math.floor(Math.random() * balloonMessages.length)];
    
    toastText.textContent = randomMsg;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    // Confetti pop explosion at balloon position
    const rect = balloonElement.getBoundingClientRect();
    confetti({
        particleCount: 20,
        spread: 60,
        origin: { 
            x: (rect.left + rect.width / 2) / window.innerWidth, 
            y: (rect.top + rect.height / 2) / window.innerHeight 
        },
        colors: ['#D4AF37', '#E3EDF7', '#E2ECE9', '#FCECE7']
    });

    // Remove balloon from DOM after animation
    setTimeout(() => {
        balloonElement.remove();
    }, 300);

    // Dismiss toast
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Listen to customized spawn bursts
window.addEventListener('spawn-balloon', () => {
    const container = document.getElementById('balloons-container');
    const colors = ['#E3EDF7', '#E2ECE9', '#FCECE7', '#F4E5B8', '#FFF8F0'];
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = randomColor;
    balloon.style.color = randomColor;
    balloon.style.left = `${Math.random() * 90}%`;
    
    const string = document.createElement('div');
    string.className = 'balloon-string';
    balloon.appendChild(string);
    
    balloon.addEventListener('click', (e) => {
        e.stopPropagation();
        popBalloon(balloon);
    });
    
    container.appendChild(balloon);
    
    gsap.to(balloon, {
        y: -window.innerHeight - 300,
        x: `+=${Math.random() * 40 - 20}`,
        duration: Math.random() * 6 + 8,
        ease: 'none',
        onComplete: () => balloon.remove()
    });
});

/* 13. HIGH PERFORMANCE CANVAS FIREWORKS ENGINE */
function startFireworksEngine() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const rockets = [];
    
    class Rocket {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.45) + (canvas.height * 0.1);
            this.speed = Math.random() * 4 + 7;
            this.angle = -Math.PI / 2 + (Math.random() * 0.2 - 0.1);
            this.velX = Math.cos(this.angle) * this.speed;
            this.velY = Math.sin(this.angle) * this.speed;
            this.color = `hsl(${Math.random() * 360}, 100%, 75%)`;
        }
        
        update() {
            this.x += this.velX;
            this.y += this.velY;
            
            // Explode when rocket reaches target height or slows down
            if (this.y <= this.targetY) {
                this.explode();
                return false;
            }
            return true;
        }
        
        explode() {
            // Ding sound on explosion
            playMusicBoxNote(Math.random() * 200 + 400, 'triangle', 0.15);
            
            const count = Math.floor(Math.random() * 40) + 60;
            for (let i = 0; i < count; i++) {
                particles.push(new FireworkParticle(this.x, this.y, this.color));
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 4 + 1;
            this.velX = Math.cos(this.angle) * this.speed;
            this.velY = Math.sin(this.angle) * this.speed;
            this.gravity = 0.05;
            this.drag = 0.98;
            this.opacity = 1.0;
            this.fade = Math.random() * 0.015 + 0.01;
            this.size = Math.random() * 2 + 1;
        }
        
        update() {
            this.velX *= this.drag;
            this.velY *= this.drag;
            this.velY += this.gravity;
            
            this.x += this.velX;
            this.y += this.velY;
            this.opacity -= this.fade;
            
            return this.opacity > 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }
    
    // Automatically launch rockets
    function launch() {
        if (rockets.length < 4) {
            rockets.push(new Rocket());
        }
        setTimeout(launch, Math.random() * 1200 + 500);
    }
    launch();
    
    function loop() {
        ctx.fillStyle = 'rgba(255, 248, 240, 0.15)'; // Transparent fade to keep trails
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update rockets
        for (let i = rockets.length - 1; i >= 0; i--) {
            if (!rockets[i].update()) {
                rockets.splice(i, 1);
            } else {
                rockets[i].draw();
            }
        }
        
        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }
        
        ctx.globalAlpha = 1.0;
        requestAnimationFrame(loop);
    }
    loop();
}
