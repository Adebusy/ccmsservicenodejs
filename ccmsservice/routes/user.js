const express = require("express");
const router = express.Router();
const {
  validateUser,
  userModelClass,
  validateLoginRequest,
  LogMeIn,
  CheckUserByEmail,
  CreateUser,
  UpdatePassword,
  CheckAndCreateNewUser,
  uploadUserPicture,
  ListUsers,
  getUserByEmail,
} = require("../model/usermodel");
router.get("/login/:email/:password", LogMeIn); //router.post("/login/", LogMeIn);
router.post("/CheckAndCreateNewUser", CheckAndCreateNewUser);
router.get("/passwordRecovery/:email", UpdatePassword);
router.post("/uploadUserPicture", uploadUserPicture);
router.get("/ListUsers", ListUsers);
router.get("/getUserByEmail/:email", getUserByEmail);

module.exports = router;
