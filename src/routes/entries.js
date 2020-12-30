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

router.get("/view", auth, (res) => {
  return connect()
    .then((db) => {
      return db.query(
        `SELECT * FROM entrada`
      );
    })
    .then((result) => {
      console.log(result);
      if (result.length > 0) {
        return res.json({
          code: 200,
          message: "Lista de entradas mostrada exitosamente",
          data: {},
        });
      }
      return res
        .status(500)
        .json({ code: 500, message: "Ocurrio un error", data: {}});
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).json({
        code: 500,
        message: e.message,
        data: {},
      });
    });
});

router.post("/ActualizarInput", auth, (req, res) => {
  const { id, orden, cantidad, id_producto, id_proveedor } = req.body;
  if (id && orden && cantidad && id_producto && id_proveedor) {
    return connect()
      .then((db) => {
        return db.query(
          `UPDATE entrada SET orden= ${orden}, cantidad = ${cantidad}, id_producto= ${id_producto}, id_proveedor= ${id_proveedor} where id = ${id}`
        );
      })
      .then((result) => {
        console.log(result);
        if (result.affectedRows === 1) {
          return res.json({
            code: 200,
            message: "Entrada actualizada correctamente",
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

router.post("/EliminarInput", auth, (req, res) => {
  const { id } = req.body;
  if (id) {
    return connect()
      .then((db) => {
        return db.query(`DELETE FROM entrada where id= ${id}`);
      })
      .then((result) => {
        console.log(result);
        if (result.affectedRows === 1) {
          return res.json({
            code: 200,
            message: "Entrada eliminada correctamente",
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
