const mongoose = require("mongoose");
const Joi = require("joi");
const randStr = require("randomstring");
const User = mongoose.model(
  "tblUsers",
  new mongoose.Schema({
    title: { type: String, required: true },
    fullName: { type: String, required: true, uppercase: true },
    postalCode: { type: String, required: true },
    homeAddress: { type: String, required: true, uppercase: true },
    phone: { type: String, required: true, min: 10, max: 15 },
    dateOfBirth: { type: String, required: true, min: 10, max: 15 },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6, maxlength: 15 },
    dataAdded: { type: "date", default: Date.now },
    isActive: { type: Boolean, default: true },
    AccountNo: { type: String, required: true, default: "000223232" },
  })
);

const UserPicture = mongoose.model(
  "tblUsersPictures",
  new mongoose.Schema({
    email: { type: String, required: true },
    imageURI: { type: String, required: true },
    dataAdded: { type: "date", default: Date.now },
    isActive: { type: Boolean, default: true },
  })
);

function validatePicture(PictureDetail) {
  const Schema = {
    email: Joi.string().max(50).required(),
    imageURI: Joi.string().required(),
  };
  return Joi.validate(PictureDetail, Schema);
}

function validateLoginRequest(loginDetail) {
  const Schema = {
    username: Joi.string().min(6).max(10).required(),
    password: Joi.string().min(6).max(15).required(),
  };
  return Joi.validate(loginDetail, Schema);
}
function validateUser(user) {
  const Schema = {
    title: Joi.string().max(5).required(),
    fullName: Joi.string().required(),
    postalCode: Joi.string().required(),
    homeAddress: Joi.string().max(50).required(),
    phone: Joi.string().max(17).min(11).required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).max(15).required(),
  };
  return Joi.validate(user, Schema);
}
async function LogMeIn(request, resp) {
  try {
    console.log("nmnbbmb  "+ request.params.email.trim());
    console.log(request.params.password.trim());
    let retLogin = await User.findOne({
      email: request.params.email.trim(),
      password: request.params.password.trim(),
    });
    console.log(retLogin);
    if (retLogin != null) return resp.status(200).send(retLogin);
    return resp.status(400).send("Invalid userName or passwords");
  } catch (ex) {
    console.log(ex);
    return resp.status(400).send("Invalid userName or passwords");
  }
}
async function getUserByEmail(request, resp) {
  console.log(request.params.email);
  let getUsr = await User.findOne({ email: request.params.email });
  if (getUsr.error)
    return resp.status(400).send(getUsr.error.details[0].message);
  return resp.status(200).send(getUsr);
}

async function CheckUserByEmail(email) {
  console.log(email);
  let getUsr = await User.findOne({ email: email });
  if (getUsr.error) return;
  return getUsr;
}

async function ListUsers(req, resp) {
  try {
    let getUsr = await User.find();
    return resp.status(200).send(getUsr);
  } catch (ex) {
    console.log(ex);
    return "error occurred";
  }
}
async function CheckAndCreateNewUser(request, resp) {
  try {
    let validateReq = await validateUser(request.body);
    if (validateReq.error)
      return resp.status(400).send(validateReq.error.details[0].message);
  } catch (ex) {
    console.log(ex);
  }
  try {
    //check Email does not exist before
    let retUser = await User.findOne({ email: request.body.email }); //.pretty();
    if (retUser != null) {
      return resp.status(400).send("Email already exists");
    }
  } catch (ex) {
    console.log(ex);
  }
  //check Email does not exist before
  let retUser = await UserPicture.findOne({ email: request.body.email }); //.pretty();
  if (retUser != null) {
    return resp.status(400).send("email already exists for this user");
  }

  try {
    const createNew = await CreateUser(request.body);
    if (createNew != null) {
      return resp
        .status(200)
        .send(`New user with record id ${createNew} was created successfully`);
    }
    return resp.status(400).send("Unable to create user at the moment");
  } catch (ex) {
    console.log(ex);
  }
}
async function uploadUserPicture(req, resp) {
  try {
    let validateReq = await validatePicture(request.body);
    if (validateReq.error)
      return resp.status(400).send(validateReq.error.details[0].message);
  } catch (ex) {
    console.log(ex);
  }
  let retUser = await validatePicture.findOne({ email: request.body.phone }); //.pretty();
  if (retUser != null) {
    return resp.status(400).send("phone already exists");
  }
  //upload picture
  const newPicture = new UserPicture({
    email: req.body.email,
    imageURI: req.body.imageURI,
  });
  const saveRec = await newPicture.save();
  return saveRec._id;
}

async function UpdatePassword(req, resp) {
  let yourString = randStr.generate(8);
  const updateRec = await User.updateOne(
    { email: req.params.email.trim() },
    { $set: { password: yourString } },
    { upsert: true }
  );
  if (updateRec) return resp.status(200).send("password updated successfully");
  return resp
    .status(400)
    .send("Unable to update recover password at the moment");
}

async function CreateUser(reqBody) {
  const newUser = new User({
    title: reqBody.title,
    fullName: reqBody.fullName,
    postalCode: reqBody.postalCode,
    homeAddress: reqBody.homeAddress,
    phone: reqBody.phone,
    dateOfBirth: reqBody.dateOfBirth,
    email: reqBody.email,
    password: reqBody.password,
    dataAdded: Date.now(),
    isActive: true,
    AccountNo: reqBody.AccountNo,
  });
  const saveRec = await newUser.save();
  return saveRec._id;
}

module.exports.validateUser = validateUser;
module.exports.userModelClass = User;
module.exports.validateLoginRequest = validateLoginRequest;
exports.LogMeIn = LogMeIn;
exports.CheckAndCreateNewUser = CheckAndCreateNewUser;
exports.CreateUser = CreateUser;
exports.UpdatePassword = UpdatePassword;
exports.uploadUserPicture = uploadUserPicture;
exports.getUserByEmail = getUserByEmail;
exports.ListUsers = ListUsers;
exports.CheckUserByEmail = CheckUserByEmail;
