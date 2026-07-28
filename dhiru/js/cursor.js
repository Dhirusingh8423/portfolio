/**
 * Custom Cursor Glow Interaction
 * Implements a premium, hardware-accelerated dual cursor:
 * 1. A small precise point cursor.
 * 2. A larger ambient glow ring that trails behind using linear interpolation (lerp).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if the device supports hover effects (exclude touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return; // Exit and use standard system cursor for touch devices

    // Create cursor elements
    const dot = document.createElement('div');
    const glow = document.createElement('div');

    dot.className = 'custom-cursor-dot';
    glow.className = 'custom-cursor-glow';

    document.body.appendChild(dot);
    document.body.appendChild(glow);

    // Target positions
    let mouseX = 0;
    let mouseY = 0;

    // Current positions (for trailing effect)
    let dotX = 0;
    let dotY = 0;
    let glowX = 0;
    let glowY = 0;

    // Update target mouse positions on mousemove
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements when mouse moves
        if (dot.style.opacity === '' || dot.style.opacity === '0') {
            dot.style.opacity = '1';
            glow.style.opacity = '1';
        }
    });

    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        glow.style.opacity = '0';
    });

    // Handle cursor hovering over clickable items
    const clickables = 'a, button, input, textarea, select, .interactive-card, [role="button"], .theme-toggle';
    
    // Add hover styling listeners dynamically
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(clickables)) {
            dot.classList.add('cursor-active');
            glow.classList.add('cursor-active');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(clickables)) {
            dot.classList.remove('cursor-active');
            glow.classList.remove('cursor-active');
        }
    });

    // Handle active clicks (scale down slightly)
    document.addEventListener('mousedown', () => {
        dot.classList.add('cursor-clicked');
        glow.classList.add('cursor-clicked');
    });

    document.addEventListener('mouseup', () => {
        dot.classList.remove('cursor-clicked');
        glow.classList.remove('cursor-clicked');
    });

    // Smooth animation loop using requestAnimationFrame
    const animateCursor = () => {
        // Fast tracking for the small dot (very little delay)
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;

        // Slower tracking for the glow ring (more delay/lerp)
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        // Apply transformations using translate3d for hardware acceleration (60fps)
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
        glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;

        requestAnimationFrame(animateCursor);
    };

    // Run the animation loop
    animateCursor();
});
