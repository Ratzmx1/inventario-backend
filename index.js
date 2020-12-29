const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRouter = require("./src/routes/user");
const categoriesRouter = require("./src/routes/categories");
const entriesRouter = require("./src/routes/entries");
const productsRouter = require("./src/routes/products");
const providersRouter = require("./src/routes/providers");
const subcategoriesRouter = require("./src/routes/subcategories");
const outsRouter = require("./src/routes/outs");

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
