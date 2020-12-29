const express = require("express");
const connect = require("../utils/connection");
const auth = require("../utils/auth");
const { restart } = require("nodemon");

const router = express.Router();

router.post("/agregar", auth, (req, res) => {
  const { nombre, id_sub_cat, marca, stock, stock_min } = req.body;
  console.log(req.body);
  //if (nombre && id_sub_cat && marca && stock && stock_min) {
  return connect()
    .then((db) => {
      return db.query(
        `INSERT INTO producto (nombre, id_sub_cat, stock, marca, stock_min) VALUES ('${nombre}', ${id_sub_cat}, ${stock}, '${marca}', ${stock_min} )`,
        []
      );
    })
    .then((result) => {
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

module.exports = router;
