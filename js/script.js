// ===== MAIN APPLICATION CONTROLLER =====
class AndahuaylasApp {
    constructor() {
        this.components = {};
        this.data = {
            destinations: [],
            services: [],
            testimonials: []
        };
        this.init();
    }

    async init() {
        await this.loadData();
        this.initComponents();
        this.bindEvents();
        this.initAnimations();
    }

    async loadData() {
        // Simular carga de datos (en Angular sería un servicio)
        this.data.destinations = await this.loadDestinations();
        this.data.services = await this.loadServices();
        this.data.testimonials = await this.loadTestimonials();
    }

    async loadDestinations() {
        return [
            {
                id: 'pacucha',
                name: 'Laguna de Pacucha',
                category: ['natural', 'aventura'],
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3',
                description: 'Espejo de agua cristalina rodeado de montañas majestuosas',
                longDescription: 'La Laguna de Pacucha es un hermoso espejo de agua ubicado a 3,100 msnm, rodeado de montañas y paisajes espectaculares. Es ideal para la pesca deportiva, fotografía y actividades de relajación.',
                features: ['Fotografía paisajística', 'Pesca deportiva', 'Camping', 'Senderismo'],
                duration: '4-6 horas',
                difficulty: 'Fácil',
                price: 25,
                rating: 4.9,
                distance: '15 km del centro',
                highlights: ['Fotografía', 'Deportes acuáticos', 'Senderismo'],
                coordinates: [-13.6667, -73.3833]
            },
            {
                id: 'sayhuite',
                name: 'Complejo Arqueológico Sayhuite',
                category: ['arqueologico', 'cultural'],
                image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3',
                description: 'Sitio arqueológico preinca famoso por la Piedra de Sayhuite',
                longDescription: 'Complejo arqueológico preinca famoso por la Piedra de Sayhuite, considerada una maqueta del mundo andino tallada en una sola roca de granito.',
                features: ['Historia preinca', 'Piedra tallada única', 'Vista panorámica', 'Guía especializado'],
                duration: '2-3 horas',
                difficulty: 'Moderado',
                price: 15,
                rating: 4.8,
                distance: '47 km del centro',
                highlights: ['Historia', 'Cultura Inca', 'Observación'],
                coordinates: [-13.5833, -73.1167]
            },
            {
                id: 'sondor',
                name: 'Sondor - Templo de la Luna',
                category: ['arqueologico', 'natural'],
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3',
                description: 'Complejo arqueológico chanka con terrazas agrícolas',
                longDescription: 'Sitio arqueológico de la cultura Chanka con impresionantes terrazas agrícolas y vistas panorámicas del valle.',
                features: ['Arquitectura chanka', 'Terrazas agrícolas', 'Vistas panorámicas', 'Astronomía ancestral'],
                duration: '3-4 horas',
                difficulty: 'Moderado',
                price: 20,
                rating: 4.7,
                distance: '20 km del centro',
                highlights: ['Arqueología', 'Vistas panorámicas', 'Cultura ancestral'],
                coordinates: [-13.6500, -73.4000]
            }
        ];
    }

    async loadServices() {
        return [
            {
                id: 'transporte',
                name: 'Transporte',
                icon: 'fas fa-car',
                description: 'Movilidad segura y cómoda',
                items: ['Buses turísticos', 'Autos privados', 'Transfers aeropuerto'],
                page: 'pages/transporte.html'
            },
            {
                id: 'guias',
                name: 'Guías Expertos',
                icon: 'fas fa-user-tie',
                description: 'Conocimiento local profesional',
                items: ['Guías certificados', 'Múltiples idiomas', 'Conocimiento local'],
                page: 'pages/guias.html'
            },
            {
                id: 'gastronomia',
                name: 'Gastronomía',
                icon: 'fas fa-utensils',
                description: 'Restaurantes y bares locales',
                items: ['Comida típica', 'Restaurantes recomendados', 'Bares y entretenimiento'],
                page: 'pages/gastronomia.html'
            },
            {
                id: 'hospedaje',
                name: 'Hospedaje',
                icon: 'fas fa-bed',
                description: 'Alojamientos confortables',
                items: ['Hoteles boutique', 'Hostales económicos', 'Casas rurales'],
                page: 'pages/hospedaje.html'
            }
        ];
    }

    async loadTestimonials() {
        return [
            {
                id: 1,
                name: 'María González',
                location: 'Lima, Perú',
                rating: 5,
                comment: 'Una experiencia increíble. Los paisajes de Andahuaylas son únicos.',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=150'
            },
            {
                id: 2,
                name: 'Carlos Mendoza',
                location: 'Cusco, Perú',
                rating: 5,
                comment: 'El tour arqueológico superó mis expectativas. Guías muy profesionales.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150'
            }
        ];
    }

    initComponents() {
        this.components.navigation = new NavigationComponent();
        this.components.hero = new HeroComponent();
        this.components.destinations = new DestinationsComponent(this.data.destinations);
        this.components.modal = new ModalComponent();
        this.components.forms = new FormsComponent();
    }

    bindEvents() {
        // Event delegation para mejor rendimiento
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleGlobalClick(e) {
        // Manejo centralizado de clicks
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        const data = target.dataset;

        switch (action) {
            case 'navigate':
                this.navigate(data.page);
                break;
            case 'open-modal':
                this.components.modal.open(data.modal, data);
                break;
            case 'scroll-to':
                this.scrollToSection(data.section);
                break;
            case 'book-tour':
                this.bookTour(data.destination);
                break;
        }
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Manejar cambios de tamaño de ventana
        this.components.destinations?.updateLayout();
    }

    initAnimations() {
        // Intersection Observer para animaciones
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    navigate(page) {
        if (page) {
            window.location.href = page;
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    bookTour(destination) {
        // Redirigir a reservas con destino preseleccionado
        const url = new URL('#reservas', window.location.href);
        if (destination) {
            url.searchParams.set('destination', destination);
        }
        window.location.href = url.toString();
    }
}

// ===== COMPONENTS =====

// Navigation Component
class NavigationComponent {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.navToggle?.addEventListener('click', () => this.toggle());
        
        // Cerrar menú al hacer click en enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    toggle() {
        this.navMenu?.classList.toggle('active');
        this.navToggle?.classList.toggle('active');
    }

    close() {
        this.navMenu?.classList.remove('active');
        this.navToggle?.classList.remove('active');
    }
}

// Hero Component
class HeroComponent {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.init();
    }

    init() {
        // Hero slider functionality si existe
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length > 1) {
            this.initSlider(slides);
        }
    }

    initSlider(slides) {
        this.slides = slides;
        setInterval(() => this.nextSlide(), 5000);
    }

    nextSlide() {
        this.slides[this.currentSlide]?.classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide]?.classList.add('active');
    }
}

// Destinations Component
class DestinationsComponent {
    constructor(destinations) {
        this.destinations = destinations;
        this.init();
    }

    init() {
        this.bindCardEvents();
    }

    bindCardEvents() {
        document.querySelectorAll('.destination-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const destination = card.dataset.destination;
                    this.openDestinationDetail(destination);
                }
            });
        });
    }

    openDestinationDetail(destinationId) {
        const destination = this.destinations.find(d => d.id === destinationId);
        if (destination) {
            app.components.modal.open('destination-detail', destination);
        }
    }

    updateLayout() {
        // Actualizar layout responsivo si es necesario
    }
}

// Modal Component
class ModalComponent {
    constructor() {
        this.modal = document.getElementById('destinationModal');
        this.modalBody = document.getElementById('modalBody');
        this.closeButton = document.querySelector('.close-button');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.closeButton?.addEventListener('click', () => this.close());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.style.display === 'block') {
                this.close();
            }
        });
    }

    open(type, data) {
        switch (type) {
            case 'destination-detail':
                this.showDestinationDetail(data);
                break;
            default:
                console.warn('Modal type not found:', type);
        }
    }

    showDestinationDetail(destination) {
        if (!this.modalBody) return;

        this.modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${destination.image}" alt="${destination.name}" class="modal-image" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
                <div class="modal-title-section">
                    <h2 class="modal-title">${destination.name}</h2>
                    <div class="modal-rating">
                        ${this.generateStars(destination.rating)}
                        <span class="rating-text">(${destination.rating})</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-content-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                <div class="modal-description">
                    <h3>Descripción</h3>
                    <p>${destination.longDescription}</p>
                </div>
                
                <div class="modal-info">
                    <h3>Información del Tour</h3>
                    <div class="info-grid">
                        <div class="info-item" style="margin: 10px 0;">
                            <i class="fas fa-clock"></i>
                            <span>Duración: ${destination.duration}</span>
                        </div>
                        <div class="info-item" style="margin: 10px 0;">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Distancia: ${destination.distance}</span>
                        </div>
                        <div class="info-item" style="margin: 10px 0;">
                            <i class="fas fa-signal"></i>
                            <span>Dificultad: ${destination.difficulty}</span>
                        </div>
                        <div class="info-item" style="margin: 10px 0;">
                            <i class="fas fa-dollar-sign"></i>
                            <span>Precio: S/ ${destination.price} por persona</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-features">
                    <h3>Características</h3>
                    <ul class="features-list">
                        ${destination.features.map(feature => `<li style="margin: 5px 0;"><i class="fas fa-check" style="color: green; margin-right: 10px;"></i>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-highlights">
                    <h3>Actividades</h3>
                    <div class="highlights-tags">
                        ${destination.highlights.map(highlight => `<span class="highlight-tag" style="display: inline-block; background: var(--primary-color); color: white; padding: 5px 10px; margin: 5px; border-radius: 15px; font-size: 0.9rem;"><i class="fas fa-tag"></i> ${highlight}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="modal-actions" style="text-align: center; margin-top: 30px;">
                <button class="btn btn-outline" onclick="app.shareDestination('${destination.id}')" style="margin: 0 10px; padding: 10px 20px; background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color); border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-share-alt"></i> Compartir
                </button>
                <button class="btn btn-primary" onclick="app.bookTour('${destination.id}')" style="margin: 0 10px; padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-calendar-plus"></i> Reservar Ahora
                </button>
            </div>
        `;
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star" style="color: gold;"></i>';
        }
        
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt" style="color: gold;"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star" style="color: gold;"></i>';
        }
        
        return `<div class="stars">${starsHtml}</div>`;
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Forms Component
class FormsComponent {
    constructor() {
        this.init();
    }

    init() {
        this.bindFormEvents();
    }

    bindFormEvents() {
        const bookingForm = document.getElementById('bookingForm');
        const contactForm = document.getElementById('contactForm');

        bookingForm?.addEventListener('submit', (e) => this.handleBookingSubmit(e));
        contactForm?.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    handleBookingSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validación básica
        if (!this.validateBookingForm(data)) return;
        
        // Simular envío (en Angular sería un servicio)
        this.showNotification('¡Gracias por tu solicitud! Te contactaremos pronto.', 'success');
        e.target.reset();
    }

    handleContactSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        if (!this.validateContactForm(data)) return;
        
        this.showNotification('¡Mensaje enviado! Te responderemos pronto.', 'success');
        e.target.reset();
    }

    validateBookingForm(data) {
        const required = ['serviceType', 'checkin', 'checkout'];
        return required.every(field => data[field] && data[field].trim() !== '');
    }

    validateContactForm(data) {
        const required = ['name', 'email', 'message'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return required.every(field => data[field] && data[field].trim() !== '') &&
               emailRegex.test(data.email);
    }

    showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#4CAF50' : '#2196F3'}; color: white; padding: 15px 20px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 10000; transform: translateX(400px); transition: transform 0.3s ease;">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== INITIALIZATION =====
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new AndahuaylasApp();
});

// Funciones globales para compatibilidad
function scrollToSection(sectionId) {
    app?.scrollToSection(sectionId);
}

function navigateToPage(page) {
    app?.navigate(page);
}

function openModal(type, data) {
    app?.components.modal.open(type, data);
}

function bookTour(destination) {
    app?.bookTour(destination);
}

function shareDestination(destinationId) {
    if (navigator.share) {
        navigator.share({
            title: 'Andahuaylas Tours',
            text: 'Descubre este increíble destino en Andahuaylas',
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            app?.components.forms.showNotification('¡Enlace copiado al portapapeles!', 'success');
        });
    }
}