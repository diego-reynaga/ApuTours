/**
 * CONTROLADOR AVANZADO PARA PÁGINA DE GASTRONOMÍA
 * Arquitectura orientada a componentes preparada para Angular
 * Nivel Senior - Patrones de diseño, optimización y escalabilidad
 */

class GastronomiaPage {
    constructor() {
        this.establishments = [];
        this.filteredEstablishments = [];
        this.currentFilters = {
            category: 'all',
            price: 'all',
            search: ''
        };
        this.modal = null;
        this.isLoading = false;
        
        this.init();
    }

    /**
     * Inicialización del componente
     */
    async init() {
        try {
            this.setupEventListeners();
            await this.loadEstablishments();
            this.renderEstablishments();
            this.initializeModal();
            this.initializeAnimations();
        } catch (error) {
            console.error('Error initializing Gastronomia page:', error);
            this.showErrorMessage('Error al cargar la página de gastronomía');
        }
    }

    /**
     * Configuración de event listeners
     */
    setupEventListeners() {
        // Búsqueda en tiempo real con debounce
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }

        // Filtros por categoría
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target.dataset.filter);
            });
        });

        // Filtros por precio
        document.querySelectorAll('.price-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePriceFilter(e.target.dataset.price);
            });
        });

        // Navegación mobile
        this.setupMobileNavigation();
    }

    /**
     * Carga de datos de establecimientos (simulación de API)
     */
    async loadEstablishments() {
        this.showLoading(true);
        
        // Simular llamada a API
        await this.delay(1000);
        
        this.establishments = [
            {
                id: 1,
                name: 'El Mirador Andino',
                category: 'restaurante',
                type: 'Comida Típica',
                description: 'Restaurante especializado en gastronomía andina con vista panorámica a la ciudad.',
                rating: 4.8,
                priceRange: 'moderado',
                price: '$$',
                features: ['Vista Panorámica', 'Terraza', 'Música en Vivo', 'Wi-Fi'],
                specialties: ['Pachamanca', 'Trucha a la Parrilla', 'Kapchi de Habas'],
                address: 'Jr. Ramón Castilla 123, Andahuaylas',
                phone: '+51 983 456 789',
                hours: '12:00 PM - 10:00 PM',
                image: 'mirador-andino.jpg'
            },
            {
                id: 2,
                name: 'La Casona Colonial',
                category: 'restaurante',
                type: 'Fusión Andina',
                description: 'Elegante restaurante en casona colonial con propuesta gastronómica innovadora.',
                rating: 4.9,
                priceRange: 'premium',
                price: '$$$',
                features: ['Ambiente Colonial', 'Cocina Gourmet', 'Cava de Vinos', 'Eventos Privados'],
                specialties: ['Lomo Saltado Premium', 'Quinoa Risotto', 'Pisco Sour Artesanal'],
                address: 'Plaza de Armas s/n, Andahuaylas',
                phone: '+51 983 123 456',
                hours: '6:00 PM - 11:00 PM',
                image: 'casona-colonial.jpg'
            },
            {
                id: 3,
                name: 'Chifa Express Andahuaylas',
                category: 'comida-rapida',
                type: 'Chifa',
                description: 'Fusión chino-peruana rápida y deliciosa para toda la familia.',
                rating: 4.5,
                priceRange: 'economico',
                price: '$',
                features: ['Delivery', 'Comida Rápida', 'Familiar', 'Económico'],
                specialties: ['Arroz Chaufa', 'Tallarines Saltados', 'Wantán Frito'],
                address: 'Av. Perú 456, Andahuaylas',
                phone: '+51 983 789 123',
                hours: '11:00 AM - 10:00 PM',
                image: 'chifa-express.jpg'
            },
            {
                id: 4,
                name: 'Café Cultural Pacucha',
                category: 'cafeteria',
                type: 'Café Cultural',
                description: 'Espacio cultural con el mejor café de la región y ambiente bohemio.',
                rating: 4.7,
                priceRange: 'economico',
                price: '$',
                features: ['Café Orgánico', 'Arte Local', 'Wi-Fi', 'Eventos Culturales'],
                specialties: ['Café Orgánico', 'Postres Caseros', 'Sandwiches Gourmet'],
                address: 'Jr. Grau 789, Andahuaylas',
                phone: '+51 983 321 654',
                hours: '7:00 AM - 11:00 PM',
                image: 'cafe-pacucha.jpg'
            },
            {
                id: 5,
                name: 'Bar & Lounge Sayhuite',
                category: 'bar',
                type: 'Bar Lounge',
                description: 'Moderno bar con cocteles artesanales y ambiente nocturno exclusivo.',
                rating: 4.6,
                priceRange: 'moderado',
                price: '$$',
                features: ['Cocteles Artesanales', 'Música DJ', 'Terraza Nocturna', 'Happy Hour'],
                specialties: ['Pisco Sour Variaciones', 'Cocteles Creativos', 'Tapas Gourmet'],
                address: 'Av. Los Andes 321, Andahuaylas',
                phone: '+51 983 654 987',
                hours: '6:00 PM - 2:00 AM',
                image: 'bar-sayhuite.jpg'
            },
            {
                id: 6,
                name: 'Verde Vida Vegano',
                category: 'restaurante',
                type: 'Vegetariano/Vegano',
                description: 'Restaurante vegano con ingredientes orgánicos y superalimentos andinos.',
                rating: 4.4,
                priceRange: 'moderado',
                price: '$$',
                features: ['100% Vegano', 'Orgánico', 'Superalimentos', 'Ambiente Natural'],
                specialties: ['Bowl de Quinoa', 'Hamburguesa de Quinua', 'Smoothies Detox'],
                address: 'Jr. Bolívar 147, Andahuaylas',
                phone: '+51 983 147 258',
                hours: '8:00 AM - 9:00 PM',
                image: 'verde-vida.jpg'
            },
            {
                id: 7,
                name: 'Pizzería Andes',
                category: 'comida-rapida',
                type: 'Pizzería',
                description: 'Pizzas artesanales con ingredientes locales y sabores únicos.',
                rating: 4.3,
                priceRange: 'economico',
                price: '$',
                features: ['Horno a Leña', 'Ingredientes Locales', 'Delivery', 'Familiar'],
                specialties: ['Pizza Andina', 'Pizza de Trucha', 'Calzones Especiales'],
                address: 'Av. Confraternidad 852, Andahuaylas',
                phone: '+51 983 852 741',
                hours: '5:00 PM - 11:00 PM',
                image: 'pizzeria-andes.jpg'
            },
            {
                id: 8,
                name: 'Taberna El Inca',
                category: 'bar',
                type: 'Taberna Tradicional',
                description: 'Taberna tradicional con música folclórica y ambiente auténtico.',
                rating: 4.5,
                priceRange: 'economico',
                price: '$',
                features: ['Música Folclórica', 'Ambiente Tradicional', 'Chicha de Jora', 'Shows'],
                specialties: ['Chicha de Jora', 'Cerveza Artesanal', 'Anticuchos'],
                address: 'Jr. 28 de Julio 963, Andahuaylas',
                phone: '+51 983 963 159',
                hours: '7:00 PM - 1:00 AM',
                image: 'taberna-inca.jpg'
            }
        ];

        this.filteredEstablishments = [...this.establishments];
        this.showLoading(false);
    }

    /**
     * Renderizado de establecimientos
     */
    renderEstablishments() {
        const container = document.getElementById('establishmentsContainer');
        if (!container) return;

        if (this.filteredEstablishments.length === 0) {
            container.innerHTML = this.getNoResultsHTML();
            return;
        }

        container.innerHTML = this.filteredEstablishments
            .map(establishment => this.getEstablishmentCardHTML(establishment))
            .join('');

        // Agregar event listeners a las tarjetas
        this.attachCardEventListeners();
    }

    /**
     * HTML para tarjeta de establecimiento
     */
    getEstablishmentCardHTML(establishment) {
        const categoryIcon = this.getCategoryIcon(establishment.category);
        const priceColor = this.getPriceColor(establishment.priceRange);
        
        return `
            <div class="establishment-card" data-id="${establishment.id}">
                <div class="establishment-image">
                    <div class="image-placeholder">
                        <i class="${categoryIcon}"></i>
                    </div>
                    <div class="establishment-badge">${establishment.type}</div>
                    <div class="establishment-rating">
                        <i class="fas fa-star"></i> ${establishment.rating}
                    </div>
                </div>
                <div class="establishment-content">
                    <div class="establishment-header">
                        <h3 class="establishment-title">${establishment.name}</h3>
                        <div class="establishment-category">${establishment.category}</div>
                    </div>
                    <p class="establishment-description">${establishment.description}</p>
                    <div class="establishment-features">
                        ${establishment.features.slice(0, 3).map(feature => 
                            `<span class="feature-tag">
                                <i class="fas fa-check"></i> ${feature}
                            </span>`
                        ).join('')}
                    </div>
                    <div class="establishment-info">
                        <span class="price-range" style="color: ${priceColor}">
                            ${establishment.price}
                        </span>
                        <a href="#" class="establishment-action" data-action="view">
                            Ver Detalles
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Obtener icono por categoría
     */
    getCategoryIcon(category) {
        const icons = {
            'restaurante': 'fas fa-utensils',
            'bar': 'fas fa-cocktail',
            'cafeteria': 'fas fa-coffee',
            'comida-rapida': 'fas fa-hamburger'
        };
        return icons[category] || 'fas fa-utensils';
    }

    /**
     * Obtener color por rango de precio
     */
    getPriceColor(priceRange) {
        const colors = {
            'economico': '#28a745',
            'moderado': '#ffc107',
            'premium': '#dc3545'
        };
        return colors[priceRange] || '#28a745';
    }

    /**
     * Manejo de búsqueda
     */
    handleSearch(searchTerm) {
        this.currentFilters.search = searchTerm.toLowerCase();
        this.applyFilters();
    }

    /**
     * Manejo de filtro de categoría
     */
    handleCategoryFilter(category) {
        // Actualizar botones activos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${category}"]`).classList.add('active');

        this.currentFilters.category = category;
        this.applyFilters();
    }

    /**
     * Manejo de filtro de precio
     */
    handlePriceFilter(price) {
        // Actualizar botones activos
        document.querySelectorAll('.price-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-price="${price}"]`).classList.add('active');

        this.currentFilters.price = price;
        this.applyFilters();
    }

    /**
     * Aplicar todos los filtros
     */
    applyFilters() {
        this.filteredEstablishments = this.establishments.filter(establishment => {
            // Filtro por categoría
            const categoryMatch = this.currentFilters.category === 'all' || 
                                establishment.category === this.currentFilters.category;

            // Filtro por precio
            const priceMatch = this.currentFilters.price === 'all' || 
                             establishment.priceRange === this.currentFilters.price;

            // Filtro por búsqueda
            const searchMatch = this.currentFilters.search === '' ||
                              establishment.name.toLowerCase().includes(this.currentFilters.search) ||
                              establishment.description.toLowerCase().includes(this.currentFilters.search) ||
                              establishment.type.toLowerCase().includes(this.currentFilters.search) ||
                              establishment.specialties.some(specialty => 
                                  specialty.toLowerCase().includes(this.currentFilters.search)
                              );

            return categoryMatch && priceMatch && searchMatch;
        });

        this.renderEstablishments();
        this.updateResultsCount();
    }

    /**
     * Actualizar contador de resultados
     */
    updateResultsCount() {
        const count = this.filteredEstablishments.length;
        const total = this.establishments.length;
        
        // Crear o actualizar elemento de contador si no existe
        let counterElement = document.querySelector('.results-counter');
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.className = 'results-counter';
            const container = document.getElementById('establishmentsContainer');
            container.parentNode.insertBefore(counterElement, container);
        }
        
        counterElement.innerHTML = `
            <p style="text-align: center; color: #6c757d; margin-bottom: 2rem;">
                Mostrando ${count} de ${total} establecimientos
            </p>
        `;
    }

    /**
     * Agregar event listeners a las tarjetas
     */
    attachCardEventListeners() {
        document.querySelectorAll('.establishment-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.establishment-action')) {
                    const establishmentId = parseInt(card.dataset.id);
                    this.showEstablishmentModal(establishmentId);
                }
            });
        });

        document.querySelectorAll('.establishment-action').forEach(action => {
            action.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const card = e.target.closest('.establishment-card');
                const establishmentId = parseInt(card.dataset.id);
                this.showEstablishmentModal(establishmentId);
            });
        });
    }

    /**
     * Mostrar modal con detalles del establecimiento
     */
    showEstablishmentModal(establishmentId) {
        const establishment = this.establishments.find(e => e.id === establishmentId);
        if (!establishment) return;

        const modal = document.getElementById('establishmentModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = this.getEstablishmentModalHTML(establishment);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Event listeners del modal
        this.setupModalEventListeners(establishment);
    }

    /**
     * HTML para modal de establecimiento
     */
    getEstablishmentModalHTML(establishment) {
        return `
            <div class="modal-establishment">
                <div class="modal-establishment-header">
                    <div class="modal-establishment-image">
                        <div class="image-placeholder">
                            <i class="${this.getCategoryIcon(establishment.category)}"></i>
                        </div>
                        <div class="modal-rating">
                            <i class="fas fa-star"></i> ${establishment.rating}
                        </div>
                    </div>
                    <div class="modal-establishment-info">
                        <h2>${establishment.name}</h2>
                        <p class="modal-category">${establishment.type}</p>
                        <p class="modal-description">${establishment.description}</p>
                        <div class="modal-price">
                            <span style="color: ${this.getPriceColor(establishment.priceRange)}">
                                ${establishment.price}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-establishment-body">
                    <div class="modal-section">
                        <h3><i class="fas fa-star"></i> Especialidades</h3>
                        <div class="specialties-grid">
                            ${establishment.specialties.map(specialty => 
                                `<div class="specialty-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>${specialty}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3><i class="fas fa-list"></i> Características</h3>
                        <div class="features-grid">
                            ${establishment.features.map(feature => 
                                `<div class="feature-item">
                                    <i class="fas fa-check"></i>
                                    <span>${feature}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3><i class="fas fa-info-circle"></i> Información de Contacto</h3>
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${establishment.address}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>${establishment.phone}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-clock"></i>
                                <span>${establishment.hours}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-establishment-actions">
                    <button class="modal-action-btn primary" data-action="reserve">
                        <i class="fas fa-calendar-check"></i>
                        Reservar Mesa
                    </button>
                    <button class="modal-action-btn secondary" data-action="share">
                        <i class="fas fa-share"></i>
                        Compartir
                    </button>
                    <button class="modal-action-btn secondary" data-action="directions">
                        <i class="fas fa-directions"></i>
                        Cómo Llegar
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Configurar event listeners del modal
     */
    setupModalEventListeners(establishment) {
        // Cerrar modal
        document.querySelector('.close-button').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('establishmentModal').addEventListener('click', (e) => {
            if (e.target.id === 'establishmentModal') {
                this.closeModal();
            }
        });

        // Acciones del modal
        document.querySelectorAll('.modal-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleModalAction(action, establishment);
            });
        });
    }

    /**
     * Manejo de acciones del modal
     */
    handleModalAction(action, establishment) {
        switch (action) {
            case 'reserve':
                this.handleReservation(establishment);
                break;
            case 'share':
                this.handleShare(establishment);
                break;
            case 'directions':
                this.handleDirections(establishment);
                break;
        }
    }

    /**
     * Manejo de reservas
     */
    handleReservation(establishment) {
        // Redirigir a página de reservas con datos pre-llenados
        const params = new URLSearchParams({
            type: 'restaurant',
            establishment: establishment.name,
            category: establishment.category
        });
        window.location.href = `reservas.html?${params.toString()}`;
    }

    /**
     * Compartir establecimiento
     */
    async handleShare(establishment) {
        const shareData = {
            title: establishment.name,
            text: `¡Descubre ${establishment.name} en Andahuaylas! ${establishment.description}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback para navegadores sin Web Share API
                await navigator.clipboard.writeText(
                    `${shareData.title}\n${shareData.text}\n${shareData.url}`
                );
                this.showNotification('Enlace copiado al portapapeles', 'success');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            this.showNotification('Error al compartir', 'error');
        }
    }

    /**
     * Mostrar direcciones
     */
    handleDirections(establishment) {
        const address = encodeURIComponent(establishment.address + ', Andahuaylas, Perú');
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
        window.open(mapsUrl, '_blank');
    }

    /**
     * Cerrar modal
     */
    closeModal() {
        const modal = document.getElementById('establishmentModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * Inicializar modal
     */
    initializeModal() {
        // Event listener para cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    /**
     * Inicializar animaciones
     */
    initializeAnimations() {
        // Intersection Observer para animaciones
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observar elementos animables
        document.querySelectorAll('.establishment-card, .dish-card').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Configurar navegación móvil
     */
    setupMobileNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    /**
     * Mostrar/ocultar loading
     */
    showLoading(show) {
        const container = document.getElementById('establishmentsContainer');
        if (show) {
            container.classList.add('loading');
            container.innerHTML = '<div class="loading-spinner">Cargando establecimientos...</div>';
        } else {
            container.classList.remove('loading');
        }
    }

    /**
     * Mostrar mensaje de error
     */
    showErrorMessage(message) {
        const container = document.getElementById('establishmentsContainer');
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
    }

    /**
     * HTML para cuando no hay resultados
     */
    getNoResultsHTML() {
        return `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron establecimientos</h3>
                <p>Intenta ajustar los filtros o términos de búsqueda</p>
                <button onclick="gastronomiaPage.clearFilters()" class="clear-filters-btn">
                    <i class="fas fa-times"></i> Limpiar Filtros
                </button>
            </div>
        `;
    }

    /**
     * Limpiar todos los filtros
     */
    clearFilters() {
        // Reset filters
        this.currentFilters = {
            category: 'all',
            price: 'all',
            search: ''
        };

        // Reset UI
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
        document.querySelectorAll('.price-filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-price="all"]').classList.add('active');

        // Re-render
        this.applyFilters();
    }

    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Utilidad: Debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utilidad: Delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.gastronomiaPage = new GastronomiaPage();
});

// Exportar para compatibilidad
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GastronomiaPage;
}