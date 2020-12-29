const express = require("express");
const connect = require("../utils/connection");

const router = express.Router();

router.get("/productos",(req,res) => {

    return connect().then((basedato) => {
        return basedato.query(`SELECT * FROM producto`,[]);
    }).then((resultados) => {
        console.log(resultados);
        if (resultados.length > 0) {
            return res.status(200).json({status:200, data:resultados, message:"Los resultados de la tabla productos"});
        }

        return res.status(404).json({status:404, data:[], message:"No hay productos"});

    });

    return res
    .status(400)
    .json({ status: 400, message: "sakdljfasdlkfjas", data: {} });
});

router.get("/productos_salida",(req,res) => {

    return connect().then((basedato) => {
        return basedato.query(`SELECT * FROM salida`,[]);
    }).then((resultados) => {
        if (resultados.length > 0) {
            return res.status(200).json({status:200, data:resultados, message:"El producto a salido exitosamente"});
        }

        return res.status(404).json({status:404, data:[], message:"No hay productos"});

    }).catch((error) => {
        return res.status(500).json({ status: 500, message: "Error del servidor, intentelo más tarde", data: {error:error.message} });
    });

    return res.status(400).json({ status: 400, message: "Petición incorrecta, intentelo nuevamente", data: {} });
});


router.post("/sacar_producto", (req,res) => {
    
    const { id_producto, cantidad, rut } = req.body;

    // id_producto = req.body["id_producto"]
    // cantidad = req.body["cantidad"]

    if (cantidad < 1 ){
        return res.status(400).json({mensaje:"La cantidad es inferior a 0",data:null});
    }


    return connect().then((db)=>{

       return db.query(`SELECT id,stock FROM producto WHERE id=${id_producto}`); 

    }).then((resultados) => {
        if(resultados.length > 0){
            if( resultados[0].stock >= cantidad ){
                    
                var fecha = new Date();
                var stringfecha = fecha.getFullYear()+","+fecha.getMonth()+","+fecha.getDay()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();

                return connect().then((db)=>{
                    db.query(`INSERT INTO salida(id_usuario,id_producto,cantidad,fecha) VALUES(${rut},${id_producto},${cantidad}, DATE_FORMAT('${stringfecha}','%Y,%m,%d %H:%i:%s') )`);
                    return res.status(200).json({
                            mensaje:"Productos extraidos exitosamente",
                            data:{
                                id_producto: id_producto,
                                cantidad: resultados[0].stock - cantidad
                            }
                        });
                }).catch((e)=>{
                    return res.status(500).json({mensaje:"Ha ocurrido un error en la inserción",data:null, error:e.message});
                });
            }else{
                return res.status(404).json({mensaje:"Cantidad del producto en bodega es insuficiente",data:null});
            }

            console.log(resultados[0].stock);
        }else{
            return res.status(404).json({mensaje:"Producto no existe",data:null});
        }
        return res.status(200).json({mensaje:"asdas"});
    });


});




module.exports = router;
