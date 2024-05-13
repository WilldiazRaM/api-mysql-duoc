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
            return done(null, user); // Devolvemos todo el objeto de usuario
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user); // Serializamos todo el objeto de usuario
});

passport.deserializeUser((user, done) => {
    done(null, user); // Deserializamos todo el objeto de usuario
});
