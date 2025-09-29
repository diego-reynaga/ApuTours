/**
 * CONTROLADOR AVANZADO PARA PÁGINA DE HOSPEDAJE
 * Arquitectura orientada a componentes preparada para Angular
 * Nivel Senior - Patrones de diseño, optimización y escalabilidad
 */

class HospedajePage {
    constructor() {
        this.accommodations = [];
        this.filteredAccommodations = [];
        this.currentFilters = {
            category: 'all',
            amenities: [],
            budget: 'all',
            checkin: null,
            checkout: null,
            guests: 1
        };
        this.modal = null;
        this.sortBy = 'price-asc';
        
        this.init();
    }

    /**
     * Inicialización del componente
     */
    async init() {
        try {
            this.setupEventListeners();
            await this.loadAccommodations();
            this.renderAccommodations();
            this.initializeModal();
            this.initializeAnimations();
            this.setDefaultDates();
        } catch (error) {
            console.error('Error initializing Hospedaje page:', error);
            this.showErrorMessage('Error al cargar la página de hospedaje');
        }
    }

    /**
     * Configuración de event listeners
     */
    setupEventListeners() {
        // Formulario de búsqueda
        const searchForm = document.getElementById('accommodationSearchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        // Filtros por categoría
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target.dataset.category);
            });
        });

        // Filtros por amenidades
        document.querySelectorAll('.amenity-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAmenityFilter(e.target.dataset.amenity);
            });
        });

        // Ordenamiento
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }

        // Navegación mobile
        this.setupMobileNavigation();
    }

    /**
     * Carga de datos de hospedajes
     */
    async loadAccommodations() {
        // Simular llamada a API
        await this.delay(1000);
        
        this.accommodations = [
            {
                id: 1,
                name: 'Hotel Casa Colonial',
                type: 'hotel',
                category: 'Hotel Boutique',
                description: 'Elegante hotel boutique ubicado en una casona colonial restaurada del siglo XVII, combinando historia y confort moderno.',
                rating: 4.9,
                pricePerNight: 180,
                capacity: 4,
                rooms: 12,
                amenities: ['wifi', 'parking', 'restaurant', 'spa', 'room-service'],
                features: ['Desayuno Incluido', 'Piscina', 'Bar', 'Concierge', 'Lavandería'],
                location: 'Centro Histórico',
                images: ['colonial1.jpg', 'colonial2.jpg'],
                availability: true,
                checkInTime: '15:00',
                checkOutTime: '12:00'
            },
            {
                id: 2,
                name: 'Pacucha Eco Lodge',
                type: 'lodge',
                category: 'Eco Lodge',
                description: 'Lodge ecológico con vista panorámica directa a la Laguna de Pacucha, perfecto para amantes de la naturaleza.',
                rating: 4.8,
                pricePerNight: 220,
                capacity: 6,
                rooms: 8,
                amenities: ['wifi', 'restaurant', 'spa', 'pet-friendly'],
                features: ['Vista al Lago', 'Kayaks Incluidos', 'Senderismo', 'Observación de Aves'],
                location: 'Laguna de Pacucha',
                images: ['eco1.jpg', 'eco2.jpg'],
                availability: true,
                checkInTime: '14:00',
                checkOutTime: '11:00'
            },
            {
                id: 3,
                name: 'Hostal Familiar Andino',
                type: 'hostal',
                category: 'Hostal Familiar',
                description: 'Acogedor hostal familiar que ofrece una experiencia auténtica con la calidez de la hospitalidad andina.',
                rating: 4.3,
                pricePerNight: 45,
                capacity: 3,
                rooms: 15,
                amenities: ['wifi', 'parking', 'pet-friendly'],
                features: ['Cocina Compartida', 'Área Común', 'Desayuno Típico', 'Información Turística'],
                location: 'Plaza de Armas',
                images: ['hostal1.jpg', 'hostal2.jpg'],
                availability: true,
                checkInTime: '14:00',
                checkOutTime: '11:00'
            },
            {
                id: 4,
                name: 'Casa Rural Sayhuite',
                type: 'casa-rural',
                category: 'Casa Rural',
                description: 'Auténtica casa rural cerca del complejo arqueológico de Sayhuite, ideal para turismo vivencial.',
                rating: 4.6,
                pricePerNight: 85,
                capacity: 8,
                rooms: 4,
                amenities: ['wifi', 'parking', 'pet-friendly'],
                features: ['Cocina Equipada', 'Jardín', 'Fogata', 'Actividades Rurales'],
                location: 'Sayhuite',
                images: ['rural1.jpg', 'rural2.jpg'],
                availability: true,
                checkInTime: '15:00',
                checkOutTime: '12:00'
            },
            {
                id: 5,
                name: 'Hotel Plaza Andahuaylas',
                type: 'hotel',
                category: 'Hotel Ejecutivo',
                description: 'Hotel moderno en el corazón de la ciudad, ideal para viajeros de negocios y turistas urbanos.',
                rating: 4.4,
                pricePerNight: 120,
                capacity: 3,
                rooms: 25,
                amenities: ['wifi', 'parking', 'restaurant', 'room-service'],
                features: ['Centro de Negocios', 'Gimnasio', 'Room Service 24h', 'Recepción 24h'],
                location: 'Centro Comercial',
                images: ['plaza1.jpg', 'plaza2.jpg'],
                availability: true,
                checkInTime: '15:00',
                checkOutTime: '12:00'
            },
            {
                id: 6,
                name: 'Lodge Vista Andes',
                type: 'lodge',
                category: 'Mountain Lodge',
                description: 'Lodge de montaña con vistas espectaculares de la cordillera, perfecto para aventureros y fotógrafos.',
                rating: 4.7,
                pricePerNight: 195,
                capacity: 5,
                rooms: 10,
                amenities: ['wifi', 'restaurant', 'spa'],
                features: ['Vista Panorámica', 'Telescopio', 'Guías de Trekking', 'Equipos de Montaña'],
                location: 'Montañas Circundantes',
                images: ['mountain1.jpg', 'mountain2.jpg'],
                availability: false,
                checkInTime: '14:00',
                checkOutTime: '11:00'
            },
            {
                id: 7,
                name: 'Hostal Backpackers',
                type: 'hostal',
                category: 'Hostal Económico',
                description: 'Hostal económico y moderno, perfecto para mochileros y viajeros jóvenes que buscan comodidad básica.',
                rating: 4.1,
                pricePerNight: 35,
                capacity: 2,
                rooms: 20,
                amenities: ['wifi', 'parking'],
                features: ['Dormitorios Compartidos', 'Lockers', 'Cocina Común', 'Área de Juegos'],
                location: 'Cerca Terminal',
                images: ['backpack1.jpg', 'backpack2.jpg'],
                availability: true,
                checkInTime: '14:00',
                checkOutTime: '10:00'
            },
            {
                id: 8,
                name: 'Casa Rural Chincheros',
                type: 'casa-rural',
                category: 'Casa Tradicional',
                description: 'Casa rural tradicional en Chincheros, ofrece experiencias auténticas de vida campesina andina.',
                rating: 4.5,
                pricePerNight: 75,
                capacity: 6,
                rooms: 3,
                amenities: ['wifi', 'pet-friendly'],
                features: ['Huerto Orgánico', 'Animales de Granja', 'Clases de Cocina', 'Textilería'],
                location: 'Chincheros',
                images: ['chincheros1.jpg', 'chincheros2.jpg'],
                availability: true,
                checkInTime: '16:00',
                checkOutTime: '10:00'
            }
        ];

        this.filteredAccommodations = [...this.accommodations];
    }

    /**
     * Renderizado de hospedajes
     */
    renderAccommodations() {
        const container = document.getElementById('accommodationsContainer');
        if (!container) return;

        if (this.filteredAccommodations.length === 0) {
            container.innerHTML = this.getNoResultsHTML();
            return;
        }

        // Aplicar ordenamiento
        this.sortAccommodations();

        container.innerHTML = this.filteredAccommodations
            .map(accommodation => this.getAccommodationCardHTML(accommodation))
            .join('');

        // Agregar event listeners a las tarjetas
        this.attachCardEventListeners();
    }

    /**
     * HTML para tarjeta de hospedaje
     */
    getAccommodationCardHTML(accommodation) {
        const typeIcon = this.getTypeIcon(accommodation.type);
        const availabilityClass = accommodation.availability ? 'available' : 'unavailable';
        const stars = this.getStarsHTML(accommodation.rating);
        
        return `
            <div class="accommodation-card ${availabilityClass}" data-id="${accommodation.id}">
                <div class="accommodation-image">
                    <div class="image-placeholder">
                        <i class="${typeIcon}"></i>
                    </div>
                    <div class="accommodation-badge">${accommodation.category}</div>
                    <div class="accommodation-rating">
                        <i class="fas fa-star"></i> ${accommodation.rating}
                    </div>
                    ${!accommodation.availability ? '<div class="unavailable-overlay">No Disponible</div>' : ''}
                </div>
                <div class="accommodation-content">
                    <div class="accommodation-header">
                        <h3 class="accommodation-name">${accommodation.name}</h3>
                        <div class="accommodation-type">${accommodation.category}</div>
                    </div>
                    <p class="accommodation-description">${accommodation.description}</p>
                    <div class="accommodation-amenities">
                        ${accommodation.amenities.slice(0, 4).map(amenity => 
                            `<span class="amenity-tag">
                                <i class="${this.getAmenityIcon(amenity)}"></i>
                                ${this.getAmenityName(amenity)}
                            </span>`
                        ).join('')}
                        ${accommodation.amenities.length > 4 ? `<span class="amenity-tag">+${accommodation.amenities.length - 4} más</span>` : ''}
                    </div>
                    <div class="accommodation-footer">
                        <div class="accommodation-price">
                            <span class="price-from">Desde</span>
                            <span class="price-amount">S/. ${accommodation.pricePerNight}</span>
                        </div>
                        <button class="accommodation-btn" data-action="view">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Obtener icono por tipo de hospedaje
     */
    getTypeIcon(type) {
        const icons = {
            'hotel': 'fas fa-hotel',
            'hostal': 'fas fa-bed',
            'casa-rural': 'fas fa-home',
            'lodge': 'fas fa-tree'
        };
        return icons[type] || 'fas fa-bed';
    }

    /**
     * Obtener icono por amenidad
     */
    getAmenityIcon(amenity) {
        const icons = {
            'wifi': 'fas fa-wifi',
            'parking': 'fas fa-parking',
            'restaurant': 'fas fa-utensils',
            'spa': 'fas fa-spa',
            'pet-friendly': 'fas fa-dog',
            'room-service': 'fas fa-bell'
        };
        return icons[amenity] || 'fas fa-check';
    }

    /**
     * Obtener nombre de amenidad
     */
    getAmenityName(amenity) {
        const names = {
            'wifi': 'WiFi',
            'parking': 'Parking',
            'restaurant': 'Restaurante',
            'spa': 'Spa',
            'pet-friendly': 'Pet Friendly',
            'room-service': 'Room Service'
        };
        return names[amenity] || amenity;
    }

    /**
     * Generar HTML de estrellas
     */
    getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let html = '';
        
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            html += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < remainingStars; i++) {
            html += '<i class="far fa-star"></i>';
        }
        
        return html;
    }

    /**
     * Manejo de búsqueda
     */
    handleSearch() {
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const guests = parseInt(document.getElementById('guests').value);
        const budget = document.getElementById('budget').value;

        // Validaciones
        if (!checkin || !checkout) {
            this.showNotification('Por favor selecciona las fechas de check-in y check-out', 'error');
            return;
        }

        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        
        if (checkinDate >= checkoutDate) {
            this.showNotification('La fecha de check-out debe ser posterior al check-in', 'error');
            return;
        }

        // Actualizar filtros
        this.currentFilters.checkin = checkinDate;
        this.currentFilters.checkout = checkoutDate;
        this.currentFilters.guests = guests;
        this.currentFilters.budget = budget;

        this.applyFilters();
        this.showNotification(`Búsqueda realizada para ${guests} huésped${guests > 1 ? 'es' : ''}`, 'success');
    }

    /**
     * Manejo de filtro de categoría
     */
    handleCategoryFilter(category) {
        // Actualizar botones activos
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        this.currentFilters.category = category;
        this.applyFilters();
    }

    /**
     * Manejo de filtro de amenidades
     */
    handleAmenityFilter(amenity) {
        const btn = document.querySelector(`[data-amenity="${amenity}"]`);
        
        if (this.currentFilters.amenities.includes(amenity)) {
            // Remover amenidad
            this.currentFilters.amenities = this.currentFilters.amenities.filter(a => a !== amenity);
            btn.classList.remove('active');
        } else {
            // Agregar amenidad
            this.currentFilters.amenities.push(amenity);
            btn.classList.add('active');
        }

        this.applyFilters();
    }

    /**
     * Manejo de ordenamiento
     */
    handleSort(sortBy) {
        this.sortBy = sortBy;
        this.renderAccommodations();
    }

    /**
     * Aplicar todos los filtros
     */
    applyFilters() {
        this.filteredAccommodations = this.accommodations.filter(accommodation => {
            // Filtro por categoría
            const categoryMatch = this.currentFilters.category === 'all' || 
                                accommodation.type === this.currentFilters.category;

            // Filtro por amenidades
            const amenitiesMatch = this.currentFilters.amenities.length === 0 ||
                                 this.currentFilters.amenities.every(amenity => 
                                     accommodation.amenities.includes(amenity)
                                 );

            // Filtro por presupuesto
            let budgetMatch = true;
            if (this.currentFilters.budget !== 'all') {
                switch (this.currentFilters.budget) {
                    case 'budget':
                        budgetMatch = accommodation.pricePerNight <= 80;
                        break;
                    case 'mid':
                        budgetMatch = accommodation.pricePerNight > 80 && accommodation.pricePerNight <= 150;
                        break;
                    case 'luxury':
                        budgetMatch = accommodation.pricePerNight > 150;
                        break;
                }
            }

            // Filtro por capacidad
            const capacityMatch = accommodation.capacity >= this.currentFilters.guests;

            // Filtro por disponibilidad (simulado)
            const availabilityMatch = accommodation.availability;

            return categoryMatch && amenitiesMatch && budgetMatch && capacityMatch && availabilityMatch;
        });

        this.renderAccommodations();
        this.updateResultsCount();
    }

    /**
     * Ordenar hospedajes
     */
    sortAccommodations() {
        switch (this.sortBy) {
            case 'price-asc':
                this.filteredAccommodations.sort((a, b) => a.pricePerNight - b.pricePerNight);
                break;
            case 'price-desc':
                this.filteredAccommodations.sort((a, b) => b.pricePerNight - a.pricePerNight);
                break;
            case 'rating':
                this.filteredAccommodations.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                this.filteredAccommodations.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    /**
     * Actualizar contador de resultados
     */
    updateResultsCount() {
        const count = this.filteredAccommodations.length;
        const total = this.accommodations.length;
        
        let counterElement = document.querySelector('.results-counter');
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.className = 'results-counter';
            const container = document.getElementById('accommodationsContainer');
            container.parentNode.insertBefore(counterElement, container);
        }
        
        counterElement.innerHTML = `
            <p style="text-align: center; color: #6c757d; margin-bottom: 2rem; font-weight: 500;">
                <i class="fas fa-search"></i> Mostrando ${count} de ${total} hospedajes disponibles
            </p>
        `;
    }

    /**
     * Agregar event listeners a las tarjetas
     */
    attachCardEventListeners() {
        document.querySelectorAll('.accommodation-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.accommodation-btn')) {
                    const accommodationId = parseInt(card.dataset.id);
                    this.showAccommodationModal(accommodationId);
                }
            });
        });

        document.querySelectorAll('.accommodation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const card = e.target.closest('.accommodation-card');
                const accommodationId = parseInt(card.dataset.id);
                this.showAccommodationModal(accommodationId);
            });
        });
    }

    /**
     * Mostrar modal con detalles del hospedaje
     */
    showAccommodationModal(accommodationId) {
        const accommodation = this.accommodations.find(a => a.id === accommodationId);
        if (!accommodation) return;

        const modal = document.getElementById('accommodationModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = this.getAccommodationModalHTML(accommodation);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Event listeners del modal
        this.setupModalEventListeners(accommodation);
    }

    /**
     * HTML para modal de hospedaje
     */
    getAccommodationModalHTML(accommodation) {
        const nights = this.calculateNights();
        const totalPrice = accommodation.pricePerNight * nights;
        
        return `
            <div class="modal-accommodation">
                <div class="modal-accommodation-header">
                    <div class="modal-accommodation-image">
                        <i class="${this.getTypeIcon(accommodation.type)}"></i>
                    </div>
                    <div class="modal-accommodation-info">
                        <h2>${accommodation.name}</h2>
                        <p class="modal-type">${accommodation.category}</p>
                        <div class="modal-rating">
                            ${this.getStarsHTML(accommodation.rating)}
                            <span style="margin-left: 0.5rem; font-weight: 600;">${accommodation.rating}</span>
                        </div>
                        <p>${accommodation.description}</p>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Información General</h3>
                    <div class="modal-info-grid">
                        <div class="info-item">
                            <strong>Ubicación:</strong> ${accommodation.location}
                        </div>
                        <div class="info-item">
                            <strong>Capacidad:</strong> Hasta ${accommodation.capacity} huéspedes
                        </div>
                        <div class="info-item">
                            <strong>Habitaciones:</strong> ${accommodation.rooms} disponibles
                        </div>
                        <div class="info-item">
                            <strong>Check-in:</strong> ${accommodation.checkInTime}
                        </div>
                        <div class="info-item">
                            <strong>Check-out:</strong> ${accommodation.checkOutTime}
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-list"></i> Amenidades</h3>
                    <div class="modal-amenities-grid">
                        ${accommodation.amenities.map(amenity => 
                            `<div class="modal-amenity-item">
                                <i class="${this.getAmenityIcon(amenity)}"></i>
                                <span>${this.getAmenityName(amenity)}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-star"></i> Características Especiales</h3>
                    <div class="features-list">
                        ${accommodation.features.map(feature => 
                            `<div class="feature-item">
                                <i class="fas fa-check"></i>
                                <span>${feature}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="modal-price-info">
                    <h3><i class="fas fa-calculator"></i> Resumen de Precios</h3>
                    <div class="price-breakdown">
                        <span>S/. ${accommodation.pricePerNight} x ${nights} ${nights === 1 ? 'noche' : 'noches'}</span>
                        <span>S/. ${totalPrice}</span>
                    </div>
                    <div class="price-breakdown">
                        <span>Impuestos y tasas</span>
                        <span>Incluido</span>
                    </div>
                    <hr>
                    <div class="price-breakdown" style="font-weight: 700; font-size: 1.1rem;">
                        <span>Total</span>
                        <span>S/. ${totalPrice}</span>
                    </div>
                </div>
                
                <div class="modal-action-buttons">
                    <button class="modal-action-btn primary" data-action="reserve">
                        <i class="fas fa-calendar-check"></i>
                        Reservar Ahora
                    </button>
                    <button class="modal-action-btn secondary" data-action="contact">
                        <i class="fas fa-phone"></i>
                        Contactar
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Configurar event listeners del modal
     */
    setupModalEventListeners(accommodation) {
        // Cerrar modal
        document.querySelector('.close-button').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('accommodationModal').addEventListener('click', (e) => {
            if (e.target.id === 'accommodationModal') {
                this.closeModal();
            }
        });

        // Acciones del modal
        document.querySelectorAll('.modal-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleModalAction(action, accommodation);
            });
        });
    }

    /**
     * Manejo de acciones del modal
     */
    handleModalAction(action, accommodation) {
        switch (action) {
            case 'reserve':
                this.handleReservation(accommodation);
                break;
            case 'contact':
                this.handleContact(accommodation);
                break;
        }
    }

    /**
     * Manejo de reservas
     */
    handleReservation(accommodation) {
        const params = new URLSearchParams({
            type: 'accommodation',
            accommodation: accommodation.name,
            accommodationId: accommodation.id,
            checkin: this.currentFilters.checkin ? this.currentFilters.checkin.toISOString().split('T')[0] : '',
            checkout: this.currentFilters.checkout ? this.currentFilters.checkout.toISOString().split('T')[0] : '',
            guests: this.currentFilters.guests,
            price: accommodation.pricePerNight
        });
        window.location.href = `reservas.html?${params.toString()}`;
    }

    /**
     * Manejo de contacto
     */
    handleContact(accommodation) {
        const params = new URLSearchParams({
            type: 'accommodation',
            accommodation: accommodation.name,
            subject: `Consulta sobre ${accommodation.name}`
        });
        window.location.href = `contacto.html?${params.toString()}`;
    }

    /**
     * Calcular número de noches
     */
    calculateNights() {
        if (!this.currentFilters.checkin || !this.currentFilters.checkout) {
            return 1;
        }
        
        const diffTime = Math.abs(this.currentFilters.checkout - this.currentFilters.checkin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    }

    /**
     * Establecer fechas por defecto
     */
    setDefaultDates() {
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput && checkoutInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dayAfter = new Date(tomorrow);
            dayAfter.setDate(dayAfter.getDate() + 1);
            
            checkinInput.value = tomorrow.toISOString().split('T')[0];
            checkoutInput.value = dayAfter.toISOString().split('T')[0];
            checkinInput.min = new Date().toISOString().split('T')[0];
            
            // Update filters
            this.currentFilters.checkin = tomorrow;
            this.currentFilters.checkout = dayAfter;
        }
    }

    /**
     * Cerrar modal
     */
    closeModal() {
        const modal = document.getElementById('accommodationModal');
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

        document.querySelectorAll('.accommodation-card, .featured-card, .experience-card, .policy-card').forEach(el => {
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
     * Mostrar mensaje de error
     */
    showErrorMessage(message) {
        const container = document.getElementById('accommodationsContainer');
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
                <i class="fas fa-bed"></i>
                <h3>No se encontraron hospedajes</h3>
                <p>Intenta ajustar los filtros o términos de búsqueda</p>
                <button onclick="hospedajePage.clearFilters()" class="clear-filters-btn">
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
            amenities: [],
            budget: 'all',
            checkin: null,
            checkout: null,
            guests: 1
        };

        // Reset UI
        document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        document.querySelectorAll('.amenity-filter').forEach(btn => btn.classList.remove('active'));
        document.getElementById('budget').value = 'all';
        document.getElementById('guests').value = '1';

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
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
    window.hospedajePage = new HospedajePage();
});

// Exportar para compatibilidad
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HospedajePage;
}