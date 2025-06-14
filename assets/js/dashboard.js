// Dashboard
// Asegúrate de que mockData.js esté cargado antes que este archivo en el HTML
const dashboard = {
    // Estado inicial
    state: {
        workers: [],
        alerts: [],
        zones: [],
        selectedZone: 'all',
        chart: null
    },

    // Inicialización
    init: () => {
        dashboard.loadUserData();
        dashboard.loadDashboardData();
        dashboard.setupEventListeners();
        dashboard.initChart();
    },

    // Cargar datos del usuario
    loadUserData: () => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userNameElement = document.getElementById('userName');
        if (userNameElement && userData.name) {
            userNameElement.textContent = userData.name;
        }
    },

    // Configurar event listeners
    setupEventListeners: () => {
        // Menú de usuario
        const userMenuButton = document.getElementById('userMenuButton');
        const userDropdown = document.getElementById('userDropdown');
        if (userMenuButton && userDropdown) {
            userMenuButton.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
            });
            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
        // Filtro de zona
        const zoneFilter = document.getElementById('zoneFilter');
        if (zoneFilter) {
            zoneFilter.addEventListener('change', (e) => {
                dashboard.state.selectedZone = e.target.value;
                dashboard.updateWorkersList();
                dashboard.updateOccupancyMap();
            });
        }
        // Botón de actualizar
        const refreshButton = document.getElementById('refreshButton');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                dashboard.loadDashboardData();
                utils.showNotification('Datos actualizados', 'success');
            });
        }
        // Botón de descargar reporte
        const downloadButton = document.getElementById('downloadReport');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                dashboard.downloadDailyReport();
            });
        }
    },

    // Cargar datos del dashboard desde mockData
    loadDashboardData: () => {
        dashboard.state.workers = mockData.workers.filter(w => w.status === 'activo');
        dashboard.state.alerts = mockData.alerts.filter(a => a.status === 'activa');
        dashboard.state.zones = mockData.zones;
        dashboard.updateDashboardCards();
        dashboard.updateWorkersList();
        dashboard.updateOccupancyMap();
        dashboard.updateAlertsList();
        dashboard.updateChart();
    },

    // Actualizar tarjetas de resumen
    updateDashboardCards: () => {
        const presentWorkers = document.getElementById('presentWorkers');
        const activeAlerts = document.getElementById('activeAlerts');
        const occupancyRate = document.getElementById('occupancyRate');
        if (presentWorkers) {
            presentWorkers.textContent = dashboard.state.workers.length;
        }
        if (activeAlerts) {
            activeAlerts.textContent = dashboard.state.alerts.length;
        }
        if (occupancyRate) {
            // Ocupación promedio de todas las zonas activas
            const activeZones = dashboard.state.zones.filter(z => z.status === 'activa');
            const totalCapacity = activeZones.reduce((sum, z) => sum + z.capacity, 0);
            const totalOccupancy = activeZones.reduce((sum, z) => sum + z.occupancy, 0);
            const rate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
            occupancyRate.textContent = `${rate}%`;
        }
    },

    // Actualizar lista de trabajadores presentes
    updateWorkersList: () => {
        const workersList = document.getElementById('presentWorkersList');
        if (!workersList) return;
        const filteredWorkers = dashboard.state.workers; // Aquí podrías filtrar por zona si lo deseas
        if (filteredWorkers.length === 0) {
            workersList.innerHTML = `
                <div class="empty-state">
                    <i class="ri-user-search-line"></i>
                    <p>No hay trabajadores presentes</p>
                </div>
            `;
            return;
        }
        workersList.innerHTML = filteredWorkers.map(worker => `
            <div class="worker-item">
                <div class="worker-avatar">
                    <i class="ri-user-line"></i>
                </div>
                <div class="worker-info">
                    <div class="worker-name">${worker.name}</div>
                    <div class="worker-id">ID: ${worker.id} • Último acceso: ${dashboard.formatTime(worker.lastAccess)}</div>
                </div>
            </div>
        `).join('');
    },

    // Actualizar mapa de ocupación (placeholder)
    updateOccupancyMap: () => {
        const occupancyMap = document.getElementById('occupancyMap');
        if (!occupancyMap) return;
        occupancyMap.innerHTML = `
            <div class="map-placeholder">
                <i class="ri-map-2-line"></i>
                <p>Mapa de ocupación en desarrollo</p>
            </div>
        `;
    },

    // Actualizar lista de alertas
    updateAlertsList: () => {
        const alertsList = document.getElementById('recentAlerts');
        if (!alertsList) return;
        if (dashboard.state.alerts.length === 0) {
            alertsList.innerHTML = `
                <div class="empty-state">
                    <i class="ri-notification-off-line"></i>
                    <p>No hay alertas recientes</p>
                </div>
            `;
            return;
        }
        alertsList.innerHTML = dashboard.state.alerts.map(alert => `
            <div class="alert-item">
                <div class="alert-icon ${alert.severity}">
                    <i class="ri-alarm-warning-line"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.type}</div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${dashboard.formatTime(alert.time)}</div>
                </div>
            </div>
        `).join('');
    },

    // Inicializar gráfico (placeholder)
    initChart: () => {
        // Aquí podrías inicializar un gráfico real si lo deseas
    },

    // Actualizar gráfico (placeholder)
    updateChart: () => {},

    // Descargar reporte diario
    downloadDailyReport: () => {
        utils.showNotification('Funcionalidad en desarrollo', 'info');
    },

    // Formatear fecha/hora
    formatTime: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

document.addEventListener('DOMContentLoaded', dashboard.init); 