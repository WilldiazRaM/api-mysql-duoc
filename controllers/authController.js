const jwt = require('jsonwebtoken');
const { createUser, authenticateUser } = require('../utils/databaseUtils');
const { hashPassword } = require('../utils/passwordUtils');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoSuperSeguro';

async function login(req, res) {
    const email = req.headers['x-email'];
    const password = req.headers['x-password'];

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Autenticación exitosa", token });
        } else {
            res.status(401).json({ error: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        res.status(500).json({ error: "Ocurrió un error durante el inicio de sesión" });
    }
}

async function register(req, res) {
    const nombre = req.headers['x-nombre'];
    const email = req.headers['x-email'];
    const password = req.headers['x-password'];
    const role = req.headers['x-role'];

    console.log('Headers recibidos:', { nombre, email, password, role });

    if (!nombre || !email || !password || !role) {
        return res.status(400).json({ error: "Nombre, email, contraseña y rol son requeridos" });
    }

    try {
        const hashedPassword = await hashPassword(password);
        console.log('Contraseña hash generada:', hashedPassword);
        await createUser(nombre, email, hashedPassword, role);
        console.log('Usuario registrado:', { nombre, email, hashedPassword, role });
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        if (error.code === '23505') {
            return res.status(409).json({ error: "El correo electrónico ya está en uso" });
        }
        res.status(500).json({ error: "Ocurrió un error al registrar el usuario" });
    }
}


async function logout(req, res) {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Ocurrió un error al cerrar sesión' });
        }
        res.redirect('/auth/login');
        return res.status(200).json({ msg: 'Sesión Cerrada Correctamente'});
    });
}

module.exports = {
    login,
    register,
    logout
};
