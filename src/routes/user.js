const express = require("express");
const connect = require("../utils/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../utils/auth");

const router = express.Router();

/*
  @Status: 200
    description: Usuario ingresado correctamente, retorna un token utilizando JWT
    return:
      status:200,
      {
        token: //JWT con la informacion y 22 horas de expiracion
      }
    
  @Status: 404
    description: Usuario no ingresado debido a que el usuario y/o contraseña estan incorrectas
    return:
      status:404,
      {
        message: // Mensaje de error
      }
  
  @status: 500
    description: Error interno del servidor y/o base de datos
    return:
      status:500,
      {
        message: // Mensaje de error enviado por node
      }
*/

router.get("/login", (req, res) => {
  const { rut, password } = req.body;
  connect()
    .then((db) => {
      return db.query(
        `SELECT nombre, password as password2 FROM USUARIOS WHERE RUT = ${rut}`,
        []
      );
    })
    .then((result) => {
      if (result.length > 0) {
        const { nombre, password2 } = result[0];
        if (bcrypt.compareSync(password, password2)) {
          const token = jwt.sign({ nombre }, "LaPrivateKeyEstaAki", {
            expiresIn: 60 * 60 * 22, // 22 hrs
          });
          res.json({ status: 200, body: { token } });
        } else {
          res.json({
            status: 404,
            body: { message: "Rut / Contraseña incorrectos" },
          });
        }
      } else {
        res
          .status(404)
          .json({ code: 404, message: "Rut / Contraseña incorrectos" });
      }
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ status: 500, body: { result: e.message } });
    });
});

/*
  @Status: 200
    description: Usuario ingresado correctamente, retorna un token utilizando JWT
    return:
      status:200,
      {
        message: // Mensaje aprovando el registro
      }
    
  @status: 500
    description: Error interno del servidor y/o base de datos
    return:
      status:500,
      {
        message: // Mensaje de error enviado por node (Probablemente usuario ya ingresado)
      }
*/

router.post("/singup", (req, res) => {
  const { rut, password, name } = req.body;
  const hash = bcrypt.hashSync(password, 2 * Math.round(Math.random * 100));

  connect()
    .then((db) => {
      return db.query(
        `INSERT INTO USUARIOS VALUES (${rut},'${hash}','${name}')`
      );
    })
    .then((result) => {
      console.log(result);
      if (result.affectedRows > 0) {
        res.json({
          code: 200,
          body: { message: "Usuario registrado correctamente" },
        });
      }
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({
        code: 500,
        body: { result: e.message },
      });
    });
});

// EJEMPLO DE COMO USAR LA AUTORIZACION
router.get("/wea", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
