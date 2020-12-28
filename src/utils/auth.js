const express = require("express");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.trim().length > 10) {
    return jwt.verify(authorization, "LaPrivateKeyEstaAki", (err, decoded) => {
      if (decoded) {
        req.user = decoded;
        return next();
      } else {
        return res
          .status(401)
          .json({ status: 401, data: {}, message: "Unauthorized" });
      }
    });
  }
  return res
    .status(401)
    .json({ status: 401, data: {}, message: "Unauthorized" });
};

module.exports = auth;
