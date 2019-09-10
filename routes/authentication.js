'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user');
const bcrypt = require('bcrypt');

const routeGuardMiddleware = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/authentication/sign-in');
  } else {
    next();
  }
};

  
router.get('/sign-up', (req, res, next) => {
    res.render('sign-up');
  });
  
  router.post('/sign-up', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    bcrypt.hash(password, 10)
      .then(hash => {
        return User.create({
          email,
          passwordHash: hash
        });
      })
      .then(user => {
        req.session.user = {
          _id: user._id
        };
        res.redirect('/authentication/private');
      })
      .catch(error => {
        console.log('There was an error in the sign up process.', error);
        res.redirect('/authentication/sign-up');
      });
  });

  router.get('/login', (req, res, next) => {
    res.render('login');
  });


  router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    let auxiliaryUser;
  
    User.findOne({ email })
      .then(user => {
        if (!user) {
          throw new Error('USER_NOT_FOUND');
        } else {
          auxiliaryUser = user;
          return bcrypt.compare(password, user.passwordHash);
        }
      })
      .then(matches => {
        if (!matches) {
          throw new Error('PASSWORD_DOESNT_MATCH');
        } else {
          req.session.user = {
            _id: auxiliaryUser._id
          };
          res.redirect('private');
        }
      })
      .catch(error => {
        console.log('There was an error signing up the user', error);
        next(error);
      });
  });

router.get('/private', routeGuardMiddleware, (req, res, next) => {
  res.render('private');
});


router.get('/private', (req, res, next) => {
    res.render('private');
  });



module.exports = router;

  // const bcryptSalt = 10;

// router.get("/sign-up", (req, res, next) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const salt     = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);
  
//     User.create({
//       username,
//       password: hashPass
//     })
//     .then(() => {
//       res.redirect("/private");
//     })
//     .catch(error => {
//       console.log(error);
//     });

//     User.findOne({ "username": username })
//     .then(user => {
//         if (user !== null) {
//         res.render("authentication/sign-up", {
//             errorMessage: "The username already exists!"
//         });
//         return;
//         }
//     })
//     .catch(error => {
//         next(error);
//     });
// });
