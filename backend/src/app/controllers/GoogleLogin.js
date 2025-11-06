const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { generateAccessToken } = require("../middleware/user_token");
const User = require("../models/User");

class GoogleAuthController {
  constructor() {
    this.initializeStrategy();
  }

  initializeStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.Client_ID,
          clientSecret: process.env.Client_Secret,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // 1. Check if user already signed in with Google
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
              const token = generateAccessToken({ userId: user._id });
              return done(null, { user, token });
            }

            // 2. Check if user exists with the same email (manual sign-up)
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await User.findOne({ email });
              if (user) {
                // Link Google account to existing user
                user.googleId = profile.id;
                user.avatar = user.avatar || profile.photos?.[0]?.value;
                await user.save();

                const token = generateAccessToken({ userId: user._id });
                return done(null, { user, token });
              }
            }

            // 3. New user - create account
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              avatar: profile.photos?.[0]?.value,
            });

            const token = generateAccessToken({ userId: user._id });
            return done(null, { user, token });
          } catch (err) {
            console.error("Google OAuth error:", err);
            return done(err, null);
          }
        }
      )
    );

    // Serialize user for session
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    // Deserialize user from session
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  // Start OAuth process
  startOAuth(req, res, next) {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  }

  // Handle OAuth callback
  handleOAuthCallback(req, res, next) {
    passport.authenticate(
      "google",
      {
        failureRedirect: "/login",
        session: false,
      },
      (err, authData) => {
        if (err) {
          console.error("OAuth callback error:", err);
          return res.status(500).json({ error: "Authentication failed" });
        }

        if (!authData) {
          return res.status(401).json({ error: "Authentication failed" });
        }

        // Successful authentication

        // Set token as HTTP-only cookie
        res.cookie("token", authData.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        res.redirect(
          `https://shopping-qpz2g445g-zedpro1230s-projects.vercel.app/home?data=${encodeURIComponent(
            JSON.stringify({
              user: {
                id: authData.user._id,
                name: authData.user.name,
                email: authData.user.email,
                avatar: authData.user.avatar,
                role: authData.user.role,
              },
            })
          )}`
        );
        // return res.status(200).json({
        //   success: true,
        //   message: "Google authentication successful",
        //   data: {
        //     user: {
        //       id: authData.user._id,
        //       name: authData.user.name,
        //       email: authData.user.email,
        //       avatar: authData.user.avatar,
        //       role: authData.user.role,
        //     },
        //     token: authData.token,
        //   },
        // });
      }
    )(req, res, next);
  }
}

module.exports = new GoogleAuthController();
