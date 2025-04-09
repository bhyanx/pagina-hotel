// main.js

// --- Room Details Data --- (Could be fetched from an API in a real app)
const roomDetailsData = {
    standard: {
        title: "Habitación Estándar",
        image: "img/rooms/Habitacion-Estandar.png",
        gallery: [
            "img/gallery/hotel-galeria-5.png", 
            "img/rooms/Habitacion-Estandar.png", // Placeholder - add more specific images
            "img/gallery/hotel-galeria-1.png"
        ],
        description: "Nuestra Habitación Estándar ofrece una combinación perfecta de comodidad y elegancia. Diseñada pensando en su descanso, cuenta con mobiliario funcional y una decoración acogedora. Ideal para viajeros solos o parejas que buscan una estancia confortable con todas las facilidades esenciales.",
        capacity: "Hasta 2 personas",
        beds: "1 cama Queen o 2 camas individuales (según disponibilidad)",
        size: "25m²",
        amenities: [
            "Baño privado con ducha",
            "Aire acondicionado",
            "Smart TV con cable",
            "Wi-Fi de alta velocidad gratuito",
            "Escritorio de trabajo",
            "Teléfono",
            "Secador de pelo",
            "Amenities básicos (jabón, shampoo)"
        ],
        price: "S/ 120"
    },
    deluxe: {
        title: "Suite Deluxe",
        image: "img/rooms/Suite-Deluxe.png",
        gallery: [
            "img/rooms/Suite-Deluxe.png",
             "img/gallery/hotel-galeria-1.png", // Placeholder
            "img/gallery/hotel-galeria-6.png"  // Placeholder
        ],
        description: "Experimente un nivel superior de confort en nuestra Suite Deluxe. Con un espacio generoso, esta suite incluye una sala de estar separada, ideal para relajarse o trabajar. Disfrute de vistas mejoradas y detalles de diseño que elevan su estancia. Perfecta para familias pequeñas o viajeros que desean más espacio.",
        capacity: "Hasta 4 personas",
        beds: "1 cama King + Sofá cama (o 2 camas Queen)",
        size: "45m²",
        amenities: [
            "Baño privado con bañera y ducha separada",
            "Aire acondicionado",
            "Sala de estar separada",
            "Smart TV de pantalla grande",
            "Wi-Fi de alta velocidad gratuito",
            "Minibar",
            "Cafetera",
            "Escritorio de trabajo amplio",
            "Teléfono",
            "Secador de pelo",
            "Amenities de lujo",
            "Balcón privado (en algunas unidades)"
        ],
        price: "S/ 250"
    },
    presidential: {
        title: "Villa Presidencial",
        image: "img/rooms/Suite-Presidencial.png",
        gallery: [
            "img/rooms/Suite-Presidencial.png",
            "img/gallery/hotel-galeria-2.png", // Placeholder (piscina?)
            "img/gallery/hotel-galeria-7.png"  // Placeholder (eventos?)
        ],
        description: "La máxima expresión de lujo y exclusividad. Nuestra Villa Presidencial ofrece una experiencia incomparable con amplios espacios interiores y exteriores, incluyendo una piscina privada. Disfrute de un servicio personalizado y vistas espectaculares. Ideal para familias grandes, grupos o quienes buscan la máxima privacidad y confort.",
        capacity: "Hasta 6 personas",
        beds: "2 o 3 habitaciones (Camas King/Queen)",
        size: "120m² (aprox)",
        amenities: [
            "Múltiples baños privados con jacuzzi/bañera",
            "Aire acondicionado centralizado",
            "Sala de estar y comedor amplios",
            "Cocina pequeña o kitchenette",
            "Piscina privada",
            "Terraza o jardín privado",
            "Múltiples Smart TVs",
            "Sistema de sonido",
            "Wi-Fi de alta velocidad gratuito",
            "Minibar completo",
            "Cafetera premium",
            "Servicio de mayordomo (opcional)",
            "Amenities de alta gama"
        ],
        price: "S/ 450"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // --- Page Loader --- //
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Hide loader once basic DOM is ready
        // Use setTimeout to ensure rendering before hiding
        setTimeout(() => {
            loader.classList.add('loader-hidden');
        }, 100); // Small delay
    }

    // --- Back to Top Button Functionality --- //
    const backToTopButton = document.getElementById('back-to-top-btn');

    if (backToTopButton) {
        // Show/Hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Smooth scroll to top on click
        // The href="#home" or href="#" handles the basic jump
        // For smooth scroll, we rely on CSS scroll-behavior: smooth;
        // If CSS method is not sufficient, JS smooth scroll can be added:
        /*
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        */
    }

    // --- Mobile Menu Toggle (If not already in another file) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking a link inside it
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- Dark Mode Toggle Functionality --- //
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile');
    
    // Mejorar la detección de preferencias del usuario
    const userPrefersDark = localStorage.getItem('theme') === 'dark' || 
                           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Function to apply theme (dark/light)
    const applyTheme = (isDark) => {
        const moonIconClass = 'fa-moon';
        const sunIconClass = 'fa-sun';
        const toggleIcon = darkModeToggle?.querySelector('i');
        const toggleIconMobile = darkModeToggleMobile?.querySelector('i');
        const toggleTextMobile = darkModeToggleMobile;

        // Aplicar tema al HTML y BODY
        document.documentElement.classList.toggle('dark', isDark);
        document.body.classList.toggle('dark', isDark);
        
        // Guardar preferencia
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Actualizar iconos y texto
        if (isDark) {
            if (toggleIcon) toggleIcon.classList.replace(moonIconClass, sunIconClass);
            if (toggleIconMobile) toggleIconMobile.classList.replace(moonIconClass, sunIconClass);
            if (toggleTextMobile) toggleTextMobile.innerHTML = `<i class="fas fa-sun mr-2"></i> Modo Claro`;
        } else {
            if (toggleIcon) toggleIcon.classList.replace(sunIconClass, moonIconClass);
            if (toggleIconMobile) toggleIconMobile.classList.replace(sunIconClass, moonIconClass);
            if (toggleTextMobile) toggleTextMobile.innerHTML = `<i class="fas fa-moon mr-2"></i> Modo Oscuro`;
        }

        // Disparar evento personalizado para notificar cambio de tema
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
    };

    // Aplicar tema inmediatamente al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyTheme(userPrefersDark));
    } else {
        applyTheme(userPrefersDark);
    }

    // Observar cambios en las preferencias del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });

    // Add event listeners to toggles
    const handleToggleClick = () => {
        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        applyTheme(!isCurrentlyDark);
    };

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', handleToggleClick);
    }
    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', handleToggleClick);
    }

    // --- Scroll-Triggered Animations --- //
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a small delay based on potential data-attribute or element order
                    // Example: entry.target.style.animationDelay = entry.target.dataset.delay || '0s';
                    entry.target.classList.add('is-visible'); // Trigger animation (defined in CSS)
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- Room Details Modal Functionality --- //
    const modal = document.getElementById('room-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const viewDetailsButtons = document.querySelectorAll('.view-details-button');
    const bookingRoomSelect = document.getElementById('room-type'); // Get booking form select
    const bookingFormSection = document.getElementById('booking'); // Get booking section

    const modalTitle = document.getElementById('modal-room-title');
    const modalImage = document.getElementById('modal-room-image');
    const modalGallery = document.getElementById('modal-room-gallery');
    const modalDescription = document.getElementById('modal-room-description');
    const modalCapacity = document.getElementById('modal-room-capacity');
    const modalBeds = document.getElementById('modal-room-beds');
    const modalSize = document.getElementById('modal-room-size');
    const modalAmenities = document.getElementById('modal-room-amenities');
    const modalPrice = document.getElementById('modal-room-price');
    const modalBookBtn = document.getElementById('modal-book-now-btn');

    let currentModalRoomType = null; // Variable to store the current room type

    const openModal = (roomType) => {
        const roomData = roomDetailsData[roomType];
        if (!roomData || !modal) return;
        
        currentModalRoomType = roomType; // Store the room type

        // Populate Modal Content
        modalTitle.textContent = roomData.title;
        modalImage.src = roomData.image;
        modalImage.alt = roomData.title;
        modalDescription.textContent = roomData.description;
        modalCapacity.textContent = `Capacidad: ${roomData.capacity}`;
        modalBeds.textContent = `Camas: ${roomData.beds}`;
        modalSize.textContent = `Tamaño: ${roomData.size}`;
        
        // Fix price display
        modalPrice.textContent = `Precio: ${roomData.price} por noche`; 

        // Populate Amenities
        modalAmenities.innerHTML = ''; // Clear previous amenities
        roomData.amenities.forEach(amenity => {
            const li = document.createElement('li');
            li.textContent = amenity;
            modalAmenities.appendChild(li);
        });

        // Populate Gallery (simple version)
        modalGallery.innerHTML = '';
        roomData.gallery?.slice(0, 3).forEach(imgSrc => { // Show first 3 images
             const img = document.createElement('img');
             img.src = imgSrc;
             img.alt = `${roomData.title} - vista adicional`;
             img.className = 'w-full h-20 object-cover rounded cursor-pointer hover:opacity-80';
             img.addEventListener('click', () => { modalImage.src = imgSrc; });
             modalGallery.appendChild(img);
        });
        
        // Don't change the href here, we handle the click in JS
        // modalBookBtn.href = `#booking?room=${roomType}`; 

        // Show Modal
        modal.classList.remove('hidden');
        setTimeout(() => {
             modal.classList.add('modal-visible');
             document.body.style.overflow = 'hidden';
        }, 10);
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('modal-visible');
        document.body.style.overflow = '';
        currentModalRoomType = null; // Reset room type
        setTimeout(() => {
             modal.classList.add('hidden');
        }, 300);
    };

    // Event Listeners for View Details buttons
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const roomType = button.dataset.room;
            openModal(roomType);
        });
    });

    // Event Listener for Close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Event Listener for Modal Background click
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
    // Event Listener for Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && modal.classList.contains('modal-visible')) {
            closeModal();
        }
    });

    // Event Listener for the "Reservar esta habitación" button inside the modal
    if (modalBookBtn && bookingRoomSelect && bookingFormSection) {
        modalBookBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor jump
            if (currentModalRoomType) {
                // Select the room type in the main booking form
                bookingRoomSelect.value = currentModalRoomType;
                
                // Trigger change event for compatibility with booking.js (price update)
                const changeEvent = new Event('change', { bubbles: true });
                bookingRoomSelect.dispatchEvent(changeEvent);
            }
            
            // Close the modal
            closeModal();
            
            // Scroll to the booking form smoothly
            bookingFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // --- Show Loader on Page Navigation --- //
    const internalLinks = document.querySelectorAll('a[href]');
    const currentHost = window.location.host;

    internalLinks.forEach(link => {
        // Check if it's an internal link to a different HTML file
        try {
            const linkUrl = new URL(link.href);
            if (
                linkUrl.host === currentHost && // Same domain
                linkUrl.pathname !== window.location.pathname && // Different path
                linkUrl.pathname.endsWith('.html') && // Links to an HTML file
                !linkUrl.hash // Not just an anchor link on the same page
            ) {
                link.addEventListener('click', (e) => {
                    // Check if the loader exists and is hidden
                    if (loader && loader.classList.contains('loader-hidden')) {
                         // Show loader immediately before navigation starts
                        loader.classList.remove('loader-hidden');

                        // Optional: Delay navigation slightly to ensure loader is visible
                        // e.preventDefault();
                        // const targetUrl = link.href;
                        // setTimeout(() => {
                        //    window.location.href = targetUrl;
                        // }, 50); // Very short delay
                    }
                });
            }
        } catch (error) {
            // Ignore invalid URLs (like javascript:void(0))
            // console.error("Could not parse link URL:", link.href, error);
        }
    });

    // --- Initialize other components if needed ---
    // e.g., new BookingSystem(), new GallerySystem(), new ChatSystem()
    // Check if the elements exist before initializing to avoid errors on pages
    // where they are not present.

    // Example for Booking System (run only if booking form exists)
    if (document.getElementById('booking-form')) {
        // Ensure MercadoPago script is loaded before initializing BookingSystem if it depends on it
        // Assuming mercadopago.js defines window.mp
        if (typeof MercadoPago !== 'undefined') {
             new BookingSystem();
        } else {
             console.warn('MercadoPago SDK not loaded yet.');
             // Optionally, wait or retry initialization
        }
    }

    // Example for Gallery System (run only if gallery items exist)
    if (document.querySelector('.gallery-item')) {
        new GallerySystem();
    }

    // Example for Chat System (run only if chat elements exist)
    if (document.getElementById('chat-container')) {
        new ChatSystem();
    }

    // Animación de elementos al hacer scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Verificar elementos al cargar y durante el scroll
    checkFade();
    window.addEventListener('scroll', checkFade);
    
    // Inicialización del formulario de reserva
    const bookingForm = document.querySelector('#booking form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Gracias por su interés. Su solicitud de reserva ha sido recibida.');
        });
    }
    
    // Inicialización del formulario de contacto
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameInput = document.querySelector('#name');
            const emailInput = document.querySelector('#email');
            
            if (nameInput.value && emailInput.value) {
                alert('¡Gracias por contactarnos! Le responderemos a la brevedad.');
                contactForm.reset();
            } else {
                alert('Por favor complete los campos requeridos.');
            }
        });
    }
    
    // Obtener fecha actual para configurar el selector de fechas
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    // Formato de fecha YYYY-MM-DD
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    // Configurar fechas mínimas para el formulario de reserva
    const checkInInput = document.querySelector('input[type="date"]:first-of-type');
    const checkOutInput = document.querySelector('input[type="date"]:last-of-type');
    
    if (checkInInput && checkOutInput) {
        checkInInput.min = formatDate(today);
        checkInInput.value = formatDate(today);
        checkOutInput.min = formatDate(tomorrow);
        checkOutInput.value = formatDate(tomorrow);
        
        // Actualizar fecha mínima de salida cuando cambie la fecha de entrada
        checkInInput.addEventListener('change', function() {
            const newCheckIn = new Date(this.value);
            const newCheckOut = new Date(newCheckIn);
            newCheckOut.setDate(newCheckIn.getDate() + 1);
            
            checkOutInput.min = this.value;
            if (new Date(checkOutInput.value) <= newCheckIn) {
                checkOutInput.value = formatDate(newCheckOut);
            }
        });
    }
    
    // Efecto smooth scroll para los enlaces del menú
    const navLinks = document.querySelectorAll('header a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
});

// --- WhatsApp Functionality (If needed globally) ---
function openWhatsApp() {
    // Replace with your WhatsApp number and default message if desired
    window.open('https://wa.me/TUNUMERO?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n.', '_blank');
}