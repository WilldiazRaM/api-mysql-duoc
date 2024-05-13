const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../utils/databaseUtils');

passport.use(new LocalStrategy (
    { usernameField: 'email' }, // Especifica que el campo de usuario es el email
    async function(email, password, done) {
        try {
            const user = await db.findByemail(email);
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
