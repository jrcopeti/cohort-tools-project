// ROUTES - https://expressjs.com/en/starter/basic-routing.html
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

module.exports = router;
