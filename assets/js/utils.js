// Utilidades
const utils = {
    // Mostrar notificación
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="ri-${type === 'success' ? 'check-line' : 
                           type === 'error' ? 'error-warning-line' : 
                           type === 'warning' ? 'alert-line' : 
                           'information-line'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="ri-close-line"></i>
            </button>
        `;

        // Agregar al DOM
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);

        // Configurar cierre automático
        const timeout = setTimeout(() => {
            utils.closeNotification(notification);
        }, 5000);

        // Configurar botón de cierre
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(timeout);
            utils.closeNotification(notification);
        });
    },

    // Cerrar notificación
    closeNotification: (notification) => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    },

    // Manejar errores
    handleError: (error) => {
        console.error('Error:', error);
        utils.showNotification(
            error.message || 'Ha ocurrido un error inesperado',
            'error'
        );
    },

    // Formatear fecha
    formatDate: (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },

    // Formatear número
    formatNumber: (number) => {
        return new Intl.NumberFormat('es-ES').format(number);
    },

    // Validar email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar contraseña
    validatePassword: (password) => {
        // Mínimo 8 caracteres, al menos una letra y un número
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return re.test(password);
    },

    // Generar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Verificar autenticación
    checkAuth: () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/pages/auth/login.html';
            return false;
        }
        return true;
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/pages/auth/login.html';
    },

    // Obtener parámetros de URL
    getUrlParams: () => {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params.entries()) {
            result[key] = value;
        }
        return result;
    },

    // Debounce
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle
    throttle: (func, limit) => {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}; 