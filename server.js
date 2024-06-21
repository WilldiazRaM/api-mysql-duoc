const express = require('express');
const app = express();
const helmet = require('helmet');
const session = require('express-session');
const store = new session.MemoryStore();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('./routes/passportConfig');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pagosRouter = require('./routes/pagosRoutes');
const historialesRoutes = require('./routes/historialRoutes');
const carritoRouter = require('./routes/carritoRouters');
const { isAuthenticated } = require('./utils/authUtils');
const jwt = require('jsonwebtoken');

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4001;

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 86400000, secure: process.env.NODE_ENV === 'production' }
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de EJS como motor de plantillas (puedes eliminar esta parte si no usas EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de seguridad
app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubdomains');
    res.setHeader('Content-Security-Policy', "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://kit.fontawesome.com;");
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', "geolocation=(self 'https://api-mysql-duoc.onrender.com')");
    next();
});

// Rutas
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/pagos', pagosRouter);
app.use('/historial-compras', historialesRoutes);
app.use('/carrito', carritoRouter);

// Ruta protegida para el perfil del usuario
app.get('/profile', isAuthenticated, (req, res) => {
    const token = req.query.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.redirect('/auth/login');
            }
            // En lugar de renderizar una vista, envía el archivo HTML estático
            res.sendFile(path.join(__dirname, 'public', 'login', 'profile.html'));
        });
    } else {
        res.redirect('/auth/login');
    }
});



// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
