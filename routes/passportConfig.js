const passport = require('passport');
const { Strategy } = require('passport-local');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy (
    { usernameField: 'email' }, // Especifica que el campo de usuario es el email
    function(email, password, done) {
        db.email.findByemail(email, (err, user) => {
            if (err) { return done(err); } // Si hay un error, pasa el error a done
            if (!user) { // Si no se encuentra el usuario
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            if (user.password !== password) { // Si las contraseñas no coinciden
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user); // Si todo está bien, pasa el usuario a done
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.email.findByemail(id, function(err, user){
        if(err)  return done(err);
        done (null, user);
    });
});
