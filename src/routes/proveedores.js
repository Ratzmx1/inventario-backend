const express = require("express");
const connect = require("../utils/connection");
const auth = require("../utils/auth");
const router = express.Router();

// LISTADO DE PROVEEDORES

router.get("/view", auth, (req, res) => {
  return connect().then((db) => {
    return db
      .query(
        `SELECT id AS "id_prov", nombre AS "nombre_prov", direccion AS "direc_prov", telefono AS "telef_prov"
          FROM proveedor;`
      )
      .then((result) => {
        db.destroy();
        if (result.length > 0) {
          return res.json({
            code: 200,
            message: "Lista de proveedores mostrada exitosamente",
            data: { result },
          });
        }
        return res
          .status(500)
          .json({ code: 500, message: "Ocurrio un error", data: {} });
      })
      .catch((e) => {
        db.destroy();
        console.error(e);
        return res.status(500).json({
          code: 500,
          message: e.message,
          data: {},
        });
      });
  });
});

module.exports = router;
