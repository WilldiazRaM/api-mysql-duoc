const express = require('express');
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

const app = express();

// Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

app.use(helmet());
app.use(morgan('combined'));  // Guarda log de las solicitudes


// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());



const PORT = process.env.PORT || 4001;

app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubdomains');
    next();
});

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self';");
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


app.get('/', (req, res, next) => {
    res.send("HelloWorld from Stgo, CL made With ❤");
});



app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    (req, res) => {
        res.redirect('/profile'); 
    }
);


app.get('/profile', (req, res) => {
    res.render('profile', { user: req.user }); 
});

app.post('/registrar', async (req, res) => {
    const { email , password } = req.body;

    try {
        const newUser = await createUser({ email, password });
        
        if (newUser) {
            res.status(201).json({
                msg: "Usuario creado exitosamente!",
                user: newUser
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "Ocurrió un error al crear un usuario",
            error: error.message
        });
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})









app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);

});

