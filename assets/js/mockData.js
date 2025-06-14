// Datos simulados centralizados para Sentrix

const mockData = {
    // Personal
    workers: [
        // 65 activos
        ...Array.from({ length: 65 }, (_, i) => ({
            id: `P${(i+1).toString().padStart(3, '0')}`,
            name: `Trabajador ${i+1}`,
            department: ['Administración', 'TI', 'Recursos Humanos', 'Seguridad', 'Mantenimiento'][i % 5],
            status: 'activo',
            lastAccess: `2024-03-20T10:${(10 + i % 50).toString().padStart(2, '0')}:00`
        })),
        // 13 inactivos
        ...Array.from({ length: 13 }, (_, i) => ({
            id: `P${(i+66).toString().padStart(3, '0')}`,
            name: `Trabajador ${i+66}`,
            department: ['Administración', 'TI', 'Recursos Humanos', 'Seguridad', 'Mantenimiento'][i % 5],
            status: 'inactivo',
            lastAccess: `2024-03-19T18:${(i % 60).toString().padStart(2, '0')}:00`
        }))
    ],
    // Zonas
    zones: [
        {
            id: "Z001",
            name: "Entrada Principal",
            type: "acceso",
            status: "activa",
            occupancy: 12,
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
            occupancy: 8,
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
            occupancy: 6,
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
        },
        {
            id: "Z009",
            name: "Oficinas Administrativas",
            type: "acceso",
            status: "activa",
            occupancy: 10,
            capacity: 40,
            lastUpdate: "2024-03-20T10:10:00",
            location: "Edificio D, Piso 2",
            description: "Oficinas para personal administrativo",
            accessLevel: "general",
            restrictions: ["Horario: 8:00-18:00"],
            devices: ["Cámara Fija CF-009"],
            alerts: []
        },
        {
            id: "Z010",
            name: "Cafetería",
            type: "monitoreo",
            status: "activa",
            occupancy: 15,
            capacity: 60,
            lastUpdate: "2024-03-20T10:40:00",
            location: "Edificio E, Planta Baja",
            description: "Cafetería para empleados",
            accessLevel: "general",
            restrictions: ["Horario: 7:00-20:00"],
            devices: ["Cámara Fija CF-010"],
            alerts: []
        },
        {
            id: "Z011",
            name: "Estacionamiento",
            type: "acceso",
            status: "activa",
            occupancy: 5,
            capacity: 80,
            lastUpdate: "2024-03-20T10:00:00",
            location: "Exterior",
            description: "Estacionamiento para empleados y visitantes",
            accessLevel: "general",
            restrictions: ["Acceso con tarjeta"],
            devices: ["Cámara PTZ-011"],
            alerts: []
        },
        {
            id: "Z012",
            name: "Vestuarios",
            type: "monitoreo",
            status: "activa",
            occupancy: 0,
            capacity: 20,
            lastUpdate: "2024-03-20T09:50:00",
            location: "Edificio F, Planta Baja",
            description: "Vestuarios para personal",
            accessLevel: "general",
            restrictions: ["Horario: 6:00-22:00"],
            devices: ["Cámara Fija CF-012"],
            alerts: []
        }
    ],
    // Reportes
    reports: [
        { id: 'R001', name: 'Reporte Diario', type: 'asistencia', date: '2024-03-20', status: 'completado', generatedBy: 'Ana Torres', downloadUrl: '#' },
        { id: 'R002', name: 'Reporte Semanal', type: 'actividad', date: '2024-03-18', status: 'pendiente', generatedBy: 'Luis Gómez', downloadUrl: '#' },
        { id: 'R003', name: 'Reporte Mensual', type: 'asistencia', date: '2024-03-01', status: 'completado', generatedBy: 'María López', downloadUrl: '#' }
    ],
    // Alertas
    alerts: [
        { id: 'A001', type: 'acceso', message: 'Acceso no autorizado detectado en Área de Servidores', severity: 'alta', status: 'activa', time: '2024-03-20T09:30:00', location: 'Área de Servidores' },
        { id: 'A002', type: 'sistema', message: 'Temperatura elevada en Laboratorio', severity: 'media', status: 'activa', time: '2024-03-20T08:45:00', location: 'Laboratorio' },
        { id: 'A003', type: 'mantenimiento', message: 'Mantenimiento programado en Gimnasio', severity: 'baja', status: 'activa', time: '2024-03-19T17:00:00', location: 'Gimnasio' }
    ]
}; 