// ===== DESTINOS PAGE CONTROLLER =====
class DestinosPage {
    constructor() {
        this.destinations = [];
        this.filteredDestinations = [];
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.searchTerm = '';
        this.init();
    }

    async init() {
        await this.loadDestinations();
        this.initializeComponents();
        this.bindEvents();
        this.renderDestinations();
        this.initAnimations();
    }

    async loadDestinations() {
        // Datos completos de destinos
        this.destinations = [
            {
                id: 'pacucha',
                name: 'Laguna de Pacucha',
                category: ['natural', 'aventura'],
                image: 'https://www.huillcaexpedition.com/images/blog/laguna-de-pacucha-historia-turismo-y-belleza-natural-en-apurimac-1737148745.jpg',
                description: 'Espejo de agua cristalina rodeado de montañas majestuosas. Perfecta para fotografía, pesca deportiva y actividades acuáticas.',
                longDescription: 'La Laguna de Pacucha es un hermoso espejo de agua ubicado a 3,100 msnm, rodeado de montañas y paisajes espectaculares. Sus aguas cristalinas reflejan el cielo andino creando un escenario perfecto para la fotografía. Es ideal para la pesca deportiva de truchas, actividades de relajación y contemplación de la naturaleza. El entorno ofrece múltiples senderos para caminatas y zonas de camping para los más aventureros.',
                features: ['Fotografía paisajística', 'Pesca deportiva', 'Camping', 'Senderismo', 'Observación de aves'],
                duration: '4-6 horas',
                difficulty: 'Fácil',
                price: 25,
                rating: 4.9,
                distance: '15 km del centro',
                highlights: ['Fotografía', 'Deportes acuáticos', 'Senderismo'],
                coordinates: [-13.6667, -73.3833],
                elevation: '3,100 msnm',
                bestTime: 'Mayo - Septiembre',
                included: ['Transporte', 'Guía local', 'Equipos básicos']
            },
            {
                id: 'sayhuite',
                name: 'Complejo Arqueológico Sayhuite',
                category: ['arqueologico', 'cultural'],
                image: 'https://hidraulicainca.com/wp-content/uploads/2013/07/piedra-saywite-3.jpg',
                description: 'Sitio arqueológico preinca famoso por la Piedra de Sayhuite, una maqueta lítica única en el mundo que representa el cosmos andino.',
                longDescription: 'El Complejo Arqueológico de Sayhuite es uno de los sitios más enigmáticos del Perú preinca. Su principal atractivo es la famosa Piedra de Sayhuite, una roca de granito tallada con más de 200 figuras que representan el cosmos andino. Esta maqueta lítica única en el mundo muestra canales, depósitos, terrazas y figuras zoomorfas que demuestran el avanzado conocimiento hidráulico de las culturas preincas.',
                features: ['Piedra de Sayhuite', 'Maqueta cósmica', 'Historia preinca', 'Guía especializado', 'Centro de interpretación'],
                duration: '2-3 horas',
                difficulty: 'Moderado',
                price: 15,
                rating: 4.8,
                distance: '47 km del centro',
                highlights: ['Historia', 'Cultura Inca', 'Observación'],
                coordinates: [-13.5833, -73.1167],
                elevation: '3,500 msnm',
                bestTime: 'Todo el año',
                included: ['Entrada', 'Guía historiador', 'Material educativo']
            },
            {
                id: 'sondor',
                name: 'Sondor',
                category: ['arqueologico', 'natural'],
                image: 'https://www.pacuchaglamping.com/wp-content/uploads/2022/09/sondorsi-2000x1335.jpg',
                description: 'Complejo arqueológico chanka con terrazas agrícolas y vistas panorámicas espectaculares del valle de Andahuaylas.',
                longDescription: 'Sondor es un impresionante complejo arqueológico de la cultura Chanka. Ubicado estratégicamente en una colina, ofrece vistas panorámicas espectaculares del valle de Andahuaylas. Sus terrazas agrícolas perfectamente conservadas demuestran la ingeniería avanzada de esta cultura. El sitio también tiene importancia astronómica, siendo utilizado para observaciones lunares y solares.',
                features: ['Arquitectura chanka', 'Terrazas agrícolas', 'Observatorio astronómico', 'Vistas panorámicas', 'Senderos interpretativos'],
                duration: '3-4 horas',
                difficulty: 'Moderado',
                price: 20,
                rating: 4.7,
                distance: '20 km del centro',
                highlights: ['Arqueología', 'Vistas panorámicas', 'Cultura ancestral'],
                coordinates: [-13.6500, -73.4000],
                elevation: '3,200 msnm',
                bestTime: 'Abril - Octubre',
                included: ['Transporte', 'Guía arqueólogo', 'Almuerzo típico']
            },
            {
                id: 'chincheros',
                name: 'Chincheros',
                category: ['natural', 'aventura'],
                image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcT8Esj4BsXdVhTtHszBMtBqrPp_k1HvuqS51o9Qvg_idbk_V4QjD9xEtEE3Fu_9aoFi9_k2EiL_vFW8NDkfJOKcURU&s=19',
                description: 'Distrito andino con paisajes naturales impresionantes, ideal para trekking y observación de flora y fauna local.',
                longDescription: 'Chincheros es un pintoresco distrito andino que ofrece algunos de los paisajes naturales más impresionantes de Andahuaylas. Sus montañas, valles y pequeñas lagunas crean un escenario perfecto para el trekking y la aventura. La zona es rica en biodiversidad, hogar de vicuñas, alpacas y una gran variedad de aves andinas. Sus comunidades locales mantienen tradiciones ancestrales de tejido y agricultura.',
                features: ['Trekking de montaña', 'Observación de fauna', 'Comunidades locales', 'Lagunas andinas', 'Flora endémica'],
                duration: '6-8 horas',
                difficulty: 'Moderado-Difícil',
                price: 35,
                rating: 4.6,
                distance: '35 km del centro',
                highlights: ['Naturaleza', 'Observación', 'Montañismo'],
                coordinates: [-13.4167, -73.5833],
                elevation: '3,800 msnm',
                bestTime: 'Mayo - Septiembre',
                included: ['Guía especializado', 'Equipos de trekking', 'Almuerzo', 'Transporte 4x4']
            },
            {
                id: 'antabamba',
                name: 'Cañón de Antabamba',
                category: ['natural', 'aventura'],
                image: 'https://chaski.pe/public/blog/68fa5fa1bf7941.jpg',
                description: 'Impresionante cañón con formaciones rocosas únicas y aguas termales naturales.',
                longDescription: 'El Cañón de Antabamba es una formación geológica espectacular que ofrece paisajes de ensueño. Sus paredes rocosas de colores variados crean un espectáculo visual único. En el fondo del cañón fluye el río Antabamba, creando pozas naturales y pequeñas cascadas. La zona también cuenta con aguas termales medicinales conocidas por sus propiedades curativas.',
                features: ['Formaciones rocosas', 'Aguas termales', 'Cascadas naturales', 'Fotografía geológica', 'Baños medicinales'],
                duration: '5-7 horas',
                difficulty: 'Moderado',
                price: 40,
                rating: 4.8,
                distance: '55 km del centro',
                highlights: ['Geología', 'Aguas termales', 'Aventura'],
                coordinates: [-14.3667, -73.3833],
                elevation: '2,800 msnm',
                bestTime: 'Todo el año',
                included: ['Transporte', 'Guía naturalista', 'Almuerzo', 'Entrada a termas']
            },
            {
                id: 'curasco',
                name: 'Bosque de Curasco',
                category: ['natural', 'cultural'],
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3',
                description: 'Bosque nativo con especies endémicas y sitios ceremoniales ancestrales.',
                longDescription: 'El Bosque de Curasco es un ecosistema único que alberga especies de flora endémica de la región. Entre sus árboles centenarios se encuentran antiguos sitios ceremoniales utilizados por las culturas preincas. El bosque es hogar de una gran diversidad de fauna, incluyendo especies de aves endémicas y mamíferos andinos. Los senderos interpretativos permiten conocer tanto la riqueza natural como cultural del lugar.',
                features: ['Flora endémica', 'Sitios ceremoniales', 'Observación de aves', 'Senderos interpretativos', 'Medicina tradicional'],
                duration: '4-5 horas',
                difficulty: 'Fácil',
                price: 30,
                rating: 4.5,
                distance: '25 km del centro',
                highlights: ['Naturaleza', 'Historia', 'Biodiversidad'],
                coordinates: [-13.8000, -73.2500],
                elevation: '3,400 msnm',
                bestTime: 'Abril - Noviembre',
                included: ['Guía especializado', 'Material educativo', 'Refrigerios', 'Transporte']
            }
        ];

        this.filteredDestinations = [...this.destinations];
    }

    initializeComponents() {
        // Inicializar componentes específicos de la página
        this.searchInput = document.getElementById('searchInput');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.destinationsGrid = document.getElementById('destinations-grid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
    }

    bindEvents() {
        // Search functionality
        this.searchInput?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterAndRenderDestinations();
        });

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.currentFilter = e.target.dataset.filter;
                this.filterAndRenderDestinations();
            });
        });

        // View toggle
        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveView(e.target);
                this.currentView = e.target.dataset.view;
                this.updateView();
            });
        });

        // Load more functionality
        this.loadMoreBtn?.addEventListener('click', () => {
            this.loadMoreDestinations();
        });

        // Global event listeners
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="toggle-favorite"]')) {
                this.toggleFavorite(e.target.closest('[data-action="toggle-favorite"]'));
            }
            if (e.target.closest('[data-action="share-destination"]')) {
                const destinationId = e.target.closest('[data-destination]').dataset.destination;
                this.shareDestination(destinationId);
            }
        });
    }

    setActiveFilter(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    setActiveView(activeBtn) {
        this.viewButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    filterAndRenderDestinations() {
        this.filteredDestinations = this.destinations.filter(destination => {
            // Filtro por categoría
            const categoryMatch = this.currentFilter === 'all' || 
                                destination.category.includes(this.currentFilter);
            
            // Filtro por búsqueda
            const searchMatch = this.searchTerm === '' ||
                              destination.name.toLowerCase().includes(this.searchTerm) ||
                              destination.description.toLowerCase().includes(this.searchTerm) ||
                              destination.category.some(cat => cat.includes(this.searchTerm));

            return categoryMatch && searchMatch;
        });

        this.renderDestinations();
    }

    renderDestinations() {
        if (!this.destinationsGrid) return;

        // Limpiar grid
        this.destinationsGrid.innerHTML = '';

        // Renderizar destinos filtrados
        this.filteredDestinations.forEach((destination, index) => {
            const card = this.createDestinationCard(destination, index);
            this.destinationsGrid.appendChild(card);
        });

        // Mostrar mensaje si no hay resultados
        if (this.filteredDestinations.length === 0) {
            this.destinationsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                    <h3>No se encontraron destinos</h3>
                    <p>Intenta con otros términos de búsqueda o filtros</p>
                </div>
            `;
        }

        // Reinicializar animaciones
        this.initAnimations();
    }

    createDestinationCard(destination, index) {
        const card = document.createElement('div');
        card.className = 'destination-card fade-in';
        card.dataset.destination = destination.id;
        card.dataset.category = destination.category.join(' ');
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="card-image">
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
                <div class="card-overlay">
                    <div class="card-badges">
                        ${destination.category.map(cat => 
                            `<span class="badge badge-${cat}">${this.getCategoryName(cat)}</span>`
                        ).join('')}
                    </div>
                    <div class="card-actions">
                        <button class="action-btn" data-action="toggle-favorite" title="Agregar a favoritos">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="action-btn" data-action="share-destination" title="Compartir">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${destination.name}</h3>
                    <div class="card-rating">
                        ${this.generateStars(destination.rating)}
                        <span class="rating-text">(${destination.rating})</span>
                    </div>
                </div>
                <p class="card-description">${destination.description}</p>
                <div class="card-features">
                    <div class="feature">
                        <i class="fas fa-clock"></i>
                        <span>${destination.duration}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${destination.distance}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-signal"></i>
                        <span>${destination.difficulty}</span>
                    </div>
                </div>
                <div class="card-highlights">
                    ${destination.highlights.map(highlight => 
                        `<span><i class="fas fa-tag"></i> ${highlight}</span>`
                    ).join('')}
                </div>
                <div class="card-footer">
                    <div class="price-info">
                        <span class="price">S/ ${destination.price}</span>
                        <span class="price-label">por persona</span>
                    </div>
                    <div class="card-buttons">
                        <button class="btn btn-outline btn-sm" onclick="destinosPage.openDestinationModal('${destination.id}')">
                            <i class="fas fa-info"></i> Detalles
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="destinosPage.bookTour('${destination.id}')">
                            <i class="fas fa-calendar-plus"></i> Reservar
                        </button>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    updateView() {
        if (this.currentView === 'list') {
            this.destinationsGrid.classList.add('list-view');
        } else {
            this.destinationsGrid.classList.remove('list-view');
        }
    }

    getCategoryName(category) {
        const names = {
            'natural': 'Natural',
            'arqueologico': 'Arqueológico',
            'aventura': 'Aventura',
            'cultural': 'Cultural'
        };
        return names[category] || category;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHtml = '<div class="stars">';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        starsHtml += '</div>';
        return starsHtml;
    }

    openDestinationModal(destinationId) {
        const destination = this.destinations.find(d => d.id === destinationId);
        if (!destination) return;

        const modal = document.getElementById('destinationModal');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${destination.image}" alt="${destination.name}" class="modal-image">
                <div class="modal-title-section">
                    <h2>${destination.name}</h2>
                    <div class="modal-rating">
                        ${this.generateStars(destination.rating)}
                        <span class="rating-text">(${destination.rating}) • ${destination.category.map(c => this.getCategoryName(c)).join(', ')}</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-content-section">
                <div class="modal-description">
                    <h3><i class="fas fa-info-circle"></i> Descripción</h3>
                    <p>${destination.longDescription}</p>
                </div>
                
                <div class="modal-info-grid">
                    <div class="info-card">
                        <h4><i class="fas fa-clock"></i> Duración</h4>
                        <p>${destination.duration}</p>
                    </div>
                    <div class="info-card">
                        <h4><i class="fas fa-map-marker-alt"></i> Distancia</h4>
                        <p>${destination.distance}</p>
                    </div>
                    <div class="info-card">
                        <h4><i class="fas fa-signal"></i> Dificultad</h4>
                        <p>${destination.difficulty}</p>
                    </div>
                    <div class="info-card">
                        <h4><i class="fas fa-mountain"></i> Altitud</h4>
                        <p>${destination.elevation || 'Variable'}</p>
                    </div>
                    <div class="info-card">
                        <h4><i class="fas fa-calendar"></i> Mejor época</h4>
                        <p>${destination.bestTime || 'Todo el año'}</p>
                    </div>
                    <div class="info-card">
                        <h4><i class="fas fa-dollar-sign"></i> Precio</h4>
                        <p>S/ ${destination.price} por persona</p>
                    </div>
                </div>
                
                <div class="modal-features">
                    <h3><i class="fas fa-list"></i> Características principales</h3>
                    <ul class="features-list">
                        ${destination.features.map(feature => 
                            `<li><i class="fas fa-check"></i> ${feature}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <div class="modal-included">
                    <h3><i class="fas fa-check-circle"></i> Incluye</h3>
                    <ul class="included-list">
                        ${destination.included.map(item => 
                            `<li><i class="fas fa-plus"></i> ${item}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <div class="modal-highlights">
                    <h3><i class="fas fa-star"></i> Actividades destacadas</h3>
                    <div class="highlights-grid">
                        ${destination.highlights.map(highlight => 
                            `<div class="highlight-item">
                                <i class="fas fa-arrow-right"></i>
                                <span>${highlight}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="destinosPage.shareDestination('${destination.id}')">
                    <i class="fas fa-share-alt"></i> Compartir
                </button>
                <button class="btn btn-secondary" onclick="destinosPage.addToWishlist('${destination.id}')">
                    <i class="fas fa-heart"></i> Favoritos
                </button>
                <button class="btn btn-primary btn-lg" onclick="destinosPage.bookTour('${destination.id}')">
                    <i class="fas fa-calendar-plus"></i> Reservar Ahora
                </button>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Bind close events
        const closeBtn = modal.querySelector('.close-button');
        closeBtn?.addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
    }

    closeModal() {
        const modal = document.getElementById('destinationModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    toggleFavorite(button) {
        const heart = button.querySelector('i');
        const isFavorite = heart.classList.contains('fas');
        
        if (isFavorite) {
            heart.classList.remove('fas');
            heart.classList.add('far');
            this.showNotification('Removido de favoritos', 'info');
        } else {
            heart.classList.remove('far');
            heart.classList.add('fas');
            heart.style.color = '#e74c3c';
            this.showNotification('Agregado a favoritos', 'success');
        }
    }

    shareDestination(destinationId) {
        const destination = this.destinations.find(d => d.id === destinationId);
        if (!destination) return;

        const shareData = {
            title: `${destination.name} - Andahuaylas Tours`,
            text: destination.description,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Enlace copiado al portapapeles', 'success');
            });
        }
    }

    addToWishlist(destinationId) {
        // Simular agregar a lista de deseos
        this.showNotification('Agregado a tu lista de deseos', 'success');
        this.closeModal();
    }

    bookTour(destinationId) {
        // Redirigir a página de reservas con destino preseleccionado
        const url = new URL('reservas.html', window.location.href);
        url.searchParams.set('destination', destinationId);
        window.location.href = url.toString();
    }

    loadMoreDestinations() {
        // Simular carga de más destinos
        this.showNotification('Cargando más destinos...', 'info');
        
        // En una implementación real, aquí se cargarían más datos del servidor
        setTimeout(() => {
            this.showNotification('No hay más destinos para mostrar', 'info');
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
}

// Funciones globales para compatibilidad
function openDestinationModal(destinationId) {
    destinosPage.openDestinationModal(destinationId);
}

function bookTour(destinationId) {
    destinosPage.bookTour(destinationId);
}

function shareDestination(destinationId) {
    destinosPage.shareDestination(destinationId);
}

function toggleFavorite(button) {
    destinosPage.toggleFavorite(button);
}

// Inicialización
let destinosPage;

document.addEventListener('DOMContentLoaded', () => {
    destinosPage = new DestinosPage();
    
    // Inicializar navegación
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer click en enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});