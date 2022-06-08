const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const Project = require("../models/project");
const Session = require("../models/Session");
const SubSession = require("../models/SubSession");
const Answer = require("../models/Answer");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const transport = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

// SUBSESSIONS MANAGMENT
const getSubSessionsBySessionId = async (req, res, next) => {
  const sessionId = req.params.sid;
  // fetch project
  let sessionWithSubSessions;
  try {
    sessionWithSubSessions = await Session.findById(sessionId).populate(
      "subSessions"
    );
  } catch (err) {
    const error = new HttpError(
      "Fetching session failed, please try again later.",
      500
    );
    return next(error);
  }
  // check if project exists and if it has sessions
  if (!sessionWithSubSessions) {
    return next(
      new HttpError("Could not find session with the provided id.", 404)
    );
  }
  //response project's sessions
  res.json({
    message: "here are the subsessions",
    subSesions: sessionWithSubSessions.subSessions
      .filter((item) => item.activated == true)
      .map((subSession) => subSession.toObject({ getters: true })),
  });
};

const createSubSession = async (req, res, next) => {
  const projectId = req.params.pid;
  const sessionId = req.params.sid;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed to create a session, please check your data.",
        422
      )
    );
  }
  //  TO CHANGE TODO  forms
  const {
    title,
    description,
    startDate,
    startDateString,
    endDate,
    endDateString,
    form,
    csvArray,
  } = req.body;

  console.log(`title:  ${title} , 
   forms : ${form} ,
   cvsArray: ${csvArray}, 
   date .............  
   startDate : ${startDate.date},
   startDateString : ${startDate.stringDate} ,
   endDate : ${endDate.date},
   endDateString : ${endDate.stringDate},
   
   `);
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
  if (!session || session.length === 0) {
    return next(
      new HttpError(
        "Could not find session for the provided project & session id .",
        404
      )
    );
  }

  //find user Data
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("fetching user failed, please try again", 500);
    return next(error);
  }

  const createdSubSession = new SubSession({
    title,
    description,
    forms: [form],
    date: Date.now(),
    creator: req.userData.userId,
    bankMembers: csvArray,
    startDate: { stringDate: startDate.stringDate, date: startDate.date },
    endDate: { stringDate: endDate.stringDate, date: endDate.date },
    creatorData: {
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    },
    sessionRef: sessionId,
    projectRef: projectId,
    state: "Closed",
    activated: true,
  });
  // save session
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdSubSession.save({ session: sess });
    session.subSessions.push(createdSubSession);
    session.forms.push(form);
    await session.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating subSession failed, please try again",
      500
    );
    return next(error);
  }

  //response
  res.status(200).json({
    message: "here is the subsession!",
    subSession: createdSubSession.toObject({ getters: true }),
  });
};

const updateSubSession = async (req, res, next) => {
  // const projectId = req.params.pid;
  const sessionId = req.params.sid;
  const subSessionId = req.params.ssid;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed to create a session, please check your data.",
        422
      )
    );
  }
  //  TO CHANGE TODO  forms
  const { title, description, startDate, endDate, state, form, csvArray } =
    req.body;

  console.log(`title:  ${title} , 
  
   date .............  
   startDate : ${startDate.date},
   startDateString : ${startDate.stringDate} ,
   endDate : ${endDate.date},
   endDateString : ${endDate.stringDate},
   
   `);
  console.log("csvArray" + csvArray);
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
  if (!session || session.length === 0) {
    return next(
      new HttpError(
        "Could not find session for the provided project & session id .",
        404
      )
    );
  }
  //fetching subsession
  let subSession;
  try {
    subSession = await SubSession.findById(subSessionId);
  } catch (err) {
    const error = new HttpError(
      "Fetching subSession failed, Please try again",
      500
    );
    return next(error);
  }
  // check if subsession exists.
  if (!subSession || subSession.length === 0) {
    return next(
      new HttpError(
        "Could not find session for the provided project & session id .",
        404
      )
    );
  }

  subSession.title = title;
  subSession.description = description;
  subSession.state = state;
  if (csvArray) {
    subSession.bankMembers = csvArray;
  }
  if (form != null) {
    subSession.forms = [form];
  }

  subSession.startDate = {
    stringDate: startDate.stringDate,
    date: startDate.date,
  };
  subSession.endDate = { stringDate: endDate.stringDate, date: endDate.date };

  // save subsession
  try {
    await subSession.save();
  } catch (err) {
    const error = new HttpError(
      "saving subSession failed, please try again",
      500
    );
    return next(error);
  }

  //response
  res.status(200).json({
    message: "here is the updated subsession!",
    subSession: subSession.toObject({ getters: true }),
  });
};
const deactivateSubSession = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const sessionId = req.params.sid;
  const subSessionId = req.params.ssid;
  //fetching session
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
  if (!session) {
    const error = new HttpError("Could not find session for provided id.", 404);
    return next(error);
  }

  //fetching subsession
  let subSession;
  try {
    subSession = await SubSession.findById(subSessionId);
  } catch (err) {
    const error = new HttpError(
      "Something wen wrong, could not find subsession",
      500
    );
    return next(error);
  }
  if (!subSession) {
    const error = new HttpError(
      "Could not find subSession for provided id.",
      404
    );
    return next(error);
  }

  // if (session.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not authorized to deactivate session.",
  //     401
  //   );
  //   return next(error);
  // }

  subSession.activated = false;

  try {
    await subSession.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not deactivate subsession.",
      500
    );
    return next(error);
  }

  res.status(200).json({ subSession: subSession.toObject({ getters: true }) });
};

const startSubSession = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const projectId = req.params.pid;
  const sessionId = req.params.sid;
  const subSessionId = req.params.ssid;
  //fetching session
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
  if (!session) {
    const error = new HttpError("Could not find session for provided id.", 404);
    return next(error);
  }

  //fetching subsession
  let subSession;
  try {
    subSession = await SubSession.findById(subSessionId);
  } catch (err) {
    const error = new HttpError(
      "Something wen wrong, could not find subsession",
      500
    );
    return next(error);
  }
  if (!subSession) {
    const error = new HttpError(
      "Could not find subSession for provided id.",
      404
    );
    return next(error);
  }

  let bankMemberArray = [];
  console.log(`subSession.bankMembers ${JSON.stringify(subSession.bankMembers)}`);
  subSession.bankMembers.map((item) => {
    console.log("item.Name" + item.Name);
    console.log("item.Email" + item.Email);
    let token;
    try {
      token = jwt.sign(
        {
          email: item.Email,
        },
        "supersecret_dont_share",
        { expiresIn: "1h" }
      );

      bankMemberArray.push({
        Name: item.Name,
        Email: item.Email,
        token: token,
        valid: true,
      });
    } catch (err) {
      const error = new HttpError(
        "Creating Token, Please try again later.",
        500
      );
      return next(error);
    }
    console.log(`item.Email ${item.Email},
    JSON.stringify(item.Email) ${JSON.stringify(item.Email)}
    subSession.forms[0]
    
    `);

    try {
      return transport.sendMail({
        to: "oussema.benrejab@gmail.com",
        from: "bdmat.reply@gmail.com",
        subject: "EY Survey",
        html: `<h1>EY Survey</h1>
          <p>Surveys are completly Anonymous, No personal data are collected. Please answer the survey alone. Dont share this link with no one. </p>
          <p>
            Survey link 
            
          </p>`,
      });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not send Email.",
        500
      );
      return next(error);
    }
  });
  // if (session.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not authorized to deactivate session.",
  //     401
  //   );
  //   return next(error);
  // }

  // TO CHANGE

  subSession.bankMembers = bankMemberArray;
  subSession.state = "Pending";
  try {
    await subSession.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not save subsession.",
      500
    );
    return next(error);
  }

  res.status(200).json({ subSession: subSession.toObject({ getters: true }) });
};
const getAnswersBySubSessionId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const subSessionId = req.params.ssid;
  //fetching subsession
  let subSession;
  try {
    subSession = await SubSession.findById(subSessionId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find session.",
      500
    );
    return next(error);
  }
  // check subsession existing
  if (!subSession) {
    const error = new HttpError("Could not find session for provided id.", 404);
    return next(error);
  }
  // fetching answers;
  let answers;
  try {
    answers = await Answer.find({ subSessionRef: subSessionId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find session.",
      500
    );
    return next(error);
  }
  // check subsession existing
  if (!answers) {
    const error = new HttpError("Could not find session for provided id.", 404);
    return next(error);
  }
  res.status(200).json({
    message: "Fetching answers successful.",
    subSession: subSession,
    answers: answers,
  });
};
//subsessions
exports.getSubSessionsBySessionId = getSubSessionsBySessionId;
exports.createSubSession = createSubSession;
exports.updateSubSession = updateSubSession;
exports.deactivateSubSession = deactivateSubSession;
exports.startSubSession = startSubSession;
// TESTING
exports.getAnswersBySubSessionId = getAnswersBySubSessionId;
