// Gestión de Alertas
const alerts = {
    // Estado
    state: {
        alerts: [
            {
                id: 1,
                type: 'acceso',
                message: 'Acceso no autorizado en Zona A-3',
                severity: 'alta',
                status: 'activa',
                time: '2024-03-20T10:15:00',
                location: 'Zona A-3',
                details: 'Intento de acceso no autorizado detectado por el sistema de control de acceso.',
                resolvedBy: null,
                resolvedAt: null
            },
            {
                id: 2,
                type: 'presencia',
                message: 'Personal detectado en zona restringida B-2',
                severity: 'media',
                status: 'activa',
                time: '2024-03-20T09:45:00',
                location: 'Zona B-2',
                details: 'Sistema de detección de presencia ha identificado movimiento en zona restringida.',
                resolvedBy: null,
                resolvedAt: null
            },
            {
                id: 3,
                type: 'sistema',
                message: 'Error en sistema de monitoreo',
                severity: 'baja',
                status: 'activa',
                time: '2024-03-20T08:30:00',
                location: 'Sistema Central',
                details: 'Se ha detectado un error en el sistema de monitoreo de cámaras.',
                resolvedBy: null,
                resolvedAt: null
            },
            {
                id: 4,
                type: 'zona',
                message: 'Alta ocupación en Zona B-1',
                severity: 'media',
                status: 'resuelta',
                time: '2024-03-19T15:20:00',
                location: 'Zona B-1',
                details: 'La zona ha alcanzado el 95% de su capacidad máxima.',
                resolvedBy: 'Admin',
                resolvedAt: '2024-03-19T15:45:00'
            },
            {
                id: 5,
                type: 'acceso',
                message: 'Tarjeta de acceso inválida',
                severity: 'baja',
                status: 'resuelta',
                time: '2024-03-19T14:10:00',
                location: 'Entrada Principal',
                details: 'Intento de acceso con tarjeta inválida o bloqueada.',
                resolvedBy: 'Seguridad',
                resolvedAt: '2024-03-19T14:15:00'
            }
        ],
        filters: {
            type: 'all',
            severity: 'all',
            status: 'all',
            search: ''
        }
    },

    // Inicialización
    init: () => {
        alerts.setupEventListeners();
        alerts.updateSummary();
        alerts.renderActiveAlerts();
        alerts.renderAlertsHistory();
    },

    // Configurar event listeners
    setupEventListeners: () => {
        // Filtros
        const alertType = document.getElementById('alertType');
        const alertSeverity = document.getElementById('alertSeverity');
        const alertStatus = document.getElementById('alertStatus');
        const searchAlert = document.getElementById('searchAlert');

        if (alertType) {
            alertType.addEventListener('change', (e) => {
                alerts.state.filters.type = e.target.value;
                alerts.renderActiveAlerts();
                alerts.renderAlertsHistory();
            });
        }

        if (alertSeverity) {
            alertSeverity.addEventListener('change', (e) => {
                alerts.state.filters.severity = e.target.value;
                alerts.renderActiveAlerts();
                alerts.renderAlertsHistory();
            });
        }

        if (alertStatus) {
            alertStatus.addEventListener('change', (e) => {
                alerts.state.filters.status = e.target.value;
                alerts.renderActiveAlerts();
                alerts.renderAlertsHistory();
            });
        }

        if (searchAlert) {
            searchAlert.addEventListener('input', (e) => {
                alerts.state.filters.search = e.target.value;
                alerts.renderActiveAlerts();
                alerts.renderAlertsHistory();
            });
        }

        // Botones de acción
        const refreshAlertsBtn = document.getElementById('refreshAlerts');
        const exportAlertsBtn = document.getElementById('exportAlerts');
        const viewAllAlertsBtn = document.getElementById('viewAllAlerts');

        if (refreshAlertsBtn) {
            refreshAlertsBtn.addEventListener('click', () => alerts.refreshAlerts());
        }

        if (exportAlertsBtn) {
            exportAlertsBtn.addEventListener('click', () => alerts.exportAlerts());
        }

        if (viewAllAlertsBtn) {
            viewAllAlertsBtn.addEventListener('click', () => alerts.viewAllAlerts());
        }

        // Modal
        const alertModal = document.getElementById('alertModal');
        const closeAlertModal = document.getElementById('closeAlertModal');
        const closeAlertBtn = document.getElementById('closeAlert');
        const resolveAlertBtn = document.getElementById('resolveAlert');

        if (closeAlertModal) {
            closeAlertModal.addEventListener('click', () => alerts.hideAlertModal());
        }

        if (closeAlertBtn) {
            closeAlertBtn.addEventListener('click', () => alerts.closeAlert());
        }

        if (resolveAlertBtn) {
            resolveAlertBtn.addEventListener('click', () => alerts.resolveAlert());
        }

        // Cerrar modal al hacer clic fuera
        if (alertModal) {
            alertModal.addEventListener('click', (e) => {
                if (e.target === alertModal) {
                    alerts.hideAlertModal();
                }
            });
        }
    },

    // Actualizar resumen
    updateSummary: () => {
        const totalAlerts = document.getElementById('totalAlerts');
        const highAlerts = document.getElementById('highAlerts');
        const mediumAlerts = document.getElementById('mediumAlerts');
        const lowAlerts = document.getElementById('lowAlerts');

        if (totalAlerts) {
            totalAlerts.textContent = alerts.state.alerts.filter(a => a.status === 'activa').length;
        }

        if (highAlerts) {
            highAlerts.textContent = alerts.state.alerts.filter(a => a.status === 'activa' && a.severity === 'alta').length;
        }

        if (mediumAlerts) {
            mediumAlerts.textContent = alerts.state.alerts.filter(a => a.status === 'activa' && a.severity === 'media').length;
        }

        if (lowAlerts) {
            lowAlerts.textContent = alerts.state.alerts.filter(a => a.status === 'activa' && a.severity === 'baja').length;
        }
    },

    // Renderizar alertas activas
    renderActiveAlerts: () => {
        const activeAlertsList = document.getElementById('activeAlertsList');
        if (!activeAlertsList) return;

        const filteredAlerts = alerts.filterAlerts().filter(alert => alert.status === 'activa');
        
        activeAlertsList.innerHTML = filteredAlerts.map(alert => `
            <div class="alert-card ${alert.severity}" onclick="alerts.showAlertDetails(${alert.id})">
                <div class="alert-header">
                    <div class="alert-type">
                        <i class="ri-${alerts.getAlertIcon(alert.type)}"></i>
                        ${alert.type}
                    </div>
                    <span class="alert-time">${alerts.formatTime(alert.time)}</span>
                </div>
                <div class="alert-body">
                    <h4>${alert.message}</h4>
                    <p>${alert.details}</p>
                    <div class="alert-meta">
                        <span><i class="ri-map-pin-line"></i> ${alert.location}</span>
                    </div>
                </div>
                <div class="alert-footer">
                    <span class="alert-severity ${alert.severity}">${alert.severity}</span>
                    <div class="alert-actions">
                        <button class="btn btn-icon" title="Resolver" onclick="event.stopPropagation(); alerts.resolveAlert(${alert.id})">
                            <i class="ri-check-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // Renderizar historial de alertas
    renderAlertsHistory: () => {
        const alertsHistoryList = document.getElementById('alertsHistoryList');
        if (!alertsHistoryList) return;

        const filteredAlerts = alerts.filterAlerts()
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 10);

        alertsHistoryList.innerHTML = filteredAlerts.map(alert => `
            <tr class="${alert.severity}">
                <td>
                    <div class="alert-type">
                        <i class="ri-${alerts.getAlertIcon(alert.type)}"></i>
                        ${alert.type}
                    </div>
                </td>
                <td>${alert.message}</td>
                <td><span class="alert-severity ${alert.severity}">${alert.severity}</span></td>
                <td>${alerts.formatTime(alert.time)}</td>
                <td><span class="alert-status ${alert.status}">${alert.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-icon" title="Ver detalles" onclick="alerts.showAlertDetails(${alert.id})">
                            <i class="ri-eye-line"></i>
                        </button>
                        ${alert.status === 'activa' ? `
                            <button class="btn btn-icon" title="Resolver" onclick="alerts.resolveAlert(${alert.id})">
                                <i class="ri-check-line"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // Filtrar alertas
    filterAlerts: () => {
        return alerts.state.alerts.filter(alert => {
            const typeMatch = alerts.state.filters.type === 'all' || alert.type === alerts.state.filters.type;
            const severityMatch = alerts.state.filters.severity === 'all' || alert.severity === alerts.state.filters.severity;
            const statusMatch = alerts.state.filters.status === 'all' || alert.status === alerts.state.filters.status;
            const searchMatch = alert.message.toLowerCase().includes(alerts.state.filters.search.toLowerCase()) ||
                              alert.details.toLowerCase().includes(alerts.state.filters.search.toLowerCase());
            
            return typeMatch && severityMatch && statusMatch && searchMatch;
        });
    },

    // Obtener icono según tipo de alerta
    getAlertIcon: (type) => {
        const icons = {
            acceso: 'door-lock-line',
            presencia: 'user-search-line',
            sistema: 'computer-line',
            zona: 'map-pin-line'
        };
        return icons[type] || 'alert-line';
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

    // Mostrar detalles de alerta
    showAlertDetails: (id) => {
        const alert = alerts.state.alerts.find(a => a.id === id);
        if (!alert) return;

        const modal = document.getElementById('alertModal');
        const details = document.getElementById('alertDetails');
        
        if (modal && details) {
            details.innerHTML = `
                <div class="alert-details">
                    <div class="detail-group">
                        <label>Tipo de Alerta</label>
                        <div class="alert-type">
                            <i class="ri-${alerts.getAlertIcon(alert.type)}"></i>
                            ${alert.type}
                        </div>
                    </div>
                    <div class="detail-group">
                        <label>Mensaje</label>
                        <p>${alert.message}</p>
                    </div>
                    <div class="detail-group">
                        <label>Detalles</label>
                        <p>${alert.details}</p>
                    </div>
                    <div class="detail-group">
                        <label>Ubicación</label>
                        <p><i class="ri-map-pin-line"></i> ${alert.location}</p>
                    </div>
                    <div class="detail-group">
                        <label>Severidad</label>
                        <span class="alert-severity ${alert.severity}">${alert.severity}</span>
                    </div>
                    <div class="detail-group">
                        <label>Estado</label>
                        <span class="alert-status ${alert.status}">${alert.status}</span>
                    </div>
                    <div class="detail-group">
                        <label>Fecha y Hora</label>
                        <p>${new Date(alert.time).toLocaleString('es-ES')}</p>
                    </div>
                    ${alert.resolvedBy ? `
                        <div class="detail-group">
                            <label>Resuelto por</label>
                            <p>${alert.resolvedBy}</p>
                        </div>
                        <div class="detail-group">
                            <label>Fecha de resolución</label>
                            <p>${new Date(alert.resolvedAt).toLocaleString('es-ES')}</p>
                        </div>
                    ` : ''}
                </div>
            `;

            modal.classList.add('show');
            modal.dataset.alertId = id;
        }
    },

    // Ocultar modal
    hideAlertModal: () => {
        const modal = document.getElementById('alertModal');
        if (modal) {
            modal.classList.remove('show');
            delete modal.dataset.alertId;
        }
    },

    // Resolver alerta
    resolveAlert: (id) => {
        const alertId = id || document.getElementById('alertModal')?.dataset.alertId;
        if (!alertId) return;

        const alert = alerts.state.alerts.find(a => a.id === alertId);
        if (alert && alert.status === 'activa') {
            alert.status = 'resuelta';
            alert.resolvedBy = 'Usuario Actual';
            alert.resolvedAt = new Date().toISOString();

            alerts.updateSummary();
            alerts.renderActiveAlerts();
            alerts.renderAlertsHistory();
            alerts.hideAlertModal();
            alerts.showNotification('Alerta resuelta correctamente', 'success');
        }
    },

    // Cerrar alerta
    closeAlert: () => {
        const alertId = document.getElementById('alertModal')?.dataset.alertId;
        if (!alertId) return;

        const alert = alerts.state.alerts.find(a => a.id === alertId);
        if (alert && alert.status === 'activa') {
            alert.status = 'pendiente';
            alerts.updateSummary();
            alerts.renderActiveAlerts();
            alerts.renderAlertsHistory();
            alerts.hideAlertModal();
            alerts.showNotification('Alerta cerrada', 'info');
        }
    },

    // Actualizar alertas
    refreshAlerts: () => {
        // Simular actualización
        alerts.showNotification('Alertas actualizadas', 'success');
        alerts.updateSummary();
        alerts.renderActiveAlerts();
        alerts.renderAlertsHistory();
    },

    // Exportar alertas
    exportAlerts: () => {
        const filteredAlerts = alerts.filterAlerts();
        if (filteredAlerts.length > 0) {
            alerts.showNotification('Exportando alertas seleccionadas', 'info');
        } else {
            alerts.showNotification('No hay alertas para exportar', 'warning');
        }
    },

    // Ver todas las alertas
    viewAllAlerts: () => {
        alerts.state.filters.status = 'all';
        document.getElementById('alertStatus').value = 'all';
        alerts.renderActiveAlerts();
        alerts.renderAlertsHistory();
    },

    // Mostrar notificación
    showNotification: (message, type = 'info') => {
        // Implementar sistema de notificaciones
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', alerts.init); 