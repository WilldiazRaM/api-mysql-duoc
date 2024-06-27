const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('./config/passportConfig');
const { sqlInjectionFilter } = require('./middleware/sqlInjectionFilter');
const { isAuthenticated } = require('./utils/authUtils');
const jwt = require('jsonwebtoken');
const securityHeaders = require('./config/securityHeaders');
const pool = require('./database');

const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(securityHeaders);

app.use(morgan('combined'));

app.use(sqlInjectionFilter);

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000, secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pagosRouter = require('./routes/pagosRoutes');
const historialesRoutes = require('./routes/historialRoutes');
const carritoRouter = require('./routes/carritoRouters');
const ventasRoutes = require('./routes/ventasRouters');
const categoriasProductosRoutes = require('./routes/categoriasProductos');
const detalleVentaRoutes = require('./routes/detalleVentaRouters');
const logRoutes = require('./routes/logRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const direccionRoutes = require('./routes/direccionRoutes');

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/categorias-productos', categoriasProductosRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);
app.use('/detalle-venta', detalleVentaRoutes);
app.use('/api/pagos', pagosRouter);
app.use('/historial-compras', historialesRoutes);
app.use('/carrito', carritoRouter);
app.use('/logs', logRoutes); 
app.use('/pedidos', pedidoRoutes); 
app.use('/direcciones', direccionRoutes);


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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
