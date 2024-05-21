const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../utils/databaseUtils');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../database');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = 'https://api-mysql-duoc.onrender.com/auth/google/callback';

// Configuración de GitHub Strategy
// Configuración de GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://api-mysql-duoc.onrender.com/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log('GitHub Strategy: Autenticación exitosa');
    console.log('Profile:', profile);
    // Aquí puedes buscar o crear un usuario en tu base de datos
    return done(null, profile);
}));


// Configuración de Google Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    console.log('Google Strategy: Autenticación exitosa');
    console.log('Profile:', profile);
    // Aquí puedes buscar o crear un usuario en tu base de datos
    return done(null, profile);
}));



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.findUserById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
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
        return done(err)
    }
}));







module.exports = passport;
