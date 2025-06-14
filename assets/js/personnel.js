// Gestión de Personal
const personnel = {
    // Estado
    state: {
        workers: [],
        filteredWorkers: [],
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
        searchTerm: '',
        departmentFilter: 'all',
        statusFilter: 'all',
        editingWorker: null
    },

    // Inicialización
    init: () => {
        personnel.loadUserData();
        personnel.loadWorkers();
        personnel.setupEventListeners();
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
        // Búsqueda
        const searchInput = document.getElementById('searchWorker');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => {
                personnel.state.searchTerm = e.target.value;
                personnel.filterWorkers();
            }, 300));
        }

        // Filtros
        const departmentFilter = document.getElementById('departmentFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (departmentFilter) {
            departmentFilter.addEventListener('change', (e) => {
                personnel.state.departmentFilter = e.target.value;
                personnel.filterWorkers();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                personnel.state.statusFilter = e.target.value;
                personnel.filterWorkers();
            });
        }

        // Paginación
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (personnel.state.currentPage > 1) {
                    personnel.state.currentPage--;
                    personnel.updateTable();
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                if (personnel.state.currentPage < personnel.state.totalPages) {
                    personnel.state.currentPage++;
                    personnel.updateTable();
                }
            });
        }

        // Botón agregar trabajador
        const addWorkerBtn = document.getElementById('addWorkerBtn');
        if (addWorkerBtn) {
            addWorkerBtn.addEventListener('click', () => {
                personnel.openWorkerModal();
            });
        }

        // Formulario de trabajador
        const workerForm = document.getElementById('workerForm');
        if (workerForm) {
            workerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                personnel.saveWorker();
            });
        }

        // Modales
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            const cancelBtn = modal.querySelector('.modal-cancel');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    personnel.closeModal(modal);
                });
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    personnel.closeModal(modal);
                });
            }
        });

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            modals.forEach(modal => {
                if (e.target === modal) {
                    personnel.closeModal(modal);
                }
            });
        });
    },

    // Cargar trabajadores
    loadWorkers: async () => {
        try {
            // Simular carga de datos
            await personnel.simulateDataLoad();
            personnel.filterWorkers();
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Simular carga de datos (para demo)
    simulateDataLoad: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                personnel.state.workers = [
                    {
                        id: '001',
                        name: 'Juan Pérez',
                        email: 'juan.perez@empresa.com',
                        department: 'prod',
                        position: 'Operador',
                        schedule: 'morning',
                        access: 'basic',
                        status: 'active',
                        lastAccess: '2024-03-15 08:30'
                    },
                    {
                        id: '002',
                        name: 'María García',
                        email: 'maria.garcia@empresa.com',
                        department: 'admin',
                        position: 'Supervisora',
                        schedule: 'morning',
                        access: 'supervisor',
                        status: 'active',
                        lastAccess: '2024-03-15 08:15'
                    },
                    {
                        id: '003',
                        name: 'Carlos López',
                        email: 'carlos.lopez@empresa.com',
                        department: 'mant',
                        position: 'Técnico',
                        schedule: 'afternoon',
                        access: 'basic',
                        status: 'inactive',
                        lastAccess: '2024-03-14 16:45'
                    }
                ];
                resolve();
            }, 1000);
        });
    },

    // Filtrar trabajadores
    filterWorkers: () => {
        let filtered = [...personnel.state.workers];

        // Aplicar búsqueda
        if (personnel.state.searchTerm) {
            const search = personnel.state.searchTerm.toLowerCase();
            filtered = filtered.filter(worker => 
                worker.name.toLowerCase().includes(search) ||
                worker.id.toLowerCase().includes(search) ||
                worker.email.toLowerCase().includes(search)
            );
        }

        // Aplicar filtro de departamento
        if (personnel.state.departmentFilter !== 'all') {
            filtered = filtered.filter(worker => 
                worker.department === personnel.state.departmentFilter
            );
        }

        // Aplicar filtro de estado
        if (personnel.state.statusFilter !== 'all') {
            filtered = filtered.filter(worker => 
                worker.status === personnel.state.statusFilter
            );
        }

        personnel.state.filteredWorkers = filtered;
        personnel.state.currentPage = 1;
        personnel.state.totalPages = Math.ceil(filtered.length / personnel.state.itemsPerPage);
        personnel.updateTable();
    },

    // Actualizar tabla
    updateTable: () => {
        const tbody = document.getElementById('workersTableBody');
        if (!tbody) return;

        const start = (personnel.state.currentPage - 1) * personnel.state.itemsPerPage;
        const end = start + personnel.state.itemsPerPage;
        const pageWorkers = personnel.state.filteredWorkers.slice(start, end);

        if (pageWorkers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="ri-user-search-line"></i>
                        <p>No se encontraron trabajadores</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = pageWorkers.map(worker => `
            <tr>
                <td>${worker.id}</td>
                <td>${worker.name}</td>
                <td>${personnel.getDepartmentName(worker.department)}</td>
                <td>
                    <span class="status-badge ${worker.status}">
                        ${worker.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>${worker.lastAccess}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-icon" onclick="personnel.editWorker('${worker.id}')" title="Editar">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="btn btn-icon" onclick="personnel.toggleWorkerStatus('${worker.id}')" title="${worker.status === 'active' ? 'Desactivar' : 'Activar'}">
                            <i class="ri-${worker.status === 'active' ? 'user-unfollow-line' : 'user-follow-line'}"></i>
                        </button>
                        <button class="btn btn-icon danger" onclick="personnel.deleteWorker('${worker.id}')" title="Eliminar">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Actualizar paginación
        personnel.updatePagination();
    },

    // Actualizar paginación
    updatePagination: () => {
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const currentPageSpan = document.getElementById('currentPage');
        const totalPagesSpan = document.getElementById('totalPages');

        if (prevPageBtn) {
            prevPageBtn.disabled = personnel.state.currentPage === 1;
        }

        if (nextPageBtn) {
            nextPageBtn.disabled = personnel.state.currentPage === personnel.state.totalPages;
        }

        if (currentPageSpan) {
            currentPageSpan.textContent = personnel.state.currentPage;
        }

        if (totalPagesSpan) {
            totalPagesSpan.textContent = personnel.state.totalPages;
        }
    },

    // Obtener nombre del departamento
    getDepartmentName: (department) => {
        const departments = {
            admin: 'Administración',
            prod: 'Producción',
            mant: 'Mantenimiento'
        };
        return departments[department] || department;
    },

    // Abrir modal de trabajador
    openWorkerModal: (worker = null) => {
        const modal = document.getElementById('workerModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('workerForm');

        if (!modal || !modalTitle || !form) return;

        personnel.state.editingWorker = worker;
        modalTitle.textContent = worker ? 'Editar Trabajador' : 'Agregar Trabajador';

        // Resetear formulario
        form.reset();

        if (worker) {
            // Llenar formulario con datos del trabajador
            document.getElementById('workerId').value = worker.id;
            document.getElementById('workerName').value = worker.name;
            document.getElementById('workerEmail').value = worker.email;
            document.getElementById('workerDepartment').value = worker.department;
            document.getElementById('workerPosition').value = worker.position;
            document.getElementById('workerSchedule').value = worker.schedule;
            document.getElementById('workerAccess').value = worker.access;
        }

        modal.classList.add('show');
    },

    // Cerrar modal
    closeModal: (modal) => {
        modal.classList.remove('show');
        personnel.state.editingWorker = null;
    },

    // Guardar trabajador
    saveWorker: async () => {
        try {
            const form = document.getElementById('workerForm');
            if (!form) return;

            const workerData = {
                id: document.getElementById('workerId').value || utils.generateId(),
                name: document.getElementById('workerName').value,
                email: document.getElementById('workerEmail').value,
                department: document.getElementById('workerDepartment').value,
                position: document.getElementById('workerPosition').value,
                schedule: document.getElementById('workerSchedule').value,
                access: document.getElementById('workerAccess').value,
                status: 'active',
                lastAccess: utils.formatDate(new Date())
            };

            // Validar datos
            if (!personnel.validateWorkerData(workerData)) {
                return;
            }

            // Simular guardado
            await personnel.simulateSaveWorker(workerData);

            // Actualizar lista
            if (personnel.state.editingWorker) {
                const index = personnel.state.workers.findIndex(w => w.id === workerData.id);
                if (index !== -1) {
                    personnel.state.workers[index] = workerData;
                }
            } else {
                personnel.state.workers.push(workerData);
            }

            // Cerrar modal y actualizar tabla
            personnel.closeModal(document.getElementById('workerModal'));
            personnel.filterWorkers();
            utils.showNotification(
                `Trabajador ${personnel.state.editingWorker ? 'actualizado' : 'agregado'} exitosamente`,
                'success'
            );
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Validar datos del trabajador
    validateWorkerData: (data) => {
        if (!data.name || !data.email || !data.department || !data.position) {
            utils.showNotification('Por favor, completa todos los campos requeridos', 'error');
            return false;
        }

        if (!utils.validateEmail(data.email)) {
            utils.showNotification('Por favor, ingresa un correo electrónico válido', 'error');
            return false;
        }

        return true;
    },

    // Simular guardado de trabajador (para demo)
    simulateSaveWorker: (workerData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular error si el email ya existe
                const emailExists = personnel.state.workers.some(
                    w => w.email === workerData.email && w.id !== workerData.id
                );
                
                if (emailExists) {
                    reject(new Error('Este correo electrónico ya está registrado'));
                } else {
                    resolve(workerData);
                }
            }, 1000);
        });
    },

    // Editar trabajador
    editWorker: (id) => {
        const worker = personnel.state.workers.find(w => w.id === id);
        if (worker) {
            personnel.openWorkerModal(worker);
        }
    },

    // Cambiar estado del trabajador
    toggleWorkerStatus: async (id) => {
        try {
            const worker = personnel.state.workers.find(w => w.id === id);
            if (!worker) return;

            const newStatus = worker.status === 'active' ? 'inactive' : 'active';
            const action = newStatus === 'active' ? 'activar' : 'desactivar';

            const confirmed = await utils.confirmAction(
                `¿Estás seguro de que deseas ${action} a ${worker.name}?`
            );

            if (confirmed) {
                // Simular actualización
                await personnel.simulateUpdateWorkerStatus(id, newStatus);

                // Actualizar estado
                worker.status = newStatus;
                personnel.filterWorkers();

                utils.showNotification(
                    `Trabajador ${action}do exitosamente`,
                    'success'
                );
            }
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Simular actualización de estado (para demo)
    simulateUpdateWorkerStatus: (id, newStatus) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 500);
        });
    },

    // Eliminar trabajador
    deleteWorker: async (id) => {
        try {
            const worker = personnel.state.workers.find(w => w.id === id);
            if (!worker) return;

            const confirmed = await utils.confirmAction(
                `¿Estás seguro de que deseas eliminar a ${worker.name}? Esta acción no se puede deshacer.`
            );

            if (confirmed) {
                // Simular eliminación
                await personnel.simulateDeleteWorker(id);

                // Eliminar de la lista
                personnel.state.workers = personnel.state.workers.filter(w => w.id !== id);
                personnel.filterWorkers();

                utils.showNotification('Trabajador eliminado exitosamente', 'success');
            }
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Simular eliminación de trabajador (para demo)
    simulateDeleteWorker: (id) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 500);
        });
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', personnel.init); 