const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../utils/databaseUtils');
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
}

async function register(req, res) {
    const { email, password } = req.body;
    try {
        if (!password) {
            return res.status(400).json({ error: "La contraseña no puede estar vacía" });
        }

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
    req.logout();
    res.redirect("/");
}

module.exports = {
    login,
    register,
    logout
};
