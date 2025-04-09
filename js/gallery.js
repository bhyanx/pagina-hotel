// Sistema de galería con lightbox
class GallerySystem {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.lightbox = this.createLightbox();
        this.currentImageIndex = 0;
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 hidden z-50';
        lightbox.innerHTML = `
            <button id="close-lightbox" class="absolute top-4 right-4 text-white text-2xl hover:text-hotel-accent transition duration-300 z-10">
                <i class="fas fa-times"></i>
            </button>
            <button id="prev-lightbox" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-hotel-accent transition duration-300 z-10">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button id="next-lightbox" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-hotel-accent transition duration-300 z-10">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <img src="" alt="" class="max-h-[90vh] max-w-full object-contain">
            </div>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    }

    initializeEventListeners() {
        // Event listeners para los elementos de la galería
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Event listeners para los controles del lightbox
        const closeButton = this.lightbox.querySelector('#close-lightbox');
        const prevButton = this.lightbox.querySelector('#prev-lightbox');
        const nextButton = this.lightbox.querySelector('#next-lightbox');

        // Asegurar que los botones fueron encontrados antes de añadir listeners
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevenir que el clic se propague
                this.closeLightbox();
            });
        }
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPreviousImage();
            });
        }
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showNextImage();
            });
        }

        // Listener para cerrar el lightbox al hacer clic en el fondo
        this.lightbox.addEventListener('click', (e) => {
            // Cerrar solo si se hace clic directamente en el fondo (no en la imagen o botones)
            if (e.target === this.lightbox) {
                 this.closeLightbox();
            }
        });

        // Event listener para cerrar/navegar con teclas
        document.addEventListener('keydown', (e) => {
            // Procesar teclas solo si el lightbox está visible
            if (this.lightbox.classList.contains('hidden')) {
                return;
            }

            if (e.key === 'Escape') {
                this.closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                this.showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                this.showNextImage();
            }
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        this.updateLightboxImage();
        this.lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }

    updateLightboxImage() {
        const currentItem = this.galleryItems[this.currentImageIndex];
        const img = currentItem.querySelector('img');
        const lightboxImg = this.lightbox.querySelector('img');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }

    showPreviousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        this.updateLightboxImage();
    }

    showNextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryItems.length;
        this.updateLightboxImage();
    }
}

// Inicializar la galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new GallerySystem();
}); 