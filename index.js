const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3005;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`App runing on ${port}`);
});
