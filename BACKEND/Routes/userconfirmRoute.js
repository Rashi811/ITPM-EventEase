const express = require("express");
// const confirmontroller = require("../Controller/userconfirmController");
const confirmontroller = require("../Controller/UserconfirmController");

const router = express.Router();

// Route Definitions
router.post("/create", confirmontroller.createConfirm);
router.get("/allconfirm", confirmontroller.getAllConfirms);
router.get("/confrim/:email", confirmontroller.getConfirm);
router.put("/confrim/:id", confirmontroller.editConfirm);
router.delete("/delete", confirmontroller.deleteAllItems);



module.exports = router;
