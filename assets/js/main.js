// Utilidades
const utils = {
    // Validación de email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validación de contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
    isValidPassword: (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    },

    // Formateo de fecha
    formatDate: (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },

    // Mostrar notificación
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    // Confirmación de acción
    confirmAction: (message) => {
        return new Promise((resolve) => {
            const result = window.confirm(message);
            resolve(result);
        });
    },

    // Manejo de errores
    handleError: (error) => {
        console.error('Error:', error);
        utils.showNotification(
            error.message || 'Ha ocurrido un error inesperado',
            'error'
        );
    }
};

// Manejo de sesión
const session = {
    // Verificar si hay una sesión activa
    isAuthenticated: () => {
        return localStorage.getItem('authToken') !== null;
    },

    // Redirigir si no hay sesión
    requireAuth: () => {
        if (!session.isAuthenticated()) {
            window.location.href = '/pages/auth/login.html';
        }
    },

    // Redirigir si hay sesión
    redirectIfAuthenticated: () => {
        if (session.isAuthenticated()) {
            window.location.href = '/pages/dashboard/dashboard.html';
        }
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/pages/auth/login.html';
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Manejar botones de logout
    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            utils.confirmAction('¿Estás seguro de que deseas cerrar sesión?')
                .then(confirmed => {
                    if (confirmed) {
                        session.logout();
                    }
                });
        });
    });

    // Verificar autenticación en páginas protegidas
    if (document.body.dataset.requiresAuth === 'true') {
        session.requireAuth();
    }

    // Redirigir si ya está autenticado (en páginas de auth)
    if (document.body.dataset.authPage === 'true') {
        session.redirectIfAuthenticated();
    }
});

// Exportar utilidades para uso en otros módulos
window.utils = utils;
window.session = session; 