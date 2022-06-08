const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const Project = require("../models/project");
const Session = require("../models/Session");
const SubSession = require("../models/SubSession");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transport = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

const deactivateSession = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const sessionId = req.params.sid;

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

  if (session.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to deactivate session.",
      401
    );
    return next(error);
  }
  console.log(`session : ${session}`);

  session.activated = false;

  try {
    await session.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not deactivate session.",
      500
    );
    return next(error);
  }

  res.status(200).json({ session: session.toObject({ getters: true }) });
};

const createSession = async (req, res, next) => {
  const projectId = req.params.projectId;
  console.log(projectId);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed to create a session, please check your data.",
        422
      )
    );
  }

  // const { title, description, form } = req.body;
  const { title, description, startDate, endDate } = req.body;
  console.log(`title : ${title},
   description : ${description},`);
  console.log("startDate: " + startDate.stringDate);
  console.log("startDate: " + startDate.date);
  console.log("endDate: " + endDate.stringDate);

  //find user Data
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("fetching user failed, please try again", 500);
    return next(error);
  }
  console.log(user.image);

  const createdSession = new Session({
    title,
    description,
    startDate: { stringDate: startDate.stringDate, date: startDate.date },
    endDate: { stringDate: endDate.stringDate, date: endDate.date },
    date: Date.now(),
    creator: req.userData.userId,
    creatorData: { userEmail: user.email, userName: user.name },
    creatorImage: user.image,
    projectRef: projectId,
    state: "Closed",
    activated: true,
  });
  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "fetching project failed, please try again",
      500
    );
    return next(error);
  }
  if (!project) {
    return next(
      new HttpError("Could not find project with provided id, check id"),
      404
    );
  }
  console.log("the project is: " + project);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdSession.save({ session: sess });
    project.sessions.push(createdSession);
    project.closedSessions += 1;
    console.log("after pushing");
    await project.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating new session failed, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({
    session: createdSession.toObject({ getters: true }),
    CreatorImage: user.image,
  });
};

// DONE
const getSessionsByProjectId = async (req, res, next) => {
  const projectId = req.params.pid;
  // fetch project
  let projectWithSessions;
  try {
    projectWithSessions = await Project.findById(projectId).populate(
      "sessions"
    );
  } catch (err) {
    const error = new HttpError(
      "Fetching sessions failed, please try again later.",
      500
    );
    return next(error);
  }
  // check if project exists and if it has sessions
  if (!projectWithSessions || projectWithSessions.sessions.length === 0) {
    return next(
      new HttpError("Could not find sessions for the provided project id.", 404)
    );
  }
  //response project's sessions
  res.json({
    message: "here are the sessions",
    sessions: projectWithSessions.sessions
      .filter((item) => item.activated == true)
      .map((session) => session.toObject({ getters: true })),
  });
};

//DONE
const getSessionById = async (req, res, next) => {
  const projectId = req.params.pid;
  const sessionId = req.params.sid;
  //fetching project
  let projectWithSessions;
  try {
    projectWithSessions = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Fetching Project failed, Please try again",
      500
    );
    return next(error);
  }
  // check if project exists and if it has sessions
  if (!projectWithSessions || projectWithSessions.sessions.length === 0) {
    return next(
      new HttpError("Could not find sessions for the provided project id.", 404)
    );
  }
  //fetching session
  let session;
  try {
    session = await Session.findById(sessionId);
  } catch (err) {
    const error = new HttpError("Fetching form failed, Please try again", 500);
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
  // response session
  res.json({
    message: "here is the session",
    session: session.toObject({ getters: true }),
  });
};
// TESTING
const updateSession = async (req, res, next) => {
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

  const {
    title,
    description,
    state,
    startDate,
    startDateString,
    endDate,
    endDateString,
  } = req.body;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "fetching project failed, please try again",
      500
    );
    return next(error);
  }
  if (!project) {
    return next(
      new HttpError("Could not find project with provided id, check id"),
      404
    );
  }
  //fetching session
  let session;
  try {
    session = await Session.findById(sessionId);
  } catch (err) {
    const error = new HttpError("Fetching form failed, Please try again", 500);
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
  console.log("here is the session to update" + session);

  session.title = title;
  session.description = description;
  session.state = state;
  session.startDate = { stringDate: startDateString, date: startDate };
  session.endDate = { stringDate: endDateString, date: endDate };

  try {
    await session.save();
  } catch (err) {
    const error = new HttpError(
      "updating session failed, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "update session done",
    session: session.toObject({ getters: true }),
  });
};

const startSession = async (req, res, next) => {
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

  const { csvArray } = req.body;
  console.log("csvarray ", csvArray);
  //fetching project.
  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "fetching project failed, please try again",
      500
    );
    return next(error);
  }
  //check if project exists.
  if (!project) {
    return next(
      new HttpError("Could not find project with provided id, check id"),
      404
    );
  }
  //fetching session.
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
  //update session's 'bank list' TO CHANGE
  // session.title = title;
  // session.description = description;

  // TODO send mail from 'bank list'

  csvArray.map((item) => {
    console.log(item.Email);
    let token;
    try {
      token = jwt.sign(
        {
          email: item.Email,
        },
        "supersecret_dont_share",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError(
        "Creating Token, Please try again later.",
        500
      );
      return next(error);
    }
    session.SubSession.listToken.push({ name: item.Email, token: token });
    try {
      transport.sendMail({
        to: item.Email,
        from: "bdmat.reply@gmail.com",
        subject: project.title + " survey",
        html: `<h1> Session Begin, here is the survey!</h1>
        <p> Click this <a href="http://localhost:3000/form/${session.Forms[0]}/${token}"> Link </a></p>`,
      });
    } catch (err) {}
  });
  // save session
  try {
    await session.save();
  } catch (err) {
    const error = new HttpError(
      "updating session failed, please try again",
      500
    );
    return next(error);
  }
  // try{
  //   transport.sendMail({
  //     to: 'oussema.benrejab@gmail.com',
  //     from: "bdmat.reply@gmail.com",
  //     subject: project.title  + " survey",
  //     html: "<h1> you seccessfully signed up!</h1>",
  //   })
  // }catch(err){}

  //response
  res.status(200).json({
    message: "starting the session!",
    session: session.toObject({ getters: true }),
  });
};

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
const getSubSessionsIDSBySessionId = async (req, res, next) => {
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
  // check if session exists
  if (!sessionWithSubSessions) {
    return next(
      new HttpError("Could not find session with the provided id.", 404)
    );
  }
  //response project's sessions
  res.json({
    message: "here are the subsessions ids",
    subSesionsIds: sessionWithSubSessions.subSessions
      .filter((item) => item.activated == true)
      .map((subSession) => {
        return { id: subSession._id, axeName: subSession.title };
      }),
  });
};

const createSubSession = async (req, res, next) => {
  // const projectId = req.params.pid;
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
  const { title, form, csvArray } = req.body;
  console.log(`title:  ${title} , 
 forms : ${form} ,
 cvsArray: ${csvArray}  `);
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
    forms: [form],
    date: Date.now(),
    creator: req.userData.userId,
    bankMembers: csvArray,
    creatorData: {
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    },
    sessionRef: sessionId,
    state: "Pending",
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

  subSession.bankMembers.map((item) => {
    console.log(item.Email);
    let token;
    try {
      token = jwt.sign(
        {
          email: item.Email,
        },
        "supersecret_dont_share",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError(
        "Creating Token, Please try again later.",
        500
      );
      return next(error);
    }

    try {
      transport.sendMail({
        to: item.Email,
        from: "bdmat.reply@gmail.com",
        subject: " survey",
        html: `<h1> Session Begin, here is the survey!</h1>
        <p> Click this <a href="http://localhost:3000/form/"> Link </a></p>`,
      });
    } catch (err) {}
  });
  // if (session.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not authorized to deactivate session.",
  //     401
  //   );
  //   return next(error);
  // }

  subSession.state = "Started";
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

exports.startSession = startSession;
exports.createSession = createSession;
exports.getSessionsByProjectId = getSessionsByProjectId;
exports.getSessionById = getSessionById;
exports.updateSession = updateSession;
exports.deactivateSession = deactivateSession;
//subsessions
exports.createSubSession = createSubSession;
exports.getSubSessionsBySessionId = getSubSessionsBySessionId;
exports.deactivateSubSession = deactivateSubSession;

exports.startSubSession = startSubSession;
// TESTING
exports.getSubSessionsIDSBySessionId = getSubSessionsIDSBySessionId;
