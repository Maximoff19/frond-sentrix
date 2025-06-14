// Gestión de Zonas
const zones = {
    // Estado
    state: {
        zones: [
            {
                id: "Z001",
                name: "Entrada Principal",
                type: "acceso",
                status: "activa",
                occupancy: 45,
                capacity: 100,
                lastUpdate: "2024-03-20T10:30:00",
                location: "Edificio A, Planta Baja",
                description: "Zona de acceso principal con control de entrada",
                accessLevel: "general",
                restrictions: ["Horario: 7:00-19:00", "Requiere identificación"],
                devices: ["Cámara PTZ-001", "Control de Acceso CA-001"],
                alerts: []
            },
            {
                id: "Z002",
                name: "Área de Servidores",
                type: "restriccion",
                status: "activa",
                occupancy: 2,
                capacity: 5,
                lastUpdate: "2024-03-20T10:25:00",
                location: "Edificio B, Sótano",
                description: "Sala de servidores con acceso restringido",
                accessLevel: "restringido",
                restrictions: ["Acceso solo personal autorizado", "Requiere tarjeta de acceso nivel 3"],
                devices: ["Cámara Fija CF-002", "Control de Acceso CA-002"],
                alerts: []
            },
            {
                id: "Z003",
                name: "Sala de Reuniones",
                type: "monitoreo",
                status: "activa",
                occupancy: 12,
                capacity: 20,
                lastUpdate: "2024-03-20T10:28:00",
                location: "Edificio A, Piso 2",
                description: "Sala de reuniones principal",
                accessLevel: "general",
                restrictions: ["Reserva previa requerida"],
                devices: ["Cámara PTZ-003", "Sensor de Ocupación SO-001"],
                alerts: []
            },
            {
                id: "Z004",
                name: "Laboratorio",
                type: "restriccion",
                status: "mantenimiento",
                occupancy: 0,
                capacity: 15,
                lastUpdate: "2024-03-20T09:15:00",
                location: "Edificio C, Piso 1",
                description: "Laboratorio de investigación",
                accessLevel: "restringido",
                restrictions: ["Acceso solo personal autorizado", "Equipo de protección requerido"],
                devices: ["Cámara Fija CF-004", "Control de Acceso CA-003"],
                alerts: ["Mantenimiento programado"]
            },
            {
                id: "Z005",
                name: "Área de Descanso",
                type: "monitoreo",
                status: "activa",
                occupancy: 8,
                capacity: 30,
                lastUpdate: "2024-03-20T10:32:00",
                location: "Edificio A, Piso 1",
                description: "Área común de descanso",
                accessLevel: "general",
                restrictions: ["Horario: 8:00-20:00"],
                devices: ["Cámara Fija CF-005", "Sensor de Ocupación SO-002"],
                alerts: []
            },
            {
                id: "Z006",
                name: "Almacén",
                type: "restriccion",
                status: "activa",
                occupancy: 3,
                capacity: 10,
                lastUpdate: "2024-03-20T10:20:00",
                location: "Edificio B, Piso 1",
                description: "Almacén de materiales",
                accessLevel: "restringido",
                restrictions: ["Acceso solo personal de almacén", "Registro de entrada/salida"],
                devices: ["Cámara Fija CF-006", "Control de Acceso CA-004"],
                alerts: []
            },
            {
                id: "Z007",
                name: "Gimnasio",
                type: "monitoreo",
                status: "inactiva",
                occupancy: 0,
                capacity: 50,
                lastUpdate: "2024-03-20T08:00:00",
                location: "Edificio C, Sótano",
                description: "Gimnasio corporativo",
                accessLevel: "general",
                restrictions: ["Horario: 6:00-22:00", "Requiere registro previo"],
                devices: ["Cámara PTZ-007", "Sensor de Ocupación SO-003"],
                alerts: ["Cerrado por mantenimiento"]
            },
            {
                id: "Z008",
                name: "Sala de Control",
                type: "restriccion",
                status: "activa",
                occupancy: 4,
                capacity: 6,
                lastUpdate: "2024-03-20T10:35:00",
                location: "Edificio A, Piso 3",
                description: "Sala de control de seguridad",
                accessLevel: "restringido",
                restrictions: ["Acceso solo personal de seguridad", "Acceso 24/7"],
                devices: ["Cámara Fija CF-007", "Control de Acceso CA-005"],
                alerts: []
            }
        ],
        filters: {
            type: "",
            status: "",
            occupancy: "",
            search: ""
        },
        map: {
            zoom: 1,
            center: { x: 0, y: 0 }
        }
    },

    // Inicialización
    init: () => {
        zones.setupEventListeners();
        zones.updateSummary();
        zones.renderZonesList();
        zones.initMap();
    },

    // Configurar event listeners
    setupEventListeners: () => {
        // Filtros
        const zoneType = document.getElementById('zoneType');
        const zoneStatus = document.getElementById('zoneStatus');
        const zoneOccupancy = document.getElementById('occupancyLevel');
        const searchZone = document.getElementById('zoneSearch');

        if (zoneType) {
            zoneType.addEventListener('change', (e) => {
                zones.state.filters.type = e.target.value;
                zones.renderZonesList();
                zones.updateMap();
            });
        }

        if (zoneStatus) {
            zoneStatus.addEventListener('change', (e) => {
                zones.state.filters.status = e.target.value;
                zones.renderZonesList();
                zones.updateMap();
            });
        }

        if (zoneOccupancy) {
            zoneOccupancy.addEventListener('change', (e) => {
                zones.state.filters.occupancy = e.target.value;
                zones.renderZonesList();
                zones.updateMap();
            });
        }

        if (searchZone) {
            searchZone.addEventListener('input', (e) => {
                zones.state.filters.search = e.target.value.toLowerCase();
                zones.renderZonesList();
                zones.updateMap();
            });
        }

        // Botones de acción
        const addZoneBtn = document.getElementById('addZoneBtn');
        const refreshZonesBtn = document.getElementById('refreshZonesBtn');
        const exportZonesBtn = document.getElementById('exportZonesBtn');
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const resetMapBtn = document.getElementById('resetMapBtn');

        if (addZoneBtn) {
            addZoneBtn.addEventListener('click', () => zones.showZoneModal());
        }

        if (refreshZonesBtn) {
            refreshZonesBtn.addEventListener('click', () => zones.refreshZones());
        }

        if (exportZonesBtn) {
            exportZonesBtn.addEventListener('click', () => zones.exportZones());
        }

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => zones.zoomMap(1));
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => zones.zoomMap(-1));
        }

        if (resetMapBtn) {
            resetMapBtn.addEventListener('click', () => zones.resetMap());
        }

        // Modal
        const zoneModal = document.getElementById('zoneModal');
        const closeZoneModal = document.getElementById('closeZoneModal');
        const closeZoneBtn = document.getElementById('closeZoneBtn');
        const saveZoneBtn = document.getElementById('saveZoneBtn');

        if (closeZoneModal) {
            closeZoneModal.addEventListener('click', () => zones.hideZoneModal());
        }

        if (closeZoneBtn) {
            closeZoneBtn.addEventListener('click', () => zones.hideZoneModal());
        }

        if (saveZoneBtn) {
            saveZoneBtn.addEventListener('click', () => zones.saveZone());
        }

        // Cerrar modal al hacer clic fuera
        if (zoneModal) {
            zoneModal.addEventListener('click', (e) => {
                if (e.target === zoneModal) {
                    zones.hideZoneModal();
                }
            });
        }
    },

    // Actualizar resumen
    updateSummary: () => {
        const totalZones = document.getElementById('totalZones');
        const activeZones = document.getElementById('activeZones');
        const restrictedZones = document.getElementById('restrictedZones');
        const avgOccupancy = document.getElementById('avgOccupancy');

        if (totalZones) {
            totalZones.textContent = zones.state.zones.length;
        }

        if (activeZones) {
            activeZones.textContent = zones.state.zones.filter(z => z.status === 'activa').length;
        }

        if (restrictedZones) {
            restrictedZones.textContent = zones.state.zones.filter(z => z.type === 'restriccion').length;
        }

        if (avgOccupancy) {
            const totalOccupancy = zones.state.zones.reduce((sum, zone) => sum + zone.occupancy, 0);
            const average = Math.round((totalOccupancy / zones.state.zones.length) * 100);
            avgOccupancy.textContent = `${average}%`;
        }
    },

    // Renderizar lista de zonas
    renderZonesList: () => {
        const zonesList = document.getElementById('zonesTableBody');
        if (!zonesList) return;

        const filteredZones = zones.filterZones();
        
        zonesList.innerHTML = filteredZones.map(zone => `
            <tr class="${zone.status}">
                <td>${zone.id}</td>
                <td>${zone.name}</td>
                <td>
                    <span class="zone-type ${zone.type}">${zones.getZoneTypeLabel(zone.type)}</span>
                </td>
                <td>
                    <span class="zone-status ${zone.status}">${zones.getZoneStatusLabel(zone.status)}</span>
                </td>
                <td>
                    <div class="occupancy-bar">
                        <div class="occupancy-fill" style="width: ${(zone.occupancy / zone.capacity * 100)}%"></div>
                        <span>${zone.occupancy}/${zone.capacity}</span>
                    </div>
                </td>
                <td>${zones.formatTime(zone.lastUpdate)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-icon" title="Ver detalles" onclick="zones.showZoneDetails('${zone.id}')">
                            <i class="ri-eye-line"></i>
                        </button>
                        <button class="btn btn-icon" title="Editar" onclick="zones.editZone('${zone.id}')">
                            <i class="ri-edit-line"></i>
                        </button>
                        ${zone.status === 'activa' ? `
                            <button class="btn btn-icon" title="Desactivar" onclick="zones.toggleZoneStatus('${zone.id}')">
                                <i class="ri-stop-circle-line"></i>
                            </button>
                        ` : `
                            <button class="btn btn-icon" title="Activar" onclick="zones.toggleZoneStatus('${zone.id}')">
                                <i class="ri-play-circle-line"></i>
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // Filtrar zonas
    filterZones: () => {
        return zones.state.zones.filter(zone => {
            const typeMatch = !zones.state.filters.type || zone.type === zones.state.filters.type;
            const statusMatch = !zones.state.filters.status || zone.status === zones.state.filters.status;
            let occupancyMatch = true;
            if (zones.state.filters.occupancy) {
                const percent = (zone.occupancy / zone.capacity) * 100;
                if (zones.state.filters.occupancy === 'bajo') occupancyMatch = percent < 30;
                else if (zones.state.filters.occupancy === 'medio') occupancyMatch = percent >= 30 && percent <= 70;
                else if (zones.state.filters.occupancy === 'alto') occupancyMatch = percent > 70;
            }
            const search = zones.state.filters.search || '';
            const searchMatch = zone.name.toLowerCase().includes(search) ||
                zone.id.toLowerCase().includes(search) ||
                (zone.location && zone.location.toLowerCase().includes(search));
            return typeMatch && statusMatch && occupancyMatch && searchMatch;
        });
    },

    // Inicializar mapa
    initMap: () => {
        const mapContainer = document.getElementById('zonesMap');
        if (!mapContainer) return;

        // Aquí se implementaría la inicialización del mapa
        // Por ahora, solo mostraremos un placeholder
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <i class="ri-map-2-line"></i>
                <p>Mapa de zonas</p>
                <small>El mapa se cargará próximamente</small>
            </div>
        `;
    },

    // Actualizar mapa
    updateMap: () => {
        // Aquí se implementaría la actualización del mapa
        // Por ahora, solo actualizamos el placeholder
        const mapContainer = document.getElementById('zonesMap');
        if (!mapContainer) return;

        const filteredZones = zones.filterZones();
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <i class="ri-map-2-line"></i>
                <p>Mapa de zonas</p>
                <small>Mostrando ${filteredZones.length} zonas</small>
            </div>
        `;
    },

    // Zoom del mapa
    zoomMap: (delta) => {
        zones.state.map.zoom = Math.max(1, Math.min(5, zones.state.map.zoom + delta));
        zones.updateMap();
    },

    // Resetear mapa
    resetMap: () => {
        zones.state.map.zoom = 1;
        zones.state.map.center = { x: 0, y: 0 };
        zones.updateMap();
    },

    // Formatear tiempo
    formatTime: (time) => {
        const date = new Date(time);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // menos de 1 minuto
            return 'Hace un momento';
        } else if (diff < 3600000) { // menos de 1 hora
            const minutes = Math.floor(diff / 60000);
            return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        } else if (diff < 86400000) { // menos de 1 día
            const hours = Math.floor(diff / 3600000);
            return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        } else {
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },

    // Mostrar detalles de zona
    showZoneDetails: (id) => {
        const zone = zones.state.zones.find(z => z.id === id);
        if (!zone) return;

        const modal = document.getElementById('zoneModal');
        const details = document.getElementById('zoneDetails');
        const modalTitle = document.getElementById('modalTitle');
        
        if (modal && details && modalTitle) {
            modalTitle.textContent = `Detalles de ${zone.name}`;
            details.innerHTML = `
                <div class="zone-details">
                    <div class="detail-group">
                        <label>ID de Zona</label>
                        <p>${zone.id}</p>
                    </div>
                    <div class="detail-group">
                        <label>Nombre</label>
                        <p>${zone.name}</p>
                    </div>
                    <div class="detail-group">
                        <label>Tipo</label>
                        <span class="zone-type ${zone.type}">${zones.getZoneTypeLabel(zone.type)}</span>
                    </div>
                    <div class="detail-group">
                        <label>Estado</label>
                        <span class="zone-status ${zone.status}">${zones.getZoneStatusLabel(zone.status)}</span>
                    </div>
                    <div class="detail-group">
                        <label>Ubicación</label>
                        <p><i class="ri-map-pin-line"></i> ${zone.location}</p>
                    </div>
                    <div class="detail-group">
                        <label>Descripción</label>
                        <p>${zone.description}</p>
                    </div>
                    <div class="detail-group">
                        <label>Capacidad</label>
                        <div class="occupancy-info">
                            <div class="occupancy-bar">
                                <div class="occupancy-fill" style="width: ${(zone.occupancy / zone.capacity * 100)}%"></div>
                                <span>${zone.occupancy}/${zone.capacity}</span>
                            </div>
                            <p class="occupancy-text">${zone.occupancy} de ${zone.capacity} personas</p>
                        </div>
                    </div>
                    <div class="detail-group">
                        <label>Nivel de Acceso</label>
                        <p>${zone.accessLevel}</p>
                    </div>
                    <div class="detail-group">
                        <label>Restricciones</label>
                        <ul class="restrictions-list">
                            ${zone.restrictions.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="detail-group">
                        <label>Dispositivos</label>
                        <ul class="devices-list">
                            ${zone.devices.map(d => `<li>${d}</li>`).join('')}
                        </ul>
                    </div>
                    ${zone.alerts.length > 0 ? `
                        <div class="detail-group">
                            <label>Alertas Activas</label>
                            <div class="alerts-list">
                                ${zone.alerts.map(alert => `
                                    <div class="alert-item ${alert.severity}">
                                        <div class="alert-header">
                                            <span class="alert-type">${alert.type}</span>
                                            <span class="alert-time">${zones.formatTime(alert.time)}</span>
                                        </div>
                                        <p class="alert-message">${alert.message}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    <div class="detail-group">
                        <label>Última Actualización</label>
                        <p>${zones.formatTime(zone.lastUpdate)}</p>
                    </div>
                </div>
            `;

            modal.classList.add('show');
            modal.dataset.zoneId = id;
        }
    },

    // Ocultar modal
    hideZoneModal: () => {
        const modal = document.getElementById('zoneModal');
        if (modal) {
            modal.classList.remove('show');
            delete modal.dataset.zoneId;
        }
    },

    // Editar zona
    editZone: (id) => {
        const zone = zones.state.zones.find(z => z.id === id);
        if (!zone) return;

        const modal = document.getElementById('zoneModal');
        const details = document.getElementById('zoneDetails');
        const modalTitle = document.getElementById('modalTitle');
        const saveZoneBtn = document.getElementById('saveZoneBtn');
        
        if (modal && details && modalTitle && saveZoneBtn) {
            modalTitle.textContent = `Editar ${zone.name}`;
            details.innerHTML = zones.getZoneFormHTML(zone);

            saveZoneBtn.style.display = 'block';
            modal.classList.add('show');
            modal.dataset.zoneId = id;
        }
    },

    // Guardar zona
    saveZone: () => {
        const zoneId = document.getElementById('zoneModal')?.dataset.zoneId;
        if (!zoneId) return;

        const form = document.getElementById('zoneForm');
        if (!form) return;

        const zone = zones.state.zones.find(z => z.id === zoneId);
        if (!zone) return;

        // Aquí se implementaría la validación y guardado de los datos
        // Por ahora, solo actualizamos el estado local
        zone.name = document.getElementById('zoneName').value;
        zone.type = document.getElementById('zoneType').value;
        zone.status = document.getElementById('zoneStatus').value;
        zone.location = document.getElementById('zoneLocation').value;
        zone.description = document.getElementById('zoneDescription').value;
        zone.capacity = parseInt(document.getElementById('zoneCapacity').value);
        zone.accessLevel = document.getElementById('zoneAccessLevel').value;
        zone.lastUpdate = new Date().toISOString();

        zones.updateSummary();
        zones.renderZonesList();
        zones.updateMap();
        zones.hideZoneModal();
        zones.showNotification('Zona actualizada correctamente', 'success');
    },

    // Cambiar estado de zona
    toggleZoneStatus: (id) => {
        const zone = zones.state.zones.find(z => z.id === id);
        if (!zone) return;

        const newStatus = zone.status === 'activa' ? 'inactiva' : 'activa';
        zone.status = newStatus;
        zone.lastUpdate = new Date().toISOString();

        zones.updateSummary();
        zones.renderZonesList();
        zones.updateMap();
        zones.showNotification(`Zona ${zone.name} ${newStatus === 'activa' ? 'activada' : 'desactivada'} correctamente`, 'success');
    },

    // Actualizar zonas
    refreshZones: () => {
        // Simular actualización
        zones.showNotification('Zonas actualizadas', 'success');
        zones.updateSummary();
        zones.renderZonesList();
        zones.updateMap();
    },

    // Exportar zonas
    exportZones: () => {
        const filteredZones = zones.filterZones();
        if (filteredZones.length > 0) {
            zones.showNotification('Exportando zonas seleccionadas', 'info');
        } else {
            zones.showNotification('No hay zonas para exportar', 'warning');
        }
    },

    // Mostrar notificación
    showNotification: (message, type = 'info') => {
        // Implementar sistema de notificaciones
        console.log(`[${type.toUpperCase()}] ${message}`);
    },

    getZoneTypeLabel: (type) => {
        const types = {
            'acceso': 'Acceso',
            'restriccion': 'Restricción',
            'monitoreo': 'Monitoreo'
        };
        return types[type] || type;
    },

    getZoneStatusLabel: (status) => {
        const statuses = {
            'activa': 'Activa',
            'inactiva': 'Inactiva',
            'mantenimiento': 'Mantenimiento'
        };
        return statuses[status] || status;
    },

    getZoneFormHTML: (zone = null) => {
        return `
            <form id="zoneForm" class="zone-form">
                <div class="form-group">
                    <label for="zoneName">Nombre</label>
                    <input type="text" id="zoneName" name="name" value="${zone?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="zoneType">Tipo</label>
                    <select id="zoneType" name="type" required>
                        <option value="acceso" ${zone?.type === 'acceso' ? 'selected' : ''}>Acceso</option>
                        <option value="restriccion" ${zone?.type === 'restriccion' ? 'selected' : ''}>Restricción</option>
                        <option value="monitoreo" ${zone?.type === 'monitoreo' ? 'selected' : ''}>Monitoreo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="zoneStatus">Estado</label>
                    <select id="zoneStatus" name="status" required>
                        <option value="activa" ${zone?.status === 'activa' ? 'selected' : ''}>Activa</option>
                        <option value="inactiva" ${zone?.status === 'inactiva' ? 'selected' : ''}>Inactiva</option>
                        <option value="mantenimiento" ${zone?.status === 'mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="zoneCapacity">Capacidad</label>
                    <input type="number" id="zoneCapacity" name="capacity" value="${zone?.capacity || 0}" min="0" required>
                </div>
                <div class="form-group">
                    <label for="zoneLocation">Ubicación</label>
                    <input type="text" id="zoneLocation" name="location" value="${zone?.location || ''}" required>
                </div>
                <div class="form-group">
                    <label for="zoneDescription">Descripción</label>
                    <textarea id="zoneDescription" name="description" rows="3">${zone?.description || ''}</textarea>
                </div>
            </form>
        `;
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', zones.init); 