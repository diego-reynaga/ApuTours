/**
 * CONTROLADOR AVANZADO PARA PÁGINA DE TRANSPORTE
 * Arquitectura orientada a componentes preparada para Angular
 * Nivel Senior - Patrones de diseño, optimización y escalabilidad
 */

class TransportePage {
    constructor() {
        this.vehicles = [];
        this.filteredVehicles = [];
        this.routes = [];
        this.currentFilter = 'all';
        this.modal = null;
        
        // Configuración de precios por tipo de servicio y distancia
        this.priceConfig = {
            'privado': { base: 80, perKm: 2.5, perHour: 25 },
            'compartido': { base: 25, perPerson: 8, perKm: 1.2 },
            'transfer': { base: 25, perKm: 2.0 },
            'premium': { base: 150, perKm: 4.0, perHour: 45 }
        };
        
        // Datos de distancias entre destinos (en km)
        this.distances = {
            'aeropuerto-plaza': 12,
            'aeropuerto-pacucha': 45,
            'aeropuerto-sayhuite': 38,
            'plaza-pacucha': 45,
            'plaza-sayhuite': 38,
            'plaza-sondor': 55,
            'plaza-chincheros': 35,
            'plaza-antabamba': 85,
            'plaza-curasco': 65
        };
        
        this.init();
    }

    /**
     * Inicialización del componente
     */
    async init() {
        try {
            this.setupEventListeners();
            await this.loadVehicles();
            this.renderVehicles();
            this.initializeModal();
            this.initializeRouteCalculator();
            this.initializeAnimations();
            this.setDefaultDate();
        } catch (error) {
            console.error('Error initializing Transport page:', error);
            this.showErrorMessage('Error al cargar la página de transporte');
        }
    }

    /**
     * Configuración de event listeners
     */
    setupEventListeners() {
        // Filtros de flota
        document.querySelectorAll('.fleet-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFleetFilter(e.target.dataset.filter);
            });
        });

        // Botones de selección de transporte
        document.querySelectorAll('.transport-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleTransportSelection(e.target.dataset.type);
            });
        });

        // Calculadora de rutas
        const calculateBtn = document.getElementById('calculateRoute');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateRoute();
            });
        }

        // Botones de rutas populares
        document.querySelectorAll('.route-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleRouteSelection(e.target.closest('.route-card'));
            });
        });

        // Navegación mobile
        this.setupMobileNavigation();
    }

    /**
     * Carga de datos de vehículos
     */
    async loadVehicles() {
        // Simular llamada a API
        await this.delay(800);
        
        this.vehicles = [
            {
                id: 1,
                name: 'Toyota Hiace',
                type: 'minivan',
                category: 'Minivan',
                capacity: 12,
                features: ['Aire Acondicionado', 'Cinturones de Seguridad', 'Radio/USB'],
                pricePerDay: 180,
                pricePerKm: 2.5,
                transmission: 'Manual',
                fuel: 'Gasolina',
                year: 2020,
                rating: 4.6,
                availability: true
            },
            {
                id: 2,
                name: 'Chevrolet N300',
                type: 'minivan',
                category: 'Minivan Económica',
                capacity: 8,
                features: ['Económico', 'Confiable', 'Ideal Grupos'],
                pricePerDay: 120,
                pricePerKm: 2.0,
                transmission: 'Manual',
                fuel: 'Gasolina',
                year: 2019,
                rating: 4.3,
                availability: true
            },
            {
                id: 3,
                name: 'Toyota Corolla',
                type: 'sedan',
                category: 'Sedán Ejecutivo',
                capacity: 4,
                features: ['Cómodo', 'Aire Acondicionado', 'Automático'],
                pricePerDay: 100,
                pricePerKm: 2.2,
                transmission: 'Automático',
                fuel: 'Gasolina',
                year: 2021,
                rating: 4.8,
                availability: true
            },
            {
                id: 4,
                name: 'Nissan X-Trail',
                type: 'suv',
                category: 'SUV Premium',
                capacity: 7,
                features: ['4x4', 'Tracción Integral', 'Lujo', 'GPS'],
                pricePerDay: 220,
                pricePerKm: 3.5,
                transmission: 'Automático',
                fuel: 'Gasolina',
                year: 2022,
                rating: 4.9,
                availability: true
            },
            {
                id: 5,
                name: 'Mercedes Sprinter',
                type: 'bus',
                category: 'Bus Turístico',
                capacity: 20,
                features: ['Premium', 'WiFi', 'TV', 'Baño'],
                pricePerDay: 350,
                pricePerKm: 4.0,
                transmission: 'Manual',
                fuel: 'Diesel',
                year: 2021,
                rating: 4.7,
                availability: true
            },
            {
                id: 6,
                name: 'Toyota RAV4',
                type: 'suv',
                category: 'SUV Compacto',
                capacity: 5,
                features: ['Eficiente', 'Seguro', 'Todo Terreno'],
                pricePerDay: 160,
                pricePerKm: 2.8,
                transmission: 'Automático',
                fuel: 'Híbrido',
                year: 2023,
                rating: 4.8,
                availability: true
            },
            {
                id: 7,
                name: 'Hyundai Elantra',
                type: 'sedan',
                category: 'Sedán Estándar',
                capacity: 5,
                features: ['Económico', 'Confiable', 'Espacioso'],
                pricePerDay: 90,
                pricePerKm: 2.0,
                transmission: 'Manual',
                fuel: 'Gasolina',
                year: 2020,
                rating: 4.4,
                availability: false
            },
            {
                id: 8,
                name: 'Ford Transit',
                type: 'bus',
                category: 'Microbus',
                capacity: 15,
                features: ['Cómodo', 'Aire Acondicionado', 'Espacio Equipaje'],
                pricePerDay: 280,
                pricePerKm: 3.2,
                transmission: 'Manual',
                fuel: 'Diesel',
                year: 2020,
                rating: 4.5,
                availability: true
            }
        ];

        this.filteredVehicles = [...this.vehicles];
    }

    /**
     * Renderizado de vehículos
     */
    renderVehicles() {
        const container = document.getElementById('fleetGrid');
        if (!container) return;

        if (this.filteredVehicles.length === 0) {
            container.innerHTML = this.getNoVehiclesHTML();
            return;
        }

        container.innerHTML = this.filteredVehicles
            .map(vehicle => this.getVehicleCardHTML(vehicle))
            .join('');

        // Agregar event listeners a las tarjetas
        this.attachVehicleEventListeners();
    }

    /**
     * HTML para tarjeta de vehículo
     */
    getVehicleCardHTML(vehicle) {
        const typeIcon = this.getVehicleTypeIcon(vehicle.type);
        const availabilityClass = vehicle.availability ? 'available' : 'unavailable';
        const availabilityText = vehicle.availability ? 'Disponible' : 'No Disponible';
        
        return `
            <div class="vehicle-card ${availabilityClass}" data-id="${vehicle.id}">
                <div class="vehicle-image">
                    <div class="image-placeholder">
                        <i class="${typeIcon}"></i>
                    </div>
                    ${!vehicle.availability ? '<div class="unavailable-overlay">No Disponible</div>' : ''}
                </div>
                <div class="vehicle-info">
                    <h3 class="vehicle-name">${vehicle.name}</h3>
                    <div class="vehicle-type">${vehicle.category}</div>
                    <div class="vehicle-specs">
                        <div class="vehicle-spec">
                            <i class="fas fa-users"></i>
                            <span>${vehicle.capacity} personas</span>
                        </div>
                        <div class="vehicle-spec">
                            <i class="fas fa-star"></i>
                            <span>${vehicle.rating}</span>
                        </div>
                        <div class="vehicle-spec">
                            <i class="fas fa-cog"></i>
                            <span>${vehicle.transmission}</span>
                        </div>
                        <div class="vehicle-spec">
                            <i class="fas fa-gas-pump"></i>
                            <span>${vehicle.fuel}</span>
                        </div>
                    </div>
                    <div class="vehicle-price">
                        <span class="price-from">Desde</span>
                        <span class="price-amount">S/. ${vehicle.pricePerDay}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Obtener icono por tipo de vehículo
     */
    getVehicleTypeIcon(type) {
        const icons = {
            'sedan': 'fas fa-car',
            'suv': 'fas fa-car-side',
            'minivan': 'fas fa-shuttle-van',
            'bus': 'fas fa-bus'
        };
        return icons[type] || 'fas fa-car';
    }

    /**
     * Manejo de filtros de flota
     */
    handleFleetFilter(filter) {
        // Actualizar botones activos
        document.querySelectorAll('.fleet-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        this.currentFilter = filter;
        this.applyFleetFilter();
    }

    /**
     * Aplicar filtro de flota
     */
    applyFleetFilter() {
        if (this.currentFilter === 'all') {
            this.filteredVehicles = [...this.vehicles];
        } else {
            this.filteredVehicles = this.vehicles.filter(vehicle => 
                vehicle.type === this.currentFilter
            );
        }
        
        this.renderVehicles();
    }

    /**
     * Agregar event listeners a vehículos
     */
    attachVehicleEventListeners() {
        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const vehicleId = parseInt(card.dataset.id);
                this.showVehicleModal(vehicleId);
            });
        });
    }

    /**
     * Mostrar modal de vehículo
     */
    showVehicleModal(vehicleId) {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const modal = document.getElementById('vehicleModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = this.getVehicleModalHTML(vehicle);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Event listeners del modal
        this.setupVehicleModalEventListeners(vehicle);
    }

    /**
     * HTML para modal de vehículo
     */
    getVehicleModalHTML(vehicle) {
        const availabilityStatus = vehicle.availability ? 
            '<span style="color: #28a745;"><i class="fas fa-check-circle"></i> Disponible</span>' :
            '<span style="color: #dc3545;"><i class="fas fa-times-circle"></i> No Disponible</span>';

        return `
            <div class="modal-vehicle">
                <div class="modal-vehicle-header">
                    <div class="modal-vehicle-image">
                        <i class="${this.getVehicleTypeIcon(vehicle.type)}"></i>
                    </div>
                    <div class="modal-vehicle-info">
                        <h2>${vehicle.name}</h2>
                        <p class="modal-category">${vehicle.category}</p>
                        <p class="modal-description">Vehículo ${vehicle.year} en excelente estado</p>
                        <div class="modal-availability">${availabilityStatus}</div>
                    </div>
                </div>
                
                <div class="modal-specs-grid">
                    <div class="modal-spec-item">
                        <i class="fas fa-users"></i>
                        <span>Capacidad: ${vehicle.capacity} personas</span>
                    </div>
                    <div class="modal-spec-item">
                        <i class="fas fa-cog"></i>
                        <span>Transmisión: ${vehicle.transmission}</span>
                    </div>
                    <div class="modal-spec-item">
                        <i class="fas fa-gas-pump"></i>
                        <span>Combustible: ${vehicle.fuel}</span>
                    </div>
                    <div class="modal-spec-item">
                        <i class="fas fa-calendar"></i>
                        <span>Año: ${vehicle.year}</span>
                    </div>
                    <div class="modal-spec-item">
                        <i class="fas fa-star"></i>
                        <span>Calificación: ${vehicle.rating}/5</span>
                    </div>
                    <div class="modal-spec-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>S/. ${vehicle.pricePerKm}/km</span>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-list"></i> Características Incluidas</h3>
                    <div class="features-list">
                        ${vehicle.features.map(feature => 
                            `<div class="feature-item">
                                <i class="fas fa-check"></i>
                                <span>${feature}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-calculator"></i> Tarifas</h3>
                    <div class="pricing-info">
                        <div class="price-item">
                            <strong>Por día:</strong> S/. ${vehicle.pricePerDay}
                        </div>
                        <div class="price-item">
                            <strong>Por kilómetro:</strong> S/. ${vehicle.pricePerKm}
                        </div>
                        <div class="price-note">
                            * Precios incluyen conductor profesional y seguro básico
                        </div>
                    </div>
                </div>
                
                <div class="modal-action-buttons">
                    ${vehicle.availability ? 
                        `<button class="modal-action-btn primary" data-action="reserve">
                            <i class="fas fa-calendar-check"></i>
                            Reservar Vehículo
                        </button>` :
                        `<button class="modal-action-btn secondary" disabled>
                            <i class="fas fa-times"></i>
                            No Disponible
                        </button>`
                    }
                    <button class="modal-action-btn secondary" data-action="quote">
                        <i class="fas fa-calculator"></i>
                        Solicitar Cotización
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Configurar event listeners del modal de vehículo
     */
    setupVehicleModalEventListeners(vehicle) {
        // Cerrar modal
        document.querySelector('.close-button').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('vehicleModal').addEventListener('click', (e) => {
            if (e.target.id === 'vehicleModal') {
                this.closeModal();
            }
        });

        // Acciones del modal
        document.querySelectorAll('.modal-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleVehicleModalAction(action, vehicle);
            });
        });
    }

    /**
     * Manejo de acciones del modal de vehículo
     */
    handleVehicleModalAction(action, vehicle) {
        switch (action) {
            case 'reserve':
                this.handleVehicleReservation(vehicle);
                break;
            case 'quote':
                this.handleVehicleQuote(vehicle);
                break;
        }
    }

    /**
     * Manejo de reserva de vehículo
     */
    handleVehicleReservation(vehicle) {
        const params = new URLSearchParams({
            type: 'transport',
            vehicle: vehicle.name,
            vehicleId: vehicle.id,
            category: vehicle.type
        });
        window.location.href = `reservas.html?${params.toString()}`;
    }

    /**
     * Manejo de cotización de vehículo
     */
    handleVehicleQuote(vehicle) {
        const params = new URLSearchParams({
            type: 'quote',
            vehicle: vehicle.name,
            vehicleId: vehicle.id
        });
        window.location.href = `contacto.html?${params.toString()}`;
    }

    /**
     * Inicializar calculadora de rutas
     */
    initializeRouteCalculator() {
        const origenSelect = document.getElementById('origen');
        const destinoSelect = document.getElementById('destino');
        
        // Event listeners para actualizar opciones
        if (origenSelect && destinoSelect) {
            origenSelect.addEventListener('change', () => {
                this.updateDestinationOptions();
            });
        }
    }

    /**
     * Actualizar opciones de destino basadas en origen
     */
    updateDestinationOptions() {
        const origen = document.getElementById('origen').value;
        const destinoSelect = document.getElementById('destino');
        
        if (!origen || !destinoSelect) return;
        
        // Lógica para mostrar destinos relevantes según el origen
        // Por simplicidad, mantenemos todas las opciones disponibles
        // En una implementación real, esto filtrarías las opciones
    }

    /**
     * Calcular ruta y mostrar resultados
     */
    calculateRoute() {
        const origen = document.getElementById('origen').value;
        const destino = document.getElementById('destino').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const pasajeros = parseInt(document.getElementById('pasajeros').value);
        
        if (!origen || !destino || !fecha || !hora) {
            this.showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        if (origen === destino) {
            this.showNotification('El origen y destino no pueden ser iguales', 'error');
            return;
        }
        
        // Calcular ruta
        const routeKey = `${origen}-${destino}`;
        const reverseRouteKey = `${destino}-${origen}`;
        const distance = this.distances[routeKey] || this.distances[reverseRouteKey] || 50; // Default 50km
        
        const routeResults = this.calculatePrices(distance, pasajeros);
        
        this.displayRouteResults({
            origen,
            destino,
            fecha,
            hora,
            pasajeros,
            distance,
            results: routeResults
        });
    }

    /**
     * Calcular precios por tipo de servicio
     */
    calculatePrices(distance, pasajeros) {
        const results = [];
        
        Object.keys(this.priceConfig).forEach(serviceType => {
            const config = this.priceConfig[serviceType];
            let price = 0;
            let description = '';
            
            switch (serviceType) {
                case 'privado':
                    price = config.base + (distance * config.perKm);
                    description = 'Vehículo privado con conductor';
                    break;
                    
                case 'compartido':
                    price = (config.base + (distance * config.perKm)) / pasajeros;
                    if (pasajeros > 1) {
                        price += config.perPerson * (pasajeros - 1);
                    }
                    description = `Bus turístico compartido - ${pasajeros} ${pasajeros === 1 ? 'persona' : 'personas'}`;
                    break;
                    
                case 'transfer':
                    price = config.base + (distance * config.perKm);
                    description = 'Transfer directo';
                    break;
                    
                case 'premium':
                    price = config.base + (distance * config.perKm);
                    description = 'Servicio premium con extras incluidos';
                    break;
            }
            
            const estimatedTime = this.calculateTravelTime(distance);
            
            results.push({
                type: serviceType,
                price: Math.round(price),
                description,
                distance,
                estimatedTime,
                pasajeros: serviceType === 'compartido' ? pasajeros : 'Hasta 4 personas'
            });
        });
        
        return results.sort((a, b) => a.price - b.price);
    }

    /**
     * Calcular tiempo estimado de viaje
     */
    calculateTravelTime(distance) {
        // Velocidad promedio 45 km/h considerando carreteras andinas
        const avgSpeed = 45;
        const timeInHours = distance / avgSpeed;
        const hours = Math.floor(timeInHours);
        const minutes = Math.round((timeInHours - hours) * 60);
        
        if (hours === 0) {
            return `${minutes} min`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}min`;
        }
    }

    /**
     * Mostrar resultados de la calculadora
     */
    displayRouteResults(routeData) {
        const resultsContainer = document.getElementById('calculatorResults');
        if (!resultsContainer) return;
        
        const originText = this.getLocationName(routeData.origen);
        const destinationText = this.getLocationName(routeData.destino);
        
        resultsContainer.innerHTML = `
            <h3><i class="fas fa-route"></i> Resultados para tu viaje</h3>
            <div class="route-summary">
                <div class="route-path-display">
                    <span class="route-from">${originText}</span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="route-to">${destinationText}</span>
                </div>
                <div class="route-details-summary">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(routeData.fecha)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${routeData.hora}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${routeData.pasajeros} ${routeData.pasajeros === 1 ? 'persona' : 'personas'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-road"></i>
                        <span>${routeData.distance} km</span>
                    </div>
                </div>
            </div>
            
            <div class="price-options">
                ${routeData.results.map(result => `
                    <div class="result-card">
                        <div class="result-header">
                            <div class="result-service">
                                <i class="${this.getServiceIcon(result.type)}"></i>
                                <div>
                                    <h4>${this.getServiceName(result.type)}</h4>
                                    <p>${result.description}</p>
                                </div>
                            </div>
                            <div class="result-price">S/. ${result.price}</div>
                        </div>
                        <div class="result-details">
                            <div class="result-detail">
                                <i class="fas fa-clock"></i>
                                <span>${result.estimatedTime}</span>
                            </div>
                            <div class="result-detail">
                                <i class="fas fa-users"></i>
                                <span>${result.pasajeros}</span>
                            </div>
                            <div class="result-detail">
                                <i class="fas fa-shield-alt"></i>
                                <span>Seguro incluido</span>
                            </div>
                        </div>
                        <button class="result-select-btn" data-service="${result.type}" data-price="${result.price}">
                            <i class="fas fa-check"></i> Seleccionar
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Event listeners para botones de selección
        resultsContainer.querySelectorAll('.result-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serviceType = e.target.dataset.service;
                const price = e.target.dataset.price;
                this.handleServiceSelection(serviceType, price, routeData);
            });
        });
    }

    /**
     * Obtener nombre de ubicación amigable
     */
    getLocationName(locationKey) {
        const locations = {
            'aeropuerto': 'Aeropuerto Andahuaylas',
            'plaza': 'Plaza de Armas',
            'terminal': 'Terminal Terrestre',
            'hotel': 'Hotel/Hospedaje',
            'pacucha': 'Laguna de Pacucha',
            'sayhuite': 'Sayhuite',
            'sondor': 'Sondor',
            'chincheros': 'Chincheros',
            'antabamba': 'Cañón de Antabamba',
            'curasco': 'Bosque de Curasco'
        };
        return locations[locationKey] || locationKey;
    }

    /**
     * Obtener icono por tipo de servicio
     */
    getServiceIcon(serviceType) {
        const icons = {
            'privado': 'fas fa-car',
            'compartido': 'fas fa-bus',
            'transfer': 'fas fa-plane',
            'premium': 'fas fa-crown'
        };
        return icons[serviceType] || 'fas fa-car';
    }

    /**
     * Obtener nombre de servicio amigable
     */
    getServiceName(serviceType) {
        const names = {
            'privado': 'Transporte Privado',
            'compartido': 'Bus Turístico',
            'transfer': 'Transfer',
            'premium': 'Servicio Premium'
        };
        return names[serviceType] || serviceType;
    }

    /**
     * Formatear fecha
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Manejo de selección de servicio desde resultados
     */
    handleServiceSelection(serviceType, price, routeData) {
        const params = new URLSearchParams({
            type: 'transport',
            service: serviceType,
            origen: routeData.origen,
            destino: routeData.destino,
            fecha: routeData.fecha,
            hora: routeData.hora,
            pasajeros: routeData.pasajeros,
            price: price,
            distance: routeData.distance
        });
        
        window.location.href = `reservas.html?${params.toString()}`;
    }

    /**
     * Manejo de selección de tipo de transporte
     */
    handleTransportSelection(transportType) {
        // Scroll a la calculadora de rutas
        const calculator = document.querySelector('.route-calculator');
        if (calculator) {
            calculator.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight de la calculadora
            calculator.style.transform = 'scale(1.02)';
            calculator.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                calculator.style.transform = 'scale(1)';
            }, 1000);
        }
        
        this.showNotification(`Seleccionaste ${this.getServiceName(transportType)}. Completa los datos para cotizar.`, 'info');
    }

    /**
     * Manejo de selección de ruta popular
     */
    handleRouteSelection(routeCard) {
        // Extraer información de la tarjeta de ruta
        const routePath = routeCard.querySelector('.route-path');
        const origin = routePath.querySelector('.route-origin').textContent.trim().split(' ')[1];
        const destination = routePath.querySelector('.route-destination').textContent.trim().split(' ')[1];
        
        // Pre-rellenar la calculadora
        const origenSelect = document.getElementById('origen');
        const destinoSelect = document.getElementById('destino');
        
        if (origenSelect && destinoSelect) {
            // Mapear nombres a valores
            const locationMap = {
                'Centro': 'plaza',
                'Hotel': 'hotel',
                'Aeropuerto': 'aeropuerto',
                'Pacucha': 'pacucha',
                'Sayhuite': 'sayhuite',
                'Tour': 'pacucha' // Para tour completo, por defecto Pacucha
            };
            
            origenSelect.value = locationMap[origin] || 'plaza';
            destinoSelect.value = locationMap[destination] || 'pacucha';
        }
        
        // Scroll a la calculadora
        const calculator = document.querySelector('.route-calculator');
        if (calculator) {
            calculator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Establecer fecha por defecto (mañana)
     */
    setDefaultDate() {
        const fechaInput = document.getElementById('fecha');
        const horaInput = document.getElementById('hora');
        
        if (fechaInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            fechaInput.value = tomorrow.toISOString().split('T')[0];
            fechaInput.min = new Date().toISOString().split('T')[0];
        }
        
        if (horaInput) {
            horaInput.value = '08:00';
        }
    }

    /**
     * Cerrar modal
     */
    closeModal() {
        const modal = document.getElementById('vehicleModal');
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
        document.querySelectorAll('.transport-card, .vehicle-card, .route-card, .safety-item').forEach(el => {
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
        const container = document.getElementById('fleetGrid');
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
     * HTML para cuando no hay vehículos
     */
    getNoVehiclesHTML() {
        return `
            <div class="no-results">
                <i class="fas fa-car"></i>
                <h3>No hay vehículos disponibles</h3>
                <p>No se encontraron vehículos para el filtro seleccionado</p>
                <button onclick="transportePage.handleFleetFilter('all')" class="clear-filters-btn">
                    <i class="fas fa-list"></i> Ver Todos
                </button>
            </div>
        `;
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
        }, 4000);
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
    window.transportePage = new TransportePage();
});

// Exportar para compatibilidad
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransportePage;
}