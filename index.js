const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/user");

const app = express();
const port = 3005;

app.use(bodyParser.json());

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`App runing on ${port}`);
});
