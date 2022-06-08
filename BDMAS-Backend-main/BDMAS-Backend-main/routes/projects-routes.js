const express = require("express");
const { check } = require("express-validator");

const projectsControllers = require("../controllers/projects-controllers");
const sessionControllers = require("../controllers/session-controllers");
const subSessionControllers = require("../controllers/subSessions-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();
// TODO comparison, get projects
router.get("/comparison", projectsControllers.getProjects);
// DONE
// session managment
router.use(checkAuth);
router.get("/project/session/:pid", sessionControllers.getSessionsByProjectId);
router.get("/project/:pid/session/:sid", sessionControllers.getSessionById);
//TESTING
router.patch("/project/:pid/session/:sid", sessionControllers.updateSession);
router.post("/project/:pid/session/:sid", sessionControllers.startSession);
router.get("/session/deactivate/:sid", sessionControllers.deactivateSession);

//subsession managment
router.post(
  "/project/:pid/session/:sid/subsession",
  subSessionControllers.createSubSession
);
router.get(
  "/project/session/:sid/subsessions",
  subSessionControllers.getSubSessionsBySessionId
);
router.get(
  "/project/session/:sid/subsession/:ssid/deactivate",
  subSessionControllers.deactivateSubSession
);
router.get(
  "/project/session/:sid/subsession/:ssid/startsession",
  subSessionControllers.startSubSession
);
router.patch(
  "/session/:sid/subsession/update/:ssid",
  subSessionControllers.updateSubSession
);
router.get(
  "/session/:sid/subsessionsIds",
  sessionControllers.getSubSessionsIDSBySessionId
);
router.get(
  "/subsession/:ssid/answers",
  subSessionControllers.getAnswersBySubSessionId
);

//project managment
router.get('/projects/all', projectsControllers.getProjectsWithAnswers)



router.get("/", projectsControllers.getProjects);
router.get("/:pid", projectsControllers.getProjectById);
router.get("/user/:uid", projectsControllers.getProjectsByUserId);
router.post("/project/addColleagues/:pid/", projectsControllers.addColleagues);

router.get(
  "/project/:pid/sessionIds",
  projectsControllers.getSessionIdsByProjectId
);
router.get(
  "/project/project/:pid/answers",
  projectsControllers.getAnswersByProjectId
);
// project managment IMPORTANT;
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  projectsControllers.createProject
);
//TESTING
router.patch(
  "/:pid",
  fileUpload.single("image"),
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  projectsControllers.updateProject
);

// Desactivate Project
router.get("/desactivate/:pid", projectsControllers.desactivateProject);

//  TO CHANGE
router.delete("/:pid", projectsControllers.deleteProject);
// session logic
router.post(
  "/project/:projectId",
  [
    check("title").not().isEmpty(),
    // check("description").isLength({ min: 5 }),
    // check("form").not().isEmpty(),
  ],
  sessionControllers.createSession
);

// Contributors management TESTING
// router.post("/project/addColleague/:pid/", projectsControllers.addOneColleague);

module.exports = router;
