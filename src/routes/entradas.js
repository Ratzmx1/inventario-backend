const express = require("express");
const connect = require("../utils/connection");
const auth = require("../utils/auth");

const router = express.Router();

router.post("/input", auth, (req, res) => {
  const { orden, cantidad, id_producto, id_proveedor } = req.body;
  if (orden && cantidad && id_producto && id_proveedor) {
    var fecha = new Date();
    var stringFecha =
      fecha.getFullYear() +
      "," +
      (fecha.getMonth() + 1) +
      "," +
      fecha.getDate() +
      " " +
      (fecha.getHours() - 3) +
      ":" +
      fecha.getMinutes() +
      ":" +
      fecha.getSeconds();
    return connect().then((db) => {
      return db
        .query(
          `INSERT INTO entrada (id_usuario, orden, cantidad, id_producto, id_proveedor, fecha)
          VALUES (${req.user.rut}, ${orden}, ${cantidad}, ${id_producto}, ${id_proveedor}, DATE_FORMAT('${stringFecha}','%d/%m/%Y %H:%i:%s'))`
        )
        .then((result) => {
          db.destroy();
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
          db.destroy();
          console.error(e);
          return res.status(500).json({
            code: 500,
            message: e.message,
            data: {},
          });
        });
    });
  }
});

router.get("/view", auth, (req, res) => {
  return connect().then((db) => {
    return db
      .query(
        `SELECT e.*, prod.nombre AS "nombre_prod", prov.nombre AS "nombre_prov", u.nombres AS "nombre_user"
        FROM entrada AS e
        INNER JOIN producto AS prod ON e.id_producto = prod.id
        INNER JOIN proveedor AS prov ON e.id_proveedor = prov.id
        INNER JOIN usuario AS u ON e.id_usuario = u.rut;`
      )
      .then((result) => {
        db.destroy();

        if (result.length > 0) {
          return res.json({
            code: 200,
            message: "Lista de entradas mostrada exitosamente",
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

router.post("/ActualizarInput", auth, (req, res) => {
  const { id, orden, cantidad, id_producto, id_proveedor } = req.body;
  if (id && orden && cantidad && id_producto && id_proveedor) {
    return connect().then((db) => {
      return db
        .query(
          `UPDATE entrada SET orden = ${orden}, cantidad = ${cantidad}, id_producto = ${id_producto}, id_proveedor = ${id_proveedor} where id = ${id}`
        )
        .then((result) => {
          db.destroy();
          if (result.affectedRows === 1) {
            return res.json({
              code: 200,
              message: "Entrada actualizada correctamente",
              data: {},
            });
          }
          return res
            .status(500)
            .json({ code: 500, message: "Ocurrió un error", data: {} });
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
  }
});

router.post("/EliminarInput", auth, (req, res) => {
  const { id } = req.body;
  if (id) {
    return connect().then((db) => {
      return db
        .query(`DELETE FROM entrada where id= ${id}`)
        .then((result) => {
          db.destroy();
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
          db.destroy();
          console.error(e);
          return res.status(500).json({
            code: 500,
            message: e.message,
            data: {},
          });
        });
    });
  }
});

module.exports = router;
