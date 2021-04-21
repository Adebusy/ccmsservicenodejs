const mongoose = require("mongoose");
const Joi = require("joi");
const getUserByEmail = require("../model/usermodel");
const Complaint = mongoose.model(
  "tblComplaint",
  new mongoose.Schema({
    referenceNumber: { type: String },
    email: { type: String, required: true },
    branchName: { type: String, required: true, uppercase: true },
    accountNumber: { type: String, required: true },
    complaintImplication: { type: String, required: true },
    complaintCategory: { type: String, required: true },
    complaintSubCategory: { type: String, required: true },
    complaintSubject: { type: String, required: true },
    complaintDescription: { type: String, required: true, uppercase: true },
    transactionDate: { type: Date, required: true },
    complaintPrayer: { type: String, required: true },
    dateReceived: { type: Date, required: true },
    disputeAmount: { type: String, required: true },
    amountRefunded: { type: String, required: true },
    remark: { type: String },
    dateClosed: { type: Date },
    status: { type: String, required: true },
    actionTaken: { type: String },
    addedBy: { type: String },
    updatedBy: { type: String },
    complaintType: { type: String, required: true },
    comment: { type: String },
  })
);

const titles = mongoose.model(
    "tblTitle",
    new mongoose.Schema({
      title: {type: String, required: true},
      isActive: {type: Boolean, required: true},
    })
);



function validateLogRequest(newComplaint) {
  const docheck = Joi.object({
    emailAddress: Joi.string().email().required(),
    accountNumber: Joi.string().required().max(10).min(8),
    complaintCategory: Joi.string().required(),
    complaintSubCategory: Joi.string().required(),
    complaintDescription: Joi.string().required(),
    complaintPrayer: Joi.string().required(),
    branchName: Joi.string(),
    complaintImplication: Joi.string().required(),
    complaintSubject: Joi.string().required(),
    transactionDate: Joi.string().required(),
    dateReceived: Joi.date().raw(),
    disputeAmount: Joi.string(),
    amountRefunded: Joi.string(),
    remark: Joi.string(),
    dateClosed: Joi.date().raw(),
    status: Joi.string(),
    actionTaken: Joi.string(),
    addedBy: Joi.string(),
    updatedBy: Joi.string(),
    complaintType: Joi.string(),
    comment: Joi.string(),
  });
  return Joi.validate(newComplaint, docheck);
}

async function confirmComplaintNotAlreadyUnderProcess(request) {
  try {
    let retLogin = await Complaint.findOne({
      email: request.body.email,
      status: "0",
      complaintCategory: request.body.complaintCategory,
      complaintSubCategory: request.body.complaintSubCategory,
      disputeAmount: request.body.disputeAmount,
    });
    console.log(retLogin);
    if (retLogin != null) return true;
    return false;
  } catch (ex) {
    console.log(ex);
    return false;
  }
}

async function logNewComplaint(request, response) {
  try {
    console.log(request.body.emailAddress);
    var email = request.body.emailAddress;
    const doCheck = validateLogRequest(request.body);
    if (doCheck.error)
      return response.status(400).send(doCheck.error.details[0].message);
    var userDetail = await getUserByEmail.CheckUserByEmail(email);
    if (!userDetail)
      return response.status(400).send(`user ${email}does not exist`);
    let checkRe = await confirmComplaintNotAlreadyUnderProcess(request);
    if (checkRe)
      return response
        .status(400)
        .send("Request already logged. Please wait for us to get back.");
    let requestReference = await generateReference();
    const doInsert = logComplaint(request.body, requestReference.toString());
    if (doInsert <= 0)
      return response.status(400).send(doInsert.error.details[0].message);
    return response.status(200).send("request submitted");
  } catch (ex) {
    console.log(ex.message);
  }
}
async function generateReference() {
  let RefDate = new Date();
  let month = ("0" + (RefDate.getMonth() + 1)).slice(-2);
  let year = RefDate.getFullYear();
  let hours = RefDate.getHours();
  let minutes = RefDate.getMinutes();
  let seconds = RefDate.getSeconds();
  let millSeconds = RefDate.getMilliseconds();
  const retRef = `CMS${month.toString()}${year.toString()}${hours.toString()}${minutes.toString()}${seconds.toString()}${millSeconds.toString()}`;
  console.log(`new reference 1 ${retRef}`);
  return retRef;
}
async function logComplaint(compRec, refernceNo) {
  const logOBj = new Complaint({
    referenceNumber: refernceNo,
    email: compRec.emailAddress,
    branchName: "Virtual",
    accountNumber: compRec.accountNumber,
    complaintImplication: compRec.complaintImplication,
    complaintCategory: compRec.complaintCategory,
    complaintSubCategory: compRec.complaintSubCategory,
    complaintSubject: compRec.complaintSubject,
    complaintDescription: compRec.complaintDescription,
    transactionDate: compRec.transactionDate,
    complaintPrayer: compRec.complaintPrayer,
    dateReceived: Date.now(),
    disputeAmount: compRec.disputeAmount,
    amountRefunded: compRec.amountRefunded,
    remark: "complaint received",
    dateClosed: Date.now(),
    status: "0",
    actionTaken: "complaint received",
    updatedBy: "non",
    complaintType: "card complain",
    comment: "new complaint",
  });
  try {
    const doLog = await logOBj.save();
    return doLog._id;
  } catch (ex) {
    console.log(ex.message);
    return 0;
  }
}

async function getComplainsByEmail(request, response) {
  console.log(request.params.email);
  try {
    let query = await Complaint.find({ email: request.params.email }).sort(
      "_id"
    );
    return response.status(200).send(query);
  } catch (ex) {
    console.log(ex);
  }
}

async function getAllComplains(request, response) {
  try {
    let query = await Complaint.find({}).sort("_id");
    return response.status(200).send(query);
  } catch (ex) {
    console.log(ex);
  }
}

async function getTitle(request, response) {
  try {
    let query = await titles.find().sort("_id");
    return response.status(200).send(query);
  } catch (ex) {
    console.log(ex);
  }
}
async function createTitle(request, response) {
  console.log(request);
  const logOBj = new titles({
    title: request.body.title,
    isActive: true,
  });
  try {
    const doLog = await logOBj.save();
    if(doLog) return response.status(200).send("Title created successfully");
    return response.status(400).send(`user ${request.name} does not exist`);
  } catch (ex){
    console.log(ex.message);
    return response.status(400).send(`user ${request.name}does not exist`);
  }
}


exports.logNewComplaint = logNewComplaint;
exports.validateLogRequest = validateLogRequest;
exports.getComplainsByEmail = getComplainsByEmail;
exports.getAllComplains = getAllComplains;
exports.getTitle =getTitle;
exports.createTitle = createTitle;
