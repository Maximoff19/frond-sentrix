// Manejo de autenticación
const auth = {
    // Inicialización
    init: () => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            auth.setupLoginForm(loginForm);
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            auth.setupRegisterForm(registerForm);
        }

        const passwordResetForm = document.getElementById('passwordResetForm');
        if (passwordResetForm) {
            auth.setupPasswordResetForm(passwordResetForm);
        }

        // Configurar toggle de visibilidad de contraseña
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', auth.togglePasswordVisibility);
        });
    },

    // Configurar formulario de login
    setupLoginForm: (form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.email.value.trim();
            const password = form.password.value;
            
            // Validar campos
            if (!auth.validateLoginForm(email, password)) {
                return;
            }

            try {
                // Simular llamada a API
                await auth.login(email, password);
            } catch (error) {
                utils.handleError(error);
            }
        });
    },

    // Configurar formulario de registro
    setupRegisterForm: (form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const password = form.password.value;
            const confirmPassword = form.confirmPassword.value;
            
            // Validar campos
            if (!auth.validateRegisterForm(name, email, password, confirmPassword)) {
                return;
            }

            try {
                // Simular llamada a API
                await auth.simulateRegister(name, email, password);
                
                utils.showNotification(
                    'Registro exitoso. Por favor, inicia sesión.',
                    'success'
                );
                
                // Redirigir al login
                setTimeout(() => {
                    window.location.href = '/pages/auth/login.html';
                }, 2000);
            } catch (error) {
                utils.handleError(error);
            }
        });
    },

    // Configurar formulario de recuperación de contraseña
    setupPasswordResetForm: (form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.email.value.trim();
            
            // Validar email
            if (!utils.isValidEmail(email)) {
                document.getElementById('emailError').textContent = 
                    'Por favor, ingresa un correo electrónico válido';
                return;
            }

            try {
                // Simular llamada a API
                await auth.simulatePasswordReset(email);
                
                utils.showNotification(
                    'Se ha enviado un enlace de recuperación a tu correo electrónico',
                    'success'
                );
                
                // Redirigir al login
                setTimeout(() => {
                    window.location.href = '/pages/auth/login.html';
                }, 2000);
            } catch (error) {
                utils.handleError(error);
            }
        });
    },

    // Validar formulario de login
    validateLoginForm: (email, password) => {
        let isValid = true;
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');

        // Resetear mensajes de error
        emailError.textContent = '';
        passwordError.textContent = '';

        // Validar email
        if (!email) {
            emailError.textContent = 'El correo electrónico es requerido';
            isValid = false;
        } else if (!utils.isValidEmail(email)) {
            emailError.textContent = 'Por favor, ingresa un correo electrónico válido';
            isValid = false;
        }

        // Validar contraseña
        if (!password) {
            passwordError.textContent = 'La contraseña es requerida';
            isValid = false;
        }

        return isValid;
    },

    // Validar formulario de registro
    validateRegisterForm: (name, email, password, confirmPassword) => {
        let isValid = true;
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        // Resetear mensajes de error
        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';

        // Validar nombre
        if (!name) {
            nameError.textContent = 'El nombre es requerido';
            isValid = false;
        }

        // Validar email
        if (!email) {
            emailError.textContent = 'El correo electrónico es requerido';
            isValid = false;
        } else if (!utils.isValidEmail(email)) {
            emailError.textContent = 'Por favor, ingresa un correo electrónico válido';
            isValid = false;
        }

        // Validar contraseña
        if (!password) {
            passwordError.textContent = 'La contraseña es requerida';
            isValid = false;
        } else if (!utils.isValidPassword(password)) {
            passwordError.textContent = 
                'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
            isValid = false;
        }

        // Validar confirmación de contraseña
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Por favor, confirma tu contraseña';
            isValid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Las contraseñas no coinciden';
            isValid = false;
        }

        return isValid;
    },

    // Toggle visibilidad de contraseña
    togglePasswordVisibility: (e) => {
        const button = e.currentTarget;
        const input = button.parentElement.querySelector('input');
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        button.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    },

    // Simular login (para demo)
    simulateLogin: async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (email === 'demo@sentrix.com' && password === 'Demo123') {
            localStorage.setItem('authToken', 'demo-token');
            window.location.href = '/pages/home/home.html';
        } else {
            throw new Error("Credenciales incorrectas.");
        }
    },

    // Simular registro (para demo)
    simulateRegister: (name, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular email ya registrado
                if (email === 'demo@sentrix.com') {
                    reject(new Error('Este correo electrónico ya está registrado'));
                } else {
                    resolve();
                }
            }, 1000);
        });
    },

    // Simular recuperación de contraseña (para demo)
    simulatePasswordReset: (email) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular email no registrado
                if (email !== 'demo@sentrix.com') {
                    reject(new Error('No existe una cuenta con este correo electrónico'));
                } else {
                    resolve();
                }
            }, 1000);
        });
    },

    // Función de login
    login: async (email, password) => {
        try {
            // Simular validación de credenciales
            await auth.simulateLogin(email, password);

            // Guardar datos del usuario
            const userData = {
                name: 'Usuario Demo',
                email: email,
                role: 'admin'
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('authToken', 'demo-token');

            // Redirigir a la página de inicio
            window.location.href = '/pages/home/home.html';
        } catch (error) {
            throw error;
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', auth.init); 
