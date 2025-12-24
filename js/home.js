/* home.js - Home Page Animations */

document.addEventListener('DOMContentLoaded', () => {
    initPanorama();
});

function initPanorama() {
    // Modify selector to match index.html class if ID is missing, or add ID in index.html
    // Let's rely on class 'panorama-images' which exists in index.html
    const container = document.querySelector('.panorama-images');
    if (!container) return;

    // Clear existing content (if any hardcoded images exist) to avoid duplication
    container.innerHTML = '';

    // We need 20 images repeated twice for the loop
    const totalImages = 20;

    // Helper to create and append images
    const addImages = () => {
        for (let i = 1; i <= totalImages; i++) {
            const img = document.createElement('img');
            // Correct path assuming images are in root images folder based on directory listing
            img.src = `images/파라노마${i}.jpg`;
            img.alt = `Panorama Image ${i}`;
            img.className = "pano-img";
            // Add error handling
            img.onerror = () => {
                img.style.display = 'none'; // Hide if fails
            };
            container.appendChild(img);
        }
    };

    // Create first set
    addImages();
    // Create duplicate set for infinite loop
    addImages();
}
