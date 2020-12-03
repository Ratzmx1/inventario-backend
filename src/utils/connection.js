const pmsql = require("promise-mysql");

const connect = () => {
  return pmsql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "inventario",
    charset: "utf8_general_ci",
  });
};

module.exports = connect;
