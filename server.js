const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./database');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet'); //Strict-transport-security'
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./routes/passportConfig');
const { createUser } = require('./utils/databaseUtils');
const store = new session.MemoryStore();
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const app = express();
const path = require('path'); 
const { hashPassword } = require('./utils/passwordUtils');


// Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

app.use(helmet());
app.use(morgan('combined'));  // Guarda log de las solicitudes


// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());



const PORT = process.env.PORT || 4001;

app.use(session({
    secret: process.env.SESSION_SECRET ,
    cookie: { maxAge: 86400000, secure: true },
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubdomains');
    next();
});

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'self' https://cdn.jsdelivr.net");
    next();
});


app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
});

app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', "geolocation=(self 'https://api-mysql-duoc.onrender.com')");
    next();
  });


app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net");
    next();
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Buscar al usuario por su correo electrónico
        const user = await findByEmail(email);

        // Verificar si se encontró al usuario
        if (!user) {
            // Si el usuario no existe, redirigir al formulario de inicio de sesión
            return res.redirect("/login");
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // Si la contraseña no coincide, redirigir al formulario de inicio de sesión
            return res.redirect("/login");
        }

        // Si la autenticación es exitosa, renderizar el perfil del usuario
        res.render("profile", { user });
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        res.status(500).json({ error: "Ocurrió un error durante el inicio de sesión" });
    }
});


app.get('/profile', (req, res) => {
    res.render('profile', { user: req.user }); 
});

app.post('/registrar', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validar la contraseña
        if (!password) {
            console.error("La contraseña no puede estar vacía");
            return res.status(400).json({ error: "La contraseña no puede estar vacía" });
        }

        // Generar hash de la contraseña
        const hashedPassword = await hashPassword(password);

        // Insertar usuario en la base de datos
        const query = 'INSERT INTO Usuarios (email, password) VALUES (?, ?)';
        await pool.query(query, [email, hashedPassword]);

        // Redireccionar al usuario a la página de inicio de sesión
        res.redirect("/login");
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: "Ocurrió un error al registrar el usuario" });
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})









app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);

});

