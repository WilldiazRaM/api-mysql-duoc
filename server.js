const express = require('express');
const app = express();
const helmet = require('helmet');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('./config/passportConfig');
const path = require('path');
const { sqlInjectionFilter } = require('./middleware/sqlInjectionFilter');
const { isAuthenticated } = require('./utils/authUtils');
const jwt = require('jsonwebtoken');
const securityHeaders = require('./config/securityHeaders');
const pool = require('./database');

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Security Middleware
app.use(helmet());
app.use(securityHeaders);

// Logging Middleware
app.use(morgan('combined'));

// Body Parser Middleware - must be before sqlInjectionFilter
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SQL Injection Filter Middleware
app.use(sqlInjectionFilter);

// PostgreSQL Session Configuration
app.use(session({
    store: new pgSession({
        pool: pool,                // Database connection
        tableName: 'session'       // Session table name
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000, secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routers
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pagosRouter = require('./routes/pagosRoutes');
const historialesRoutes = require('./routes/historialRoutes');
const carritoRouter = require('./routes/carritoRouters');
const ventasRoutes = require('./routes/ventasRouters');
const categoriasProductosRoutes = require('./routes/categoriasProductos');
const detalleVentaRoutes = require('./routes/detalleVentaRouters');

// Routes
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/categorias-productos', categoriasProductosRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);
app.use('/detalle-venta', detalleVentaRoutes);
app.use('/api/pagos', pagosRouter);
app.use('/historial-compras', historialesRoutes);
app.use('/carrito', carritoRouter);

// Protected route for user profile
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

// Global error handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
