const express = require('express');
const pool = require('./database');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet'); //Strict-transport-security'
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./routes/passportConfig'); 
const store = new session.MemoryStore();
const LocalStrategy = require('passport-local').Strategy;

const app = express();
app.use(helmet());
app.use(morgan('combined'));  // Guarda log de las solicitudes


// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());



const PORT = process.env.PORT || 4000;

app.use(session({
    secret: process.env.SESSION_SECRET || generateSecret(),
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
    res.setHeader('X-Frame-Options', 'deny');
    next();
});

app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', "geolocation=(self 'https://api-mysql-duoc.onrender.com')");
    next();
  });


app.get('/', (req, res, next) => {
    res.send("HelloWorld from Stgo, CL made With ❤");
});


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);

});

