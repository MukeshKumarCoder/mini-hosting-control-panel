const router = require("express").Router();

const {
  deploy,

  getStatus,
} = require("../controllers/deployController");

router.post("/deploy", deploy);

router.get("/status/:id", getStatus);

module.exports = router;
