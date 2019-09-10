'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user');
const bcrypt = require('bcrypt');

  
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
  console.log(email, password);
  res.redirect('/authentication/private');
});


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


router.get('/private', (req, res, next) => {
    res.render('private');
  });



module.exports = router;