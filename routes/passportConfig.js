const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');



passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await pool.findByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Si el usuario y la contraseña son válidos, devolver el usuario
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
