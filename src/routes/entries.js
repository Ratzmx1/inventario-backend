const express = require("express");
const connect = require("../utils/connection");
const auth = require("../utils/auth");

const router = express.Router();

router.post("/input", auth, (req, res) => {
  const { orden, cantidad, id_producto, id_proveedor, fecha } = req.body;
  if (orden && cantidad && id_producto && id_proveedor && fecha) {
    return connect()
      .then((db) => {
        return db.query(
          `INSERT INTO entrada (id_usuario, orden, cantidad, id_producto, id_proveedor, fecha)
          VALUES (${req.user.rut}, ${orden}, ${cantidad}, ${id_producto}, ${id_proveedor}, '${fecha}')`
        );
      })
      .then((result) => {
        console.log(result);
        if (result.affectedRows === 1) {
          return res.json({
            code: 200,
            message: "Entrada registrada correctamente",
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
});

module.exports = router;
