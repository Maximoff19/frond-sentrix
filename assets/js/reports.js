// Gestión de Reportes
const reports = {
    // Estado
    state: {
        reports: [
            {
                id: 1,
                name: 'Asistencia Diaria',
                type: 'diario',
                date: '2024-03-20',
                status: 'completado',
                description: 'Reporte de asistencia del personal para el día actual',
                generatedBy: 'Sistema',
                downloadUrl: '#'
            },
            {
                id: 2,
                name: 'Reporte Semanal',
                type: 'semanal',
                date: '2024-03-19',
                status: 'completado',
                description: 'Resumen semanal de actividades y eventos',
                generatedBy: 'Admin',
                downloadUrl: '#'
            },
            {
                id: 3,
                name: 'Análisis Mensual',
                type: 'mensual',
                date: '2024-03-15',
                status: 'completado',
                description: 'Análisis detallado de métricas mensuales',
                generatedBy: 'Sistema',
                downloadUrl: '#'
            },
            {
                id: 4,
                name: 'Incidentes',
                type: 'especial',
                date: '2024-03-18',
                status: 'pendiente',
                description: 'Registro de incidentes y alertas',
                generatedBy: 'Seguridad',
                downloadUrl: '#'
            },
            {
                id: 5,
                name: 'Horas Extras',
                type: 'semanal',
                date: '2024-03-17',
                status: 'completado',
                description: 'Control de horas extras del personal',
                generatedBy: 'RRHH',
                downloadUrl: '#'
            }
        ],
        filters: {
            type: 'all',
            dateRange: 'today',
            search: ''
        }
    },

    // Inicialización
    init: () => {
        reports.setupEventListeners();
        reports.renderReports();
        reports.renderRecentReports();
    },

    // Configurar event listeners
    setupEventListeners: () => {
        // Filtros
        const reportType = document.getElementById('reportType');
        const dateRange = document.getElementById('dateRange');
        const searchReport = document.getElementById('searchReport');

        if (reportType) {
            reportType.addEventListener('change', (e) => {
                reports.state.filters.type = e.target.value;
                reports.renderReports();
            });
        }

        if (dateRange) {
            dateRange.addEventListener('change', (e) => {
                reports.state.filters.dateRange = e.target.value;
                reports.renderReports();
            });
        }

        if (searchReport) {
            searchReport.addEventListener('input', (e) => {
                reports.state.filters.search = e.target.value;
                reports.renderReports();
            });
        }

        // Botones de acción
        const generateReportBtn = document.getElementById('generateReport');
        const refreshReportsBtn = document.getElementById('refreshReports');
        const exportReportsBtn = document.getElementById('exportReports');
        const viewAllReportsBtn = document.getElementById('viewAllReports');

        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => reports.showReportModal());
        }

        if (refreshReportsBtn) {
            refreshReportsBtn.addEventListener('click', () => reports.refreshReports());
        }

        if (exportReportsBtn) {
            exportReportsBtn.addEventListener('click', () => reports.exportReports());
        }

        if (viewAllReportsBtn) {
            viewAllReportsBtn.addEventListener('click', () => reports.viewAllReports());
        }

        // Modal
        const reportModal = document.getElementById('reportModal');
        const closeReportModal = document.getElementById('closeReportModal');
        const cancelReport = document.getElementById('cancelReport');
        const reportForm = document.getElementById('reportForm');

        if (closeReportModal) {
            closeReportModal.addEventListener('click', () => reports.hideReportModal());
        }

        if (cancelReport) {
            cancelReport.addEventListener('click', () => reports.hideReportModal());
        }

        if (reportForm) {
            reportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                reports.generateReport();
            });
        }

        // Cerrar modal al hacer clic fuera
        if (reportModal) {
            reportModal.addEventListener('click', (e) => {
                if (e.target === reportModal) {
                    reports.hideReportModal();
                }
            });
        }
    },

    // Renderizar reportes
    renderReports: () => {
        const reportsList = document.getElementById('reportsList');
        if (!reportsList) return;

        const filteredReports = reports.filterReports();
        
        reportsList.innerHTML = filteredReports.map(report => `
            <div class="report-card">
                <div class="report-header">
                    <h4>${report.name}</h4>
                    <span class="report-type">${report.type}</span>
                </div>
                <div class="report-body">
                    <p>${report.description}</p>
                    <div class="report-meta">
                        <span><i class="ri-calendar-line"></i> ${report.date}</span>
                        <span><i class="ri-user-line"></i> ${report.generatedBy}</span>
                    </div>
                </div>
                <div class="report-footer">
                    <span class="report-status ${report.status}">${report.status}</span>
                    <div class="report-actions">
                        <button class="btn btn-icon" title="Descargar" onclick="reports.downloadReport(${report.id})">
                            <i class="ri-download-line"></i>
                        </button>
                        <button class="btn btn-icon" title="Ver detalles" onclick="reports.viewReportDetails(${report.id})">
                            <i class="ri-eye-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // Renderizar reportes recientes
    renderRecentReports: () => {
        const recentReportsList = document.getElementById('recentReportsList');
        if (!recentReportsList) return;

        const recentReports = reports.state.reports
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        recentReportsList.innerHTML = recentReports.map(report => `
            <tr>
                <td>${report.name}</td>
                <td><span class="report-type">${report.type}</span></td>
                <td>${report.date}</td>
                <td><span class="report-status ${report.status}">${report.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-icon" title="Descargar" onclick="reports.downloadReport(${report.id})">
                            <i class="ri-download-line"></i>
                        </button>
                        <button class="btn btn-icon" title="Ver detalles" onclick="reports.viewReportDetails(${report.id})">
                            <i class="ri-eye-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // Filtrar reportes
    filterReports: () => {
        return reports.state.reports.filter(report => {
            const typeMatch = reports.state.filters.type === 'all' || report.type === reports.state.filters.type;
            const searchMatch = report.name.toLowerCase().includes(reports.state.filters.search.toLowerCase()) ||
                              report.description.toLowerCase().includes(reports.state.filters.search.toLowerCase());
            
            let dateMatch = true;
            if (reports.state.filters.dateRange !== 'all') {
                const reportDate = new Date(report.date);
                const today = new Date();
                
                switch (reports.state.filters.dateRange) {
                    case 'today':
                        dateMatch = reportDate.toDateString() === today.toDateString();
                        break;
                    case 'week':
                        const weekAgo = new Date(today.setDate(today.getDate() - 7));
                        dateMatch = reportDate >= weekAgo;
                        break;
                    case 'month':
                        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                        dateMatch = reportDate >= monthAgo;
                        break;
                }
            }
            
            return typeMatch && searchMatch && dateMatch;
        });
    },

    // Mostrar modal de generación de reporte
    showReportModal: () => {
        const modal = document.getElementById('reportModal');
        if (modal) {
            modal.classList.add('show');
            document.getElementById('reportDate').valueAsDate = new Date();
        }
    },

    // Ocultar modal
    hideReportModal: () => {
        const modal = document.getElementById('reportModal');
        if (modal) {
            modal.classList.remove('show');
            document.getElementById('reportForm').reset();
        }
    },

    // Generar nuevo reporte
    generateReport: () => {
        const name = document.getElementById('reportName').value;
        const type = document.getElementById('reportTypeModal').value;
        const date = document.getElementById('reportDate').value;
        const description = document.getElementById('reportDescription').value;

        const newReport = {
            id: reports.state.reports.length + 1,
            name,
            type,
            date,
            status: 'pendiente',
            description,
            generatedBy: 'Usuario Actual',
            downloadUrl: '#'
        };

        reports.state.reports.unshift(newReport);
        reports.renderReports();
        reports.renderRecentReports();
        reports.hideReportModal();
        reports.showNotification('Reporte generado correctamente', 'success');
    },

    // Descargar reporte
    downloadReport: (id) => {
        const report = reports.state.reports.find(r => r.id === id);
        if (report) {
            // Simular descarga
            reports.showNotification(`Descargando reporte: ${report.name}`, 'info');
        }
    },

    // Ver detalles del reporte
    viewReportDetails: (id) => {
        const report = reports.state.reports.find(r => r.id === id);
        if (report) {
            // Implementar vista detallada
            reports.showNotification(`Viendo detalles de: ${report.name}`, 'info');
        }
    },

    // Actualizar reportes
    refreshReports: () => {
        // Simular actualización
        reports.showNotification('Reportes actualizados', 'success');
        reports.renderReports();
        reports.renderRecentReports();
    },

    // Exportar reportes
    exportReports: () => {
        const filteredReports = reports.filterReports();
        if (filteredReports.length > 0) {
            reports.showNotification('Exportando reportes seleccionados', 'info');
        } else {
            reports.showNotification('No hay reportes para exportar', 'warning');
        }
    },

    // Ver todos los reportes
    viewAllReports: () => {
        reports.state.filters.dateRange = 'all';
        document.getElementById('dateRange').value = 'all';
        reports.renderReports();
    },

    // Mostrar notificación
    showNotification: (message, type = 'info') => {
        // Implementar sistema de notificaciones
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', reports.init); 