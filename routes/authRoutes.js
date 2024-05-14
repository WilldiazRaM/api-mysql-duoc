const pool = require('../database');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../utils/databaseUtils');
const { hashPassword, requireAuth } = require('../utils/passwordUtils');


const JWT_SECRET = process.env.JWT_SECRET || 'secretoSuperSeguro';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Autenticar al usuario
        const user = await authenticateUser(email, password);

        // Verificar si la autenticación fue exitosa
        if (user) {
            // Generar un token JWT
            const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            // Devolver el token como parte de la respuesta de inicio de sesión
            res.status(200).json({ message: "Autenticación exitosa", token });
        } else {
            // Si la autenticación falla, enviar un mensaje JSON con un mensaje de error
            res.status(401).json({ message: "Credenciales incorrectas" });
        }
    } catch (error) {
        // Manejar errores
        console.error("Error durante el inicio de sesión:", error);
        res.status(500).json({ error: "Ocurrió un error durante el inicio de sesión" });
    }
});


// Ruta protegida que requiere autenticación mediante token JWT
router.get('/profile', requireAuth(JWT_SECRET), (req, res) => {
    
    res.json({ message: "Perfil protegido", user: req.user });
});



router.post('/registrar', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Datos de la solicitud:", req.body);

        // Validar la contraseña
        if (!password) {
            console.error("La contraseña no puede estar vacía");
            return res.status(400).json({ error: "La contraseña no puede estar vacía" });
        }

        // Generar hash de la contraseña
        console.log("Generando hash de la contraseña...");
        const hashedPassword = await hashPassword(password);
        console.log("Hash de la contraseña generado:", hashedPassword);

        // Insertar usuario en la base de datos
        console.log("Insertando usuario en la base de datos...");
        const query = 'INSERT INTO Usuarios (email, password) VALUES (?, ?)';
        await pool.query(query, [email, hashedPassword]);
        console.log("Usuario insertado en la base de datos.");

        // Devolver un mensaje JSON de éxito
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: "Ocurrió un error al registrar el usuario" });
    }
});


router.get('/logout', requireAuth, (req, res) => {
    req.logout(); 
    res.redirect("/");
});


module.exports = router;