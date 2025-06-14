// Página de inicio
const home = {
    // Estado
    state: {
        totalWorkers: 78,
        activeWorkers: 65,
        activeAlerts: 3,
        activeZones: 12,
        features: {
            monitoring: { 
                status: 'active', 
                alerts: 0,
                lastUpdate: '2024-03-20T10:30:00',
                activeSessions: 65
            },
            personnel: { 
                status: 'active', 
                total: 78, 
                active: 65,
                departments: [
                    { name: 'Administración', count: 12 },
                    { name: 'Producción', count: 35 },
                    { name: 'Mantenimiento', count: 18 },
                    { name: 'Seguridad', count: 13 }
                ]
            },
            reports: { 
                status: 'active', 
                available: 5,
                recent: [
                    { id: 1, name: 'Asistencia Diaria', type: 'diario', date: '2024-03-20' },
                    { id: 2, name: 'Reporte Semanal', type: 'semanal', date: '2024-03-19' },
                    { id: 3, name: 'Análisis Mensual', type: 'mensual', date: '2024-03-15' },
                    { id: 4, name: 'Incidentes', type: 'especial', date: '2024-03-18' },
                    { id: 5, name: 'Horas Extras', type: 'semanal', date: '2024-03-17' }
                ]
            },
            alerts: { 
                status: 'alert', 
                count: 3,
                active: [
                    { id: 1, type: 'acceso', message: 'Acceso no autorizado en Zona A-3', time: '10:15', severity: 'alta' },
                    { id: 2, type: 'presencia', message: 'Personal detectado en zona restringida B-2', time: '09:45', severity: 'media' },
                    { id: 3, type: 'sistema', message: 'Error en sistema de monitoreo', time: '08:30', severity: 'baja' }
                ]
            },
            zones: { 
                status: 'active', 
                total: 15, 
                active: 12,
                restricted: 3,
                details: [
                    { id: 'A-1', name: 'Oficinas', status: 'activa', occupancy: 85 },
                    { id: 'A-2', name: 'Sala de Reuniones', status: 'activa', occupancy: 40 },
                    { id: 'A-3', name: 'Archivo', status: 'restringida', occupancy: 0 },
                    { id: 'B-1', name: 'Producción', status: 'activa', occupancy: 95 },
                    { id: 'B-2', name: 'Almacén', status: 'restringida', occupancy: 0 },
                    { id: 'B-3', name: 'Taller', status: 'activa', occupancy: 75 },
                    { id: 'C-1', name: 'Laboratorio', status: 'activa', occupancy: 60 },
                    { id: 'C-2', name: 'Sala de Control', status: 'activa', occupancy: 90 },
                    { id: 'C-3', name: 'Servidores', status: 'restringida', occupancy: 0 },
                    { id: 'D-1', name: 'Cafetería', status: 'activa', occupancy: 30 },
                    { id: 'D-2', name: 'Vestuarios', status: 'activa', occupancy: 45 },
                    { id: 'D-3', name: 'Gimnasio', status: 'activa', occupancy: 20 },
                    { id: 'E-1', name: 'Estacionamiento', status: 'activa', occupancy: 70 },
                    { id: 'E-2', name: 'Recepción', status: 'activa', occupancy: 50 },
                    { id: 'E-3', name: 'Seguridad', status: 'activa', occupancy: 100 }
                ]
            },
            settings: { 
                status: 'active',
                notifications: true,
                autoRefresh: true,
                theme: 'light',
                language: 'es'
            }
        },
        recentActivity: []
    },

    // Inicialización
    init: () => {
        home.loadUserData();
        home.setupEventListeners();
        home.updateUI();
        home.loadRecentActivity();
    },

    // Cargar datos del usuario
    loadUserData: () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            document.getElementById('userName').textContent = userData.name || 'Usuario';
        }
    },

    // Configurar event listeners
    setupEventListeners: () => {
        // Botón de actualizar
        const refreshButton = document.getElementById('refreshData');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => home.refreshData());
        }

        // Botón de ver toda la actividad
        const viewAllButton = document.getElementById('viewAllActivity');
        if (viewAllButton) {
            viewAllButton.addEventListener('click', () => home.viewAllActivity());
        }

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

        // Manejo de cierre de sesión
        const logoutButton = document.querySelector('[data-action="logout"]');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => home.handleLogout());
        }
    },

    updateUI: () => {
        // Actualizar resumen
        document.getElementById('totalWorkers').textContent = home.state.totalWorkers;
        document.getElementById('activeWorkers').textContent = home.state.activeWorkers;
        document.getElementById('activeAlerts').textContent = home.state.activeAlerts;
        document.getElementById('activeZones').textContent = home.state.activeZones;

        // Actualizar estado de las características
        home.updateFeatureStatus('monitoring', home.state.features.monitoring);
        home.updateFeatureStatus('personnel', home.state.features.personnel);
        home.updateFeatureStatus('reports', home.state.features.reports);
        home.updateFeatureStatus('alerts', home.state.features.alerts);
        home.updateFeatureStatus('zones', home.state.features.zones);
        home.updateFeatureStatus('settings', home.state.features.settings);
    },

    updateFeatureStatus: (feature, data) => {
        const card = document.querySelector(`[data-feature="${feature}"]`);
        if (!card) return;

        const statusElement = card.querySelector('.feature-status');
        if (!statusElement) return;

        if (data.status === 'alert') {
            card.classList.add('feature-alert');
            statusElement.textContent = `${data.count} Alertas Activas`;
            statusElement.setAttribute('data-status', 'alert');
        } else if (data.status === 'active') {
            card.classList.remove('feature-alert');
            let statusText = 'Activo';
            
            switch (feature) {
                case 'monitoring':
                    statusText = 'Operativo';
                    break;
                case 'personnel':
                    statusText = `${data.active}/${data.total} Activos`;
                    break;
                case 'reports':
                    statusText = `${data.available} Disponibles`;
                    break;
                case 'zones':
                    statusText = `${data.active}/${data.total} Activas`;
                    break;
                case 'settings':
                    statusText = 'Personalizable';
                    break;
            }
            
            statusElement.textContent = statusText;
            statusElement.setAttribute('data-status', 'active');
        }
    },

    loadRecentActivity: () => {
        // Simular carga de actividad reciente con más eventos
        home.state.recentActivity = [
            {
                type: 'alert',
                title: 'Nueva alerta de acceso no autorizado en Zona A-3',
                time: 'Hace 5 minutos',
                icon: 'ri-alarm-warning-line',
                severity: 'alta'
            },
            {
                type: 'personnel',
                title: 'María González ha iniciado sesión',
                time: 'Hace 8 minutos',
                icon: 'ri-user-follow-line'
            },
            {
                type: 'zone',
                title: 'Zona B-1 (Producción) ha alcanzado 95% de ocupación',
                time: 'Hace 15 minutos',
                icon: 'ri-map-pin-line'
            },
            {
                type: 'report',
                title: 'Reporte diario de asistencia generado',
                time: 'Hace 20 minutos',
                icon: 'ri-file-chart-line'
            },
            {
                type: 'alert',
                title: 'Personal detectado en zona restringida B-2',
                time: 'Hace 25 minutos',
                icon: 'ri-alarm-warning-line',
                severity: 'media'
            },
            {
                type: 'personnel',
                title: 'Carlos Rodríguez ha finalizado su turno',
                time: 'Hace 30 minutos',
                icon: 'ri-user-unfollow-line'
            },
            {
                type: 'zone',
                title: 'Actualización de permisos en Zona C-1',
                time: 'Hace 45 minutos',
                icon: 'ri-map-pin-line'
            },
            {
                type: 'system',
                title: 'Backup del sistema completado',
                time: 'Hace 1 hora',
                icon: 'ri-database-2-line'
            },
            {
                type: 'report',
                title: 'Análisis mensual de productividad disponible',
                time: 'Hace 2 horas',
                icon: 'ri-file-chart-line'
            },
            {
                type: 'alert',
                title: 'Error en sistema de monitoreo resuelto',
                time: 'Hace 3 horas',
                icon: 'ri-error-warning-line',
                severity: 'baja'
            }
        ];

        home.renderRecentActivity();
    },

    renderRecentActivity: () => {
        const activityList = document.getElementById('recentActivityList');
        if (!activityList) return;

        activityList.innerHTML = home.state.recentActivity.map(activity => `
            <div class="activity-item ${activity.severity ? `activity-${activity.severity}` : ''}">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    },

    refreshData: () => {
        // Simular actualización de datos
        home.state.activeWorkers = Math.floor(Math.random() * (home.state.totalWorkers - 20) + 20);
        home.state.activeAlerts = Math.floor(Math.random() * 3);
        home.state.features.alerts.count = home.state.activeAlerts;
        home.state.features.alerts.status = home.state.activeAlerts > 0 ? 'alert' : 'active';
        
        home.updateUI();
        home.showNotification('Datos actualizados correctamente', 'success');
    },

    viewAllActivity: () => {
        // Redirigir a la página de actividad
        window.location.href = '../reports/reports.html?view=activity';
    },

    handleLogout: () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        window.location.href = '/index.html';
    },

    showNotification: (message, type = 'info') => {
        // Implementar sistema de notificaciones si es necesario
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', home.init); 