const express = require("express");
const connect = require("../utils/connection");
const auth = require("../utils/auth");

const router = express.Router();

router.post("/agregar", auth, (req, res) => {
  const { nombre, id_sub_cat, marca, stock, stock_min } = req.body;
  console.log(req.body);
  //if (nombre && id_sub_cat && marca && stock && stock_min) {
  return connect()
    .then((db) => {
      return db
        .query(
          `INSERT INTO producto (nombre, id_sub_cat, stock, marca, stock_min) VALUES ('${nombre}', ${id_sub_cat}, ${stock}, '${marca}', ${stock_min} )`,
          []
        )
        .then((result) => {
          db.destroy();
          if (result.affectedRows === 1) {
            return res.json({
              code: 200,
              message: "Producto Ingresado Correctamente",
              data: {},
            });
          }
          return res
            .status(500)
            .json({ code: 500, message: "Ocurrio un error", data: {} });

          console.log(result);
        });
    })

    .catch((e) => {
      console.error(e);
      return res
        .status(500)
        .json({ status: 500, message: e.message, data: {} });
    });
  // }
  res.json({});
});

// LISTADO DE PRODUCTOS

router.get("/view", auth, (req, res) => {
  return connect()
    .then((db) => {
      return db
        .query(
          `SELECT producto.id AS "id_prod", producto.nombre AS "nombre_prod", subcategoria.nombre AS "nombre_subc",
        producto.stock AS "stock_prod",producto.marca AS "marca_prod", producto.stock_min AS "stock_min_prod"
        FROM producto INNER JOIN subcategoria ON producto.id_sub_cat= subcategoria.id;`
        )
        .then((result) => {
          db.destroy();
          if (result.length > 0) {
            return res.json({
              code: 200,
              message: "Lista de productos mostrada exitosamente",
              data: { result },
            });
          }
          return res
            .status(500)
            .json({ code: 500, message: "Ocurrio un error", data: {} });
        });
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

module.exports = router;
