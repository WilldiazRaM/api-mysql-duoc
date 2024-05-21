const express = require('express');
const app = express();
const helmet = require('helmet');

const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const productosRoutes = require('./routes/productosRoutes');
const pagosRouter = require('./routes/pagosRoutes');
const historialesRoutes = require('./routes/historialRoutes');
const carritoRouter = require('./routes/carritoRouters');
const { isAuthenticated } = require('./utils/passwordUtils');




// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


app.use(helmet());
app.use(morgan('combined'));  // Guarda log de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const PORT = process.env.PORT || 4001;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 86400000, secure: process.env.NODE_ENV === 'production' }
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

// Ruta protegida para el perfil del usuario
app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile('profile.html', { root: './public/login' });
});



// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});




app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);

});

