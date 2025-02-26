import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import passport from 'passport';

// Options for JWT authentication
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   // Extract JWT from the Authorization header as a Bearer token
    secretOrKey: 'secret',                                      // Replace with your actual secret or key for verifying the JWT signature
};

// Configuring passport to use the JwtStrategy
passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);
        // JwtStrategy validates the JWT and extracts the payload
        // Query the database to find a user with the ID from the JWT payload
        User.findById(jwt_payload._id)
            .then((user) => {
                if (user) {
                    return done(null, user);                        // If the user is found, pass the user to done()
                } else {
                    return done(null, false);                       // If no user is found, pass false to done()
                }
            })
            .catch(err => {
                return done(err, false)
            });
    })
);

export default passport;
