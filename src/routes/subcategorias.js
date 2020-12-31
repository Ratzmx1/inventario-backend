const express = require("express");
const connect = require("../utils/connection");
const auth = require("../utils/auth");
const router = express.Router();

// LISTADO DE SUBCATEGORIAS

router.get("/view", auth, (req, res) => {
  return connect()
    .then((db) => {
      return db
        .query(
          `SELECT subcategoria.id AS "id_subcat", subcategoria.nombre AS "nombre_subcat", categoria.nombre AS "nombre_cat"
          FROM subcategoria INNER JOIN categoria ON subcategoria.id= categoria.id;`
        )
        .then((result) => {
          db.destroy();
          if (result.length > 0) {
            return res.json({
              code: 200,
              message: "Lista de subcategorias mostrada exitosamente",
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
