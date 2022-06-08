const express = require("express");
const { check } = require("express-validator");

const projectsControllers = require("../controllers/projects-controllers");
const sessionControllers = require("../controllers/session-controllers");
const subSessionControllers = require("../controllers/subSessions-controllers");
const fileUpload = require("../middleware/file-upload");


// contollers
const answersControllers = require("../controllers/answers-controllers");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();
// check if the user in authorized for these routers.
router.use(checkAuth);

router.get("/answers/subsession/:ssid", answersControllers.getAnswersWithSubSessionId);

module.exports = router;