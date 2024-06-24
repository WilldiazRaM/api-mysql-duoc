const express = require('express');
const app = express();
const helmet = require('helmet');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('./config/passportConfig');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pagosRouter = require('./routes/pagosRoutes');
const historialesRoutes = require('./routes/historialRoutes');
const carritoRouter = require('./routes/carritoRouters');
const { isAuthenticated } = require('./utils/authUtils');
const jwt = require('jsonwebtoken');
const securityHeaders = require('./config/securityHeaders');
const pool = require('./database');
const { sqlInjectionFilter } = require('./middleware/sqlInjectionFilter');

const PORT = process.env.PORT || 4001;

// Middleware de seguridad
app.use(helmet());
app.use(securityHeaders);

// Middleware de logging y parsing
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de filtrado de inyecciones SQL
app.use(sqlInjectionFilter);

// Configuración de sesiones con PostgreSQL
app.use(session({
    store: new pgSession({
        pool: pool,                // Conexión a la base de datos
        tableName: 'session'       // Nombre de la tabla de sesiones
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000, secure: process.env.NODE_ENV === 'production' }
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
                console.error('JWT Verification Error:', err);
                return res.redirect('/auth/login');
            }
            
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
