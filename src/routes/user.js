const express = require("express");
const connect = require("../utils/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../utils/auth");

const router = express.Router();

router.post("/login", (req, res) => {
  const { rut, pass } = req.body;
  if (rut && pass) {
    return connect()
      .then((db) => {
        return db.query(
          `SELECT rut, email, nombres, apellidos, rol, estado, pass as password FROM usuario WHERE RUT = ${rut}`,
          []
        );
      })
      .then((result) => {
        if (result.length > 0) {
          const {
            rut,
            email,
            nombres,
            apellidos,
            rol,
            estado,
            password,
          } = result[0];
          const user = { rut, email, nombres, apellidos, rol, estado };
          if (bcrypt.compareSync(pass.trim(), password)) {
            const token = jwt.sign(user, "LaPrivateKeyEstaAki", {
              expiresIn: 60 * 60 * 22, // 22 hrs
            });
            return res.json({
              status: 200,
              message: "Usuario logeado correctamente",
              data: { token, user },
            });
          } else {
            return res.status(404).json({
              status: 404,
              message: "Rut / Contraseña incorrectos",
              data: {},
            });
          }
        } else {
          return res.status(404).json({
            code: 404,
            message: "Rut / Contraseña incorrectos",
            data: {},
          });
        }
      })
      .catch((e) => {
        console.error(e);
        return res
          .status(500)
          .json({ status: 500, message: e.message, data: {} });
      });
  }
  return res
    .status(400)
    .json({ status: 400, message: "Bad Request", data: {} });
});

router.post("/singup", (req, res) => {
  const { rut, email, pass, nombres, apellidos, rol } = req.body;
  if (rut && email && pass && nombres && apellidos && rol) {
    const hash = bcrypt.hashSync(pass, 8);

    return connect()
      .then((db) => {
        return db.query(
          `INSERT INTO usuario VALUES (${rut}, '${email}', '${hash}', '${nombres}', '${apellidos}' , '${rol}', 'Activo' )`
        );
      })
      .then((result) => {
        if (result.affectedRows > 0) {
          return res.json({
            code: 200,
            message: "Usuario registrado correctamente",
            data: {},
          });
        }
        return res
          .status(500)
          .json({ code: 500, message: "Ocurrio un error", data: {} });
      })
      .catch((e) => {
        console.error(e);
        return res.status(500).json({
          code: 500,
          message: e.message,
          data: {},
        });
      });
  }
  return res
    .status(400)
    .json({ status: 400, message: "Bad Request", data: {} });
});

// EJEMPLO DE COMO USAR LA AUTORIZACION
router.get("/wea", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
