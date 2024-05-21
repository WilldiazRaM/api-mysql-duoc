const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const store = new session.MemoryStore();
const productosRoutes = require('./routes/productosRoutes');
const pagosRouter = require('./routes/pagosRoutes');
const historialesRoutes = require('./routes/historialRoutes');
const carritoRouter = require('./routes/carritoRouters');
const { isAuthenticated } = require('./utils/passwordUtils');



require('dotenv').config();

// Configurar el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use(express.static('public'));



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
    store,
    secure: true
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









//Rutas LOGIN
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/pagos', pagosRouter);
app.use('/historial-compras', historialesRoutes);
app.use('/carrito', carritoRouter);


// Ruta para la vista de perfil
app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});




app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);

});

