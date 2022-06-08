const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const Project = require("../models/project");
const Session = require("../models/Session");
const User = require("../models/user");
const Answer = require("../models/Answer");

// DONE
const getProjects = async (req, res, next) => {
  let projects;
  try {
    projects = await Project.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find projects.",
      500
    );
    return next(error);
  }

  if (!projects) {
    const error = new HttpError("Could not find projects.", 404);
    return next(error);
  }
  console.log("bla");

  res.json({
    projects: projects
      .filter((item) => item.activated == true)
      .map((project) => project.toObject({ getters: true })),
  });
};
const getProjectsWithAnswers = async (req, res, next) => {
  let projects;
  try {
    projects = await Project.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find projects.",
      500
    );
    return next(error);
  }

  if (!projects) {
    const error = new HttpError("Could not find projects.", 404);
    return next(error);
  }

  let answers;
  try {
    answers = await Answer.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find Answers.",
      500
    );
    return next(error);
  }

  if (!answers) {
    const error = new HttpError("Could not find answers.", 404);
    return next(error);
  }
  // projectids array
  const projectIds = projects.map((project) => {
    return { id: project._id, title: project.title };
  });

  const allprojectIds = answers.map((item) => {
    return JSON.stringify(item.projectRef);
  });
  // console.log(`allprojectIds ${allprojectIds}`);
  let uniqueProjectIds = [...new Set(allprojectIds)];
  // console.log(`uniquePRojectIds ${typeof uniqueProjectIds}`);

  // loop into all project that has answers
  const projectsAverage = uniqueProjectIds.map((projectID) => {
    // fetch answers of this project
    const projectAnswers = answers.filter((answer) => {
      return JSON.stringify(answer.projectRef) === projectID;
    });

    const projectAnswersValues = projectAnswers.map((item) => {
      const form = JSON.parse(item.answer).answer;
      // console.log(`form ${JSON.stringify(form)}`);
      const questions = form.map((item) => {
        if (item.type === "radiogroup" || item.type === "rating") {
          return +item.value * +item.coef;
        } else if (item.type === "checkbox") {
          let sum = 0;
          item.answersWithVal.map((option, index) => {
            sum = sum + +option.value * +item.coef;
          });
          return sum / item.answersWithVal.length;
        }
      });
      // calculate the average.
      let questionsAverage;
      let questionsSum = 0;
      questions.map((question) => {
        questionsSum = questionsSum + question;
      });

      questionsAverage = questionsSum / questions.length;
      console.log(`questionsAverage ${questionsAverage}`);
      return questionsAverage;
    });
    let summ = 0;
    let averagee = 0;
    projectAnswersValues.map((item) => {
      summ = summ + item;
    });
    
    averagee = summ / projectAnswersValues.length;
    let projectName;
    let projectAddress
    let projectState; 
    let creatorData;
    let startDate;
    let endDate; 

    projects.map((project) => {
      if (JSON.stringify(project._id) === projectID) {
        projectName = project.title;
        projectState = project.state;
        creatorData = project.creatorData;
        startDate = project.startDate; 
        endDate = project.endDate;
        projectAddress = project.address;

      }
    });
    // TODO GET PROJECT TITLE FROM PROJECT ID

    return { 
      id: projectID,
      title: projectName, 
      address: projectAddress,
      creatorData : creatorData,
      startDate: startDate,
      endDate: endDate,
      state: projectState,
      score: averagee
    };
  });

  console.log(`projectsAverage ${JSON.stringify(projectsAverage)}`);
  res.json({
    message: "fetch project with score successful",
    projects: projectsAverage,
  });
};
// DONE
const getProjectById = async (req, res, next) => {
  const projectId = req.params.pid;
  console.log("projectid jjkk: " + projectId);
  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a project.",
      500
    );
    return next(error);
  }

  if (!project) {
    const error = new HttpError(
      "Could not find project for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ project: project.toObject({ getters: true }) });
};
// DONE
const getProjectsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithProjects;
  try {
    userWithProjects = await User.findById(userId).populate("projects");
  } catch (err) {
    const error = new HttpError(
      "Fetching projects failed, please try again later.",
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithProjects || userWithProjects.projects.length === 0) {
    return next(
      new HttpError("Could not find projects for the provided user id.", 404)
    );
  }

  res.json({
    projects: userWithProjects.projects.map((project) =>
      project.toObject({ getters: true })
    ),
  });
};

// DONE
const createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    title,
    description,
    address,
    startDate,
    startDateString,
    endDate,
    endDateString,
    colleagues,
  } = req.body;
  // console.log(
  //   `
  //   startDate string : ${startDateString},
  //   startDate date: ${startDate},

  //   endDate string : ${endDateString},
  //   endDate date: ${endDate},
  //   `
  // );

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "fetching user to create a project failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  const createdProject = new Project({
    title,
    description,
    date: Date.now(),
    address,
    image: req.file.path,
    startDate: {
      stringDate: startDateString,
      date: startDate,
    },
    endDate: {
      stringDate: endDateString,
      date: endDate,
    },
    colleagues: [],
    sessions: [],
    creator: req.userData.userId,
    creatorData: {
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    },
    activated: true,
    state: "Closed",
  });
  // createdProject.startDate.stringDate = startDate.stringDate;
  // createdProject.startDate.date = startDate.date;
  // createdProject.endDate.date = endDate.stringDate;
  // createdProject.endDate.date = endDate.date;

  JSON.parse(colleagues).map((item) => {
    createdProject.colleagues.push(item);
  });
  //DONE IMPORTANT  DOWNGRADE mongoose and mongoose-unique-validator.

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProject.save({ session: sess });
    user.projects.push(createdProject);
    await user.save({ session: sess });
    await sess.commitTransaction();
    // await createdProject.save();
  } catch (err) {
    const error = new HttpError(
      "Creating project failed!!, please try again.", //IMPORTANT
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ project: createdProject });
};

// DONE
const updateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    title,
    description,
    address,
    state,
    colleagues,
    startDate,
    startDateString,
    endDate,
    endDateString,
  } = req.body;
  const projectId = req.params.pid;
  // console.log(
  //   `
  //   title: ${title},
  //   description: ${description},
  //   address: ${address},
  //   state, ${state},

  //   startDate string : ${startDateString},
  //   startDate date: ${startDate},

  //   endDate string : ${endDateString},
  //   endDate date: ${endDate},

  //   contributors: ${JSON.stringify(colleagues)}
  //   contributors: ${typeof colleagues}
  //   contributors: ${colleagues}
  //   contributors: ${colleagues}
  //   `
  // );

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }
  if (!project) {
    const error = new HttpError("Could not find project for provided id.", 404);
    return next(error);
  }
  if (project.creator.toString() === req.userData.userId) {
    console.log("project creator you are authorized");
  }

  if (project.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to update project.",
      401
    );
    return next(error);
  }

  project.title = title;
  project.description = description;
  project.address = address;
  project.state = state;
  project.colleagues = JSON.parse(colleagues).map((item) => {
    return item;
  });
  if (req.file) {
    project.image = req.file.path;
  }
  //date
  project.startDate = { stringDate: startDateString, date: startDate };
  project.endDate = { stringDate: endDateString, date: endDate };
  // project.startDate.date = startDate;
  // project.endDate.stringDate = endDateString;
  // project.endDate.date = endDate;

  try {
    await project.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }

  res.status(200).json({ project: project.toObject({ getters: true }) });
};

// DONE
const deleteProject = async (req, res, next) => {
  const projectId = req.params.pid;

  let project;
  try {
    project = await Project.findById(projectId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete project.",
      500
    );
    return next(error);
  }

  if (!project) {
    const error = new HttpError("Could not find project for this id.", 404);
    return next(error);
  }

  if (project.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to delete project.",
      403
    );
    return next(error);
  }

  const imagePath = project.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await project.remove({ session: sess });
    project.creator.projects.pull(project);
    await project.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete project.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log("error for projects image deletion " + err);
  });

  res.status(200).json({ message: "Deleted project." });
};
//DONE
const addColleagues = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { colleaguesList } = req.body;
  const projectId = req.params.pid;
  console.log("typeof colleaguesList" + typeof colleaguesList);
  console.log(colleaguesList);

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }
  if (!project) {
    const error = new HttpError("Could not find project for provided id.", 404);
    return next(error);
  }

  if (project.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to update project.",
      401
    );
    return next(error);
  }
  project.colleagues = colleaguesList;
  try {
    await project.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }

  res.status(200).json({ project: project.toObject({ getters: true }) });
};
// DONE
const desactivateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const projectId = req.params.pid;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }
  if (!project) {
    const error = new HttpError("Could not find project for provided id.", 404);
    return next(error);
  }

  if (project.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to update project.",
      401
    );
    return next(error);
  }

  project.activated = false;

  try {
    await project.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }

  res.status(200).json({ project: project.toObject({ getters: true }) });
};
// TESTING
const getSessionIdsByProjectId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const projectId = req.params.pid;

  let project;
  // fetch project
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }
  // check project existing
  if (!project) {
    const error = new HttpError("Could not find project for provided id.", 404);
    return next(error);
  }
  // fetch sessions
  let sessions;
  try {
    sessions = await Session.find({ projectRef: projectId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch sessions.",
      500
    );
    return next(error);
  }
  // check sessions existing
  if (!sessions) {
    const error = new HttpError(
      "Could not find sessions for provided project id.",
      404
    );
    return next(error);
  }

  res.status(200).json({
    message: "fetching project success",
    project: project.toObject({ getters: true }),
    sessionIds: sessions
      .filter((session) => session.activated == true)
      .map((session) => {
        return { id: session._id, sessionName: session.title };
      }),
  });
};
const getAnswersByProjectId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const projectId = req.params.pid;
  // fetch project
  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }
  // check project existing
  if (!project) {
    const error = new HttpError("Could not find project for provided id.", 404);
    return next(error);
  }
  // fetch answers
  let answers;
  try {
    answers = await Answer.find({ projectRef: projectId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch Answers by project id.",
      500
    );
    return next(error);
  }
  // check answsers existing
  if (!answers) {
    const error = new HttpError(
      "Could not find answers for provided project id.",
      404
    );
    return next(error);
  }
  res.status(200).json({
    message: " fetch answers by project id successful",
    project: project.toObject({ getters: true }),
    answers: answers.filter((answer) => answer.activated == true),
  });
};

// DONE editing, works: TODO TESTING: pendding.
exports.desactivateProject = desactivateProject;
exports.addColleagues = addColleagues;
exports.getProjects = getProjects;
exports.getProjectById = getProjectById;
exports.getProjectsByUserId = getProjectsByUserId;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
exports.getSessionIdsByProjectId = getSessionIdsByProjectId;
// TESTING
exports.getAnswersByProjectId = getAnswersByProjectId;
exports.getProjectsWithAnswers = getProjectsWithAnswers;
