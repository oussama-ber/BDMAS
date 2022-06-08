const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
//models
const Form = require("../models/Form");
const User = require("../models/user");
const Project = require("../models/project");
const Session = require("../models/Session");
const SubSession = require("../models/SubSession");
const Answer = require("../models/Answer");

const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bdmat.reply@gmail.com",
    pass: "123456OO@aa",
  },
});
const sendMailtesting = async (req, res, next) => {
  try {
    var mailOptions = {
      from: "bdmat.reply@gmail.com", // sender address
      to: "oussema.benrejab@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log("err" + err);
  }
  res.status(200).json({
    message: "sending email!!!",
  });
};
// DONE
const getFormById = async (req, res, next) => {
  const formId = req.params.formId;
  console.log(`form id :  ${formId}`);
  let form;
  try {
    form = await Form.find({ _id: formId });
  } catch (err) {
    const error = new HttpError(
      "Fetching forms failed, Please try again later.",
      500
    );
    return next(error);
  }
  if (!form) {
    return next(
      new HttpError(
        "Could not find any forms by provided id. Please try another one.",
        404
      )
    );
  }

  res.status(200).json({ form: form });
};

// DONE
const getForms = async (req, res, next) => {
  let forms;
  try {
    forms = await Form.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching forms failed, Please try again later.",
      500
    );
    return next(error);
  }
  if (!forms || forms.length === 0) {
    return next(new HttpError("Could not find any forms", 404));
  }
  res
    .status(200)
    .json({ forms: forms.map((form) => form.toObject({ getters: true })) });
};
// DONE IMPORTANT (but not sure if it's the correct way)
const createQuestionForm = async (req, res, next) => {
  // const sessionId = req.params.sid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed to create a Question form, please check your data.",
        422
      )
    );
  }
  const { formQuestion } = req.body;
  console.log(" formQuestion : ", formQuestion);
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user.",
      500
    );
    return next(error);
  }
  if (!user) {
    return next(new HttpError("Could not find user by provided id.....", 404));
  }
  const existingUser = {
    userName: user.name,
    userImage: user.image,
    userEmail: user.email,
  };

  const createdForm = new Form({
    form: JSON.stringify(formQuestion),
    creator: req.userData.userId,
    createdBy: JSON.stringify(existingUser),
    hidden: false,
  });
  console.log(createdForm);

  try {
    await createdForm.save();
  } catch (err) {
    const error = new HttpError(
      "Saving form Failed. Please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ form: createdForm.toObject({ getters: true }) });
};
// DONE
const deleteFormById = async (req, res, next) => {
  const formId = req.params.fid;
  let form;
  try {
    form = await Form.findById(formId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find form.",
      500
    );
    return next(error);
  }

  if (!form) {
    const error = new HttpError("Could not find form.", 404);
    return next(error);
  }
  console.log(
    "form creator : ",
    form.creator._id,
    "req.userId : ",
    req.userData.userId
  );
  console.log(
    form.creator._id != req.userData.userId,
    form.creator._id !== req.userData.userId
  );
  if (form.creator._id != req.userData.userId) {
    const error = new HttpError("You are not authorized to delete Form.", 403);
    return next(error);
  }
  try {
    await form.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete form.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted Form." });
};
const updateForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed to create a Question form, please check your data.",
        422
      )
    );
  }

  const { formQuestion } = req.body;
  const formId = req.params.formId;

  let form;
  try {
    form = await Form.findById(formId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update form.",
      500
    );
    return next(error);
  }
  if (!form) {
    const error = new HttpError("Could not find form for provided id.", 404);
    return next(error);
  }
  // if (form.creator.toString() === req.userData.userId) {
  //   console.log("You are authorized to update Form.");
  // }

  if (form.creator._id != req.userData.userId) {
    const error = new HttpError("You are not authorized to update Form.", 403);
    return next(error);
  }
  // console.log('before' , form.form);
  form.form = JSON.stringify(formQuestion);
  // console.log('after', form.form);

  try {
    await form.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update form.",
      500
    );
    return next(error);
  }

  res.status(200).json({ form: form.toObject({ getters: true }) });
};

const deactivateForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed to create a Question form, please check your data.",
        422
      )
    );
  }
  const formId = req.params.formId;

  let form;
  try {
    form = await Form.findById(formId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update form.",
      500
    );
    return next(error);
  }
  if (!form) {
    const error = new HttpError("Could not find form for provided id.", 404);
    return next(error);
  }
  // if (form.creator.toString() === req.userData.userId) {
  //   console.log("You are authorized to update Form.");
  // }

  if (form.creator._id != req.userData.userId) {
    const error = new HttpError("You are not authorized to update Form.", 403);
    return next(error);
  }
  console.log("form hidden   : ", form.hidden);
  form.hidden = true;

  try {
    await form.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update form.",
      500
    );
    return next(error);
  }

  res.status(200).json({ form: form.toObject({ getters: true }) });
};
const getFormsBySessionId = async (req, res, next) => {
  const sessionId = req.params.sid;
  let session;
  try {
    session = await Session.findById(sessionId);
  } catch (err) {
    const error = new HttpError(
      "Fetching session failed, Please try again",
      500
    );
    return next(error);
  }
  // check if session exists.
  if (!session) {
    return next(
      new HttpError(
        "Could not find session for the provided project & session id .",
        404
      )
    );
  }

  res.status(200).json({
    message: "here are the forms ",
    forms: session.forms.map((form) => form.toObject({ getters: true })),
  });
};

// TESTING
// could no get the answer from body(undefined). could not get email (of the user) from existing subsession
const postAnswer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed to create a Question form, please check your data.",
        422
      )
    );
  }
  //  get data (IDs & token)from the link
  const projectId = req.params.pid;
  const sessionId = req.params.sid;
  const subSessionId = req.params.ssid;
  const formId = req.params.fid;
  const token = req.params.token;

  console.log(`
  projectId : ${projectId},
  sessionId : ${sessionId},
  subSessionId: ${subSessionId},
  `);
  // get data from the body
  const { answer } = req.body;
  console.log(answer);
  console.log(JSON.stringify(answer));

  if (!token || token.length == 0) {
    const error = new HttpError(
      "You can submit your answer. You are not authorized!",
      401
    );
    return next(error);
  }
  //fetch Project
  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find project.",
      500
    );
    return next(error);
  }
  // check project existence
  if (!project) {
    return next(
      new HttpError("Could not find project by provided id.....", 404)
    );
  }

  //fetch Session
  let session;
  try {
    session = await Session.findById(sessionId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find session.",
      500
    );
    return next(error);
  }
  // check session existence
  if (!session) {
    return next(
      new HttpError("Could not find session by provided id.....", 404)
    );
  }

  //fetch SubSession
  let subSession;
  try {
    subSession = await SubSession.findById(subSessionId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find subSession.",
      500
    );
    return next(error);
  }
  // check subsession existence
  if (!subSession) {
    return next(
      new HttpError("Could not find SubSession by provided id.....", 404)
    );
  }

  // fetch Form
  let form;
  try {
    form = await Form.findById(formId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find form.",
      500
    );
    return next(error);
  }
  // check form existence
  if (!form) {
    return next(new HttpError("Could not find form by provided id.....", 404));
  }
  // delete the token of the user, to make the submission process only once.
  const existingUserObject = subSession.bankMembers.find(
    (element) => element.token == token
  );
  let memberIndex = null;
  let member;
  const testing = subSession.bankMembers.map((item, index) => {
    if (item.token === token) {
      member = item;
      memberIndex = index;
    }
  });
  if (member.valid === false) {
    console.log("shieeeeeeeeeeeeeeeeeeeeeeeeeeeet");
    return next(new HttpError("You have already submitted your answer", 403));
  }
  const updatedBankMembers = subSession.bankMembers.map((item) => {
    if (item.token === token) {
      return { ...item, valid: false };
    }
    return item;
  });
  console.log(`the updatedBankMembers ${JSON.stringify(updatedBankMembers)}`);
  console.log(
    `member is member is valid ? : ${subSession.bankMembers[memberIndex].valid}`
  );
  subSession.bankMembers = updatedBankMembers;

  try {
    await subSession.save();
  } catch (err) {
    const error = new HttpError("You have already submitted your answer", 403);
    return next(error);
  }

  console.log(
    `updated SubSession ${JSON.stringify(subSession.bankMembers[memberIndex])}`
  );
  const answerCreated = new Answer({
    email: existingUserObject.Email,
    token,
    answer: JSON.stringify(answer),
    activated: true,
    date: Date.now(),
    projectRef: projectId,
    sessionRef: sessionId,
    subSessionRef: subSessionId,
    formRef: formId,
  });
  // console.log("answerCreated" + answerCreated);
  // existingUserObject.token= "";

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    console.log("here 0");
    await answerCreated.save({ session: sess });
    // subSession.answers.push(answerCreated);
    console.log("here 1");

    subSession.answersRef.push(answerCreated);
    // await subSession.save({ session: sess });
    // subSession.bankMembers[memberIndex].valid = false;

    await subSession.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "submiting answer failer, please try again",
      500
    );
    return next(error);
  }
  //response
  res.status(200).json({
    message: "form Submission done!",
    answerCreated: answerCreated.toObject({ getters: true }),
  });
};
// Could not get answers from controller & router. replaced here, cause of cors IMPORTANT
// TESTING
const getAnswerBySessionId = async (req, res, next) => {
  const subSessionId = req.params.sid;
  console.log("subSessionId" + subSessionId);
  let answers;
  try {
    answers = await Answer.find({ sessionRef: subSessionId });
  } catch (err) {
    const error = new HttpError(
      "Fetching answers failed, Please try again later.",
      500
    );
    return next(error);
  }
  if (!answers) {
    return next(new HttpError("Could not find any answer", 404));
  }

  let finalResult = [];
  const filtredAnswers = answers.map(async (element, index) => {
    let answersPerAxe = [];
    try {
      console.log("element.subSessionRef : " + element.subSessionRef);
      answersPerAxe = await Answer.find({
        subSessionRef: element.subSessionRef,
      });
      console.log("answersPerAxe of index " + index + "are :" + answersPerAxe);
      finalResult.push(JSON.stringify(answersPerAxe));
      return JSON.stringify(answersPerAxe);
    } catch (err) {
      const error = new HttpError(
        "Fetching answers failed, Please try again later.",
        500
      );
      return next(error);
    }
  });

  console.log("finalResult : " + finalResult);
  res.status(200).json({
    message: "fetching answers successful!!!",

    answers: answers,
  });
};
// get answers from subsession
const getAnswersBySubSessionId = async (req, res, next) => {
  const subSessionId = req.params.ssid;
  let answers;
  try {
    answers = await Answer.find({ subSessionRef: subSessionId });
  } catch (err) {
    const error = new HttpError(
      "Fetching answers failed, Please try again later.",
      500
    );
    return next(error);
  }
  if (!answers) {
    return next(
      new HttpError(
        "Could not find any answer with provided subsession id.",
        404
      )
    );
  }
  console.log("answers from backend: " + answers);
  res.status(200).json({
    message: "fetching answers successful!!!",
    answers: answers,
  });
};

// DONE
exports.createQuestionForm = createQuestionForm;
exports.getForms = getForms;
exports.getFormById = getFormById;
exports.deleteFormById = deleteFormById;
exports.updateForm = updateForm;
exports.deactivateForm = deactivateForm;
// TESTING
exports.getFormsBySessionId = getFormsBySessionId;
// TESTING
exports.postAnswer = postAnswer;
// TESTING
exports.getAnswerBySessionId = getAnswerBySessionId;
exports.getAnswersBySubSessionId = getAnswersBySubSessionId;

exports.sendMailtesting = sendMailtesting;
