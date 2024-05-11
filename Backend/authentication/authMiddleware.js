import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/userModel.js';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: '706913028889-at77ish0tllrjec8st48mvi2goq6s0ea.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5555/profile'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in the database
      let user = await User.findOne({ username: profile.id });

      if (!user) {
        // If user doesn't exist, create a new user
        user = new User({
          username: profile.id,
          // You can also save additional user information from the profile object
          // For example: name, email, profile picture, etc.
        });
        await user.save();
      }

      // Store the access token and refresh token in the user object
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();

      // Pass the user object to the next middleware
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
));

// Middleware to authenticate with Google OAuth
export const authenticateGoogle = passport.authenticate('google', { scope: ['profile'] });

// Middleware to handle Google OAuth callback
export const googleCallback = passport.authenticate('google', { failureRedirect: '/login' });

// Middleware to check if user is authenticated
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

