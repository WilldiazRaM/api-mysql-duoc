const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../utils/databaseUtils');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = 'https://api-mysql-duoc.onrender.com/auth/github/callback';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = 'https://api-mysql-duoc.onrender.com/auth/google/callback';

passport.serializeUser((user, done) => {
    console.log('Serializando usuario:', user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('Deserializando usuario con id:', id);
    try {
        const [results] = await pool.query('SELECT * FROM Usuarios WHERE id = ?', [id]);
        if (results.length > 0) {
            done(null, results[0]);
        } else {
            done(new Error('Usuario no encontrado'));
        }
    } catch (err) {
        done(err);
    }
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await db.findByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Configuración de Google Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://api-mysql-duoc.onrender.com/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [results] = await pool.query('SELECT * FROM Usuarios WHERE email = ?', [profile.emails[0].value]);
        if (results.length > 0) {
            return done(null, results[0]);
        } else {
            const [insertResults] = await pool.query('INSERT INTO Usuarios (nombre, email, role) VALUES (?, ?, ?)', [profile.displayName, profile.emails[0].value, 'user']);
            const [newUser] = await pool.query('SELECT * FROM Usuarios WHERE id = ?', [insertResults.insertId]);
            return done(null, newUser[0]);
        }
    } catch (err) {
        return done(err);
    }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (token, tokenSecret, profile, done) => {
    try {
        const [results] = await pool.query('SELECT * FROM Usuarios WHERE email = ?', [profile.emails[0].value]);
        if (results.length > 0) {
            return done(null, results[0]);
        } else {
            const [insertResults] = await pool.query('INSERT INTO Usuarios (nombre, email, role) VALUES (?, ?, ?)', [profile.displayName, profile.emails[0].value, 'user']);
            const [newUser] = await pool.query('SELECT * FROM Usuarios WHERE id = ?', [insertResults.insertId]);
            return done(null, newUser[0]);
        }
    } catch (err) {
        return done(err);
    }
}));



module.exports = passport;
