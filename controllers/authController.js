const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../utils/databaseUtils');
const { hashPassword } = require('../utils/passwordUtils');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoSuperSeguro';

async function login(req, res) {
    const email = req.headers['x-email'];
    const password = req.headers['x-password'];

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Autenticación exitosa", token });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        res.status(500).json({ error: "Ocurrió un error durante el inicio de sesión" });
    }
};


async function register(req, res) {
    const email = req.headers['x-email'];
    const password = req.headers['x-password'];

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const query = 'INSERT INTO Usuarios (email, password) VALUES (?, ?)';
        await pool.query(query, [email, hashedPassword]);

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: "Ocurrió un error al registrar el usuario" });
    }
}

async function logout(req, res) {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Ocurrió un error al cerrar sesión' });
        }
        // Si la sesión se cerró correctamente, redirige al usuario a: ...
        res.redirect('/login');
    });
}


module.exports = {
    login,
    register,
    logout
};
