import express from 'express'
import passport from 'passport'
import passport_local from 'passport-local'
const LocalStrategy = passport_local.Strategy
import bCrypt from 'bcrypt'
import mongoose from 'mongoose'
import logger from '../loggers/logger.js'  
import dotenv from 'dotenv' 
dotenv.config({ silent: true })
const autentication = express.Router();
const URLDB = process.env.URLDB;

mongoose.connect(
  URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw new Error(`Error de conexion a la base de datos ${err}`);
    logger.info("base de datos conectada");
  }
);

import User from '../daos/models/userDaoMongoDB.js'

/*------------- [LocalStrategy - Login]-------------*/
passport.use('login', new LocalStrategy(
  (username, password, done) => {
      User.findOne({ username }, (err, user) => {
          if (err)
              return done(err);

          if (!user) {
              console.log('User Not Found with username ' + username);
              return done(null, false);
          }

          if (!isValidPassword(user, password)) {
              console.log('Invalid Password');
              return done(null, false);
          }

          return done(null, user);
      });
  })
);

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}
/*------------- [LocalStrategy - Signup]-------------*/
passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ username: username }, function (err, user) {
        console.log(user);
        console.log(username);
        if (err) {
          console.log("Error in SignUp: " + err);
          return done(err);
        }
        if (user) {
          console.log("User already exists");
          return done(null, false);
        }
        const newUser = {
          username: username,
          password: createHash(password),
        };
        User.create(newUser, (err, userWithId) => {
          if (err) {
            console.log("Error in Saving user: " + err);
            return done(err);
          }
          console.log(user);
          console.log("User Registration succesful");
          return done(null, userWithId);
        });
      });
    }
  )
);
function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

/*------------- [Serializar y deserializar]-------------*/
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

// Index
autentication.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    let userMail = user.username;
    res.render("home", { userMail });
  } else {
    res.redirect("/login");
  }
});
// Login
autentication.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    console.log("user logueado");
    res.render("profileUser", { user });
  } else {
    console.log("user NO logueado");
    res.render("login");
  }
});
autentication.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login-error",
    successRedirect: "/",
  })
);
autentication.get("/login-error", (req, res) => {
  console.log("error en login");
  res.render("login-error", {});
});
// signup
autentication.get("/signup", (req, res) => {
  res.render("signup");
});
autentication.post(
  "/signup",
  passport.authenticate("signup", {
    failureRedirect: "/signup-error",
    successRedirect: "/",
  })
);
autentication.get("/signup-error", (req, res) => {
  console.log("error en signup");
  res.render("signup-error", {});
});
// Logout
autentication.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
// Fail route
autentication.get("*", (req, res) => {
  const { url, method } = req;
  logger.warn(`Ruta ${method} ${url} no implementada`);
  res.send(`Ruta ${method} ${url} no está implementada`);
  res.status(404).render("routing-error", {});
});

/*---------------- [Autorizar rutas protegidas] ---------------*/
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}
autentication.get("/ruta-protegida", checkAuthentication, (req, res) => {
  let user = req.user;
  console.log(user);
  res.send("<h1>Ruta OK!</h1>");
});

export default autentication;