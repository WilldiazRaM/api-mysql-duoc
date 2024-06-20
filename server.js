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
const sanitizeAndValidateInput = require('./utils/sanitizeUtils');


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

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de seguridad
app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubdomains');
    res.setHeader('Content-Security-Policy', "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://kit.fontawesome.com;");
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', "geolocation=(self 'https://api-mysql-duoc.onrender.com')");
    // Configuración de CORS para permitir solicitudes desde dominios externos (por ejemplo, GitHub y Google)
    

    next();
});



// Middleware para filtrar caracteres peligrosos
app.use((req, res, next) => {
    const dangerousChars = /['";]/;
    const dangerousSequence = /--/;

    const checkForDangerousChars = (input) => {
        if (dangerousChars.test(input) || dangerousSequence.test(input)) {
            return true;
        }
        return false;
    };

    // Verificar caracteres peligrosos en req.body
    for (let key in req.body) {
        if (checkForDangerousChars(req.body[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. \n with ❤️ from 🇨🇱 👊👊👊 \n ');
        }
    }

    // Verificar caracteres peligrosos en req.params
    for (let key in req.params) {
        if (checkForDangerousChars(req.params[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. \n with ❤️ from 🇨🇱 👊👊👊 \n ');
        }
    }

    // Verificar caracteres peligrosos en req.query
    for (let key in req.query) {
        if (checkForDangerousChars(req.query[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. \n with ❤️ from 🇨🇱 👊👊👊 \n ');
        }
    }

    // Verificar caracteres peligrosos en req.headers
    for (let key in req.headers) {
        if (checkForDangerousChars(req.headers[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. \n with ❤️ from 🇨🇱 👊👊👊 \n ');
        }
    }

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
            res.render('profile', { user: decoded });
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
