const express = require("express");
const router = express.Router();
const {
  logNewComplaint,
  getComplainsByEmail,
  getAllComplains,getTitle,createTitle
} = require("../model/complaintsmodel");

router.post("/logComplaint/", logNewComplaint);
router.get("/getComplainsByEmail/:email", getComplainsByEmail);
router.get("/getAllComplains/", getAllComplains);

router.get("/getTitle/", getTitle);
router.post("/createTitle/", createTitle);


module.exports = router;
