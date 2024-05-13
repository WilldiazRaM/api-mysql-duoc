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


  app.get('/style.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css'); // Establecer el tipo MIME
    res.sendFile(path.join(__dirname, 'public', 'style.css')); // Enviar el archivo CSS
});

app.get('/registro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login', 'registro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});


app.post("/login",
  passport.authenticate("local", { failureRedirect : "/login"}),
  (req, res) => {
    console.log("Usuario autenticado correctamente");
    res.redirect("/login/profile.html");
  }
);



app.get('/profile', (req, res) => {
    res.render('profile', { user: req.user }); 
});

app.post('/registrar', async (req, res) => {
    const { email , password } = req.body;

    try {
        // Generar hash de la contraseña
        const hashedPassword = await hashPassword(password);

        // Crear un nuevo usuario con la contraseña cifrada
        const newUser = await createUser({ email, password: hashedPassword });
        
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

