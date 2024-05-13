const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./database');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet'); //Strict-transport-security'
const session = require('express-session');
const passport = require('passport');
const store = new session.MemoryStore();
const app = express();
const path = require('path'); 
const { hashPassword } = require('./utils/passwordUtils');

// Configurar el motor de plantillas y la ubicación de las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




app.use(helmet());
app.use(morgan('combined'));  // Guarda log de las solicitudes


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const PORT = process.env.PORT || 4001;

app.use(session({
    secret: process.env.SESSION_SECRET ,
    cookie: { maxAge: 86400000, secure: true },
    resave: false,
    saveUninitialized: false,
    store
}));


app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubdomains');
    res.setHeader('Content-Security-Policy', "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'self' https://cdn.jsdelivr.net");
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', "geolocation=(self 'https://api-mysql-duoc.onrender.com')");
    res.setHeader('Content-Security-Policy', "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net");
    next();
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

        // Redireccionar al usuario a la página de inicio de sesión
        res.redirect(307, "/login");  
        } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: "Ocurrió un error al registrar el usuario" });
    }
});

// Ruta para servir el archivo login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});



// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);

});

