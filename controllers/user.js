//Imports
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");
const models = require("../models");
const asyncLib = require("async");

// Routes

module.exports = {
  signupbis: async function (req, res) {
    // Params                  Récupérer les paramètres envoyés dans la requête
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    try {
      const user = await models.User.findOne({
        where: { email: email },
      });
      if (user !== null) {
        if (user.username === req.body.username) {
          return res.status(400).json({ error: "ce pseudo est déjà utilisé" });
        }
      } else {
        const hash = await bcrypt.hash(password, 10);
        const newUser = await models.User.create({
          username: username,
          email: email,
          password: hash,
        });

        const tokenObject = await jwtUtils.generateTokenForUser(newUser);
        res.status(201).send({
          user: newUser,
          token: tokenObject.token,
          expires: tokenObject.expiresIn,
          message: `Votre compte est bien créé ${newUser.username} !`,
        });
      }
    } catch (error) {
      return res.status(400).send({ error: "email déjà utilisé" });
    }
  },
  //on exporte depuis ce module toutes les routes qu'il contient
  ////////////////////////////////////////////////////////////
  signup: function (req, res) {
    // Params                  Récupérer les paramètres envoyés dans la requête
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    //test des paramètres
    if (email == null || username == null || password == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    if (username.length >= 13 || username.length <= 4) {
      return res
        .status(400)
        .json({ error: "wrong username (must be length 5 - 12)" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "email is not valid" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error:
          "password invalid (must length 4 - 10 and include 1 number at least)",
      });
    }

    //exécution de fonctions en cascade
    //1_Création d'un tableau de fonctions dont on a besoin
    asyncLib.waterfall(
      [
        //1°fonction: vérifie si l'utilisateur est présent en base
        function (done) {
          models.User.findOne({
            attributes: ["email"],
            where: { email: email },
          })
            .then(function (userFound) {
              //où userFound = résultat de la requête
              console.log(userfound);
              done(null, userFound); //null=>on passe à la fonction suivante userFound
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" }); //si la requête s'effectue mal
            });
        },
        //2°fonction:
        function (userFound, done) {
          if (!userFound) {
            //si le paramètre existe
            bcrypt.hash(password, 5, function (err, bcryptedPassword) {
              //on crypte le password
              done(null, userFound, bcryptedPassword); //null car waterfall pas terminé
            });
          } else {
            return res.status(409).json({ error: "user already exist" }); //si le paramètre userFound n'existe pas
          }
        },
        //3°fonction
        function (userFound, bcryptedPassword, done) {
          let newUser = models.User.create({
            email: email,
            username: username,
            password: bcryptedPassword,

            isAdmin: 0,
          })
            .then(function (newUser) {
              done(newUser); //ici pas de null car waterfall terminé
            })
            .catch(function (err) {
              return res.status(500).json({ error: "cannot add user" });
            });
        },
      ],
      function (newUser) {
        if (newUser) {
          //si new user existe
          return res.status(201).json({
            userId: newUser.id,
          });
        } else {
          return res.status(500).json({ error: "cannot add user" });
        }
      }
    );
  },
  ///////////////////////////////////////////////////////////////
  login: function (req, res) {
    // Params
    let email = req.body.email;
    let password = req.body.password;
    if (email == null || password == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { email: email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            bcrypt.compare(
              password,
              userFound.password,
              function (errBycrypt, resBycrypt) {
                done(null, userFound, resBycrypt);
              }
            );
          } else {
            return res.status(404).json({ error: "user not exist in DB" });
          }
        },
        function (userFound, resBycrypt, done) {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: "invalid password" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json({
            username: userFound.username,
            userId: userFound.id,
            email: userFound.email,
            token: jwtUtils.generateTokenForUser(userFound),
            isAdmin: userFound.isAdmin,
          });
        } else {
          return res.status(500).json({ error: "cannot log on user" });
        }
      }
    );
  },
  ////////////////////////////////////////////////////////////////
  getUserProfile: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    models.User.findOne({
      attributes: ["id", "email", "username", "isAdmin"],
      where: { id: userId },
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "user not found" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "cannot fetch user" });
      });
  },
  ////////////////////////////////////////////////////////////////
  updateUserProfile: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    // Params
    let username = req.body.username;
    let email = req.body.email;

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["id", "email", "username"],
            where: { id: userId },
          })
            .then(function (userFound) {
              console.log(userFound);
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                username: username ? username : userFound.username,
                email: email ? email : userFound.email,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "cannot update user" });
              });
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "cannot update user profile" });
        }
      }
    );
  },
  ///////////////////////////////////////////////////
  deleteUserProfil: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    let email = req.body.email;

    asyncLib.waterfall([
      function (done) {
        models.User.findOne({
          attibutes: ["id"],
          where: { email: email, id: userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            res.status(400).json({ error: err });
          });
      },
      function (userFound, done) {
        if (userFound) {
          userFound
            .destroy()
            .then(() => res.status(200).json({ message: "user deleted" }))
            .catch((err) => res.status(500).json({ error: err }));
        }
      },
    ]),
      function (err) {
        if (err) {
          throw new Error(err);
        } else {
          console.log("No error happened in any steps, operation done!");
        }
      };
  },
  getUsers: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      return res.status(400).json({ error: "wrong token" });
    }
    models.User.findAll({
      attributes: ["id", "username"],
    })
      .then((user) => res.status(201).json(user))
      .catch((error) => res.status(500).json({ error: "cannot fetch user" }));
  },
};
