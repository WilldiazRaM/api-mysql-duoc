const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../utils/databaseUtils');


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
            console.log("Usuario no encontrado");
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Contraseña incorrecta");
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Si el usuario y la contraseña son válidos, devolver el usuario
        console.log("Usuario autenticado correctamente");
        return done(null, user);
    } catch (err) {
        console.error("Error durante la autenticación:", err);
        return done(err);
    }
}));



module.exports = passport;