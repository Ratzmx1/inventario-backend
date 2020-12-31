const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const outsRouter = require("./src/routes/salidas");
const userRouter = require("./src/routes/usuarios");
const entriesRouter = require("./src/routes/entradas");
const productsRouter = require("./src/routes/productos");
const providersRouter = require("./src/routes/proveedores");
const categoriesRouter = require("./src/routes/categorias");
const subcategoriesRouter = require("./src/routes/subcategorias");

const app = express();
const port = 3005;

app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/outs", outsRouter);
app.use("/entries", entriesRouter);
app.use("/products", productsRouter);
app.use("/providers", providersRouter);
app.use("/categories", categoriesRouter);
app.use("/subcategories", subcategoriesRouter);

app.listen(port, () => {
  console.log(`App runing on ${port}`);
});
