const express = require("express");
const connect = require("../utils/connection");
const auth = require("../utils/auth");

const router = express.Router();

router.get("/productos_salida", auth, (req, res) => {
  return connect()
    .then((basedato) => {
      return basedato
        .query(
          `SELECT s.id, s.cantidad, s.fecha, p.nombre, u.rut, u.nombres, u.apellidos
      FROM  salida s inner join producto p on s.id_producto = p.id inner join usuario u on s.id_usuario = u.rut`,
          []
        )
        .then((resultados) => {
          basedato.destroy();
          if (resultados.length > 0) {
            return res.status(200).json({
              status: 200,
              data: resultados,
              message: "El producto a salido exitosamente",
            });
          }
          return res
            .status(404)
            .json({ status: 404, data: [], message: "No hay productos" });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        message: "Error del servidor, intentelo más tarde",
        data: { error: error.message },
      });
    });

  return res.status(400).json({
    status: 400,
    message: "Petición incorrecta, intentelo nuevamente",
    data: {},
  });
});

router.post("/sacar_producto", auth, (req, res) => {
  const { id_producto, cantidad } = req.body;
  const { rut } = req.user;
  // id_producto = req.body["id_producto"]
  // cantidad = req.body["cantidad"]

  if (cantidad < 1) {
    return res
      .status(400)
      .json({ mensaje: "La cantidad es inferior a 0", data: null });
  }
  return connect().then((db) => {
    return db
      .query(`SELECT id,stock FROM producto WHERE id=${id_producto}`)
      .then((resultados) => {
        db.destroy();
        if (resultados.length > 0) {
          if (resultados[0].stock >= cantidad) {
            var fecha = new Date();
            var stringfecha =
              fecha.getFullYear() +
              "," +
              fecha.getMonth() +
              "," +
              fecha.getDay() +
              " " +
              fecha.getHours() +
              ":" +
              fecha.getMinutes() +
              ":" +
              fecha.getSeconds();
            return connect()
              .then((db) => {
                db.query(
                  `INSERT INTO salida(id_usuario,id_producto,cantidad,fecha) VALUES(${rut},${id_producto},${cantidad}, DATE_FORMAT('${stringfecha}','%d/%m/%Y %H:%i:%s') )`
                ).then(() => {
                  db.destroy();
                });
                return res.status(200).json({
                  mensaje: "Productos extraidos exitosamente",
                  data: {
                    id_producto: id_producto,
                    cantidad: resultados[0].stock - cantidad,
                  },
                });
              })
              .catch((e) => {
                db.destroy();
                return res.status(500).json({
                  mensaje: "Ha ocurrido un error en la inserción",
                  data: null,
                  error: e.message,
                });
              });
          } else {
            return res.status(404).json({
              mensaje: "Cantidad del producto en bodega es insuficiente",
              data: null,
            });
          }

          console.log(resultados[0].stock);
        } else {
          return res
            .status(404)
            .json({ mensaje: "Producto no existe", data: null });
        }
        return res.status(200).json({ mensaje: "asdas" });
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
});

module.exports = router;
