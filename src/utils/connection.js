const pmsql = require("promise-mysql");

const connect = () => {
  return pmsql.createConnection({
    host: "testinstance.c8k4acebsqsi.sa-east-1.rds.amazonaws.com",
    user: "admin",
    password: "12341234",
    port: 3306,
    database: "inventario",
  });
};

module.exports = connect;
