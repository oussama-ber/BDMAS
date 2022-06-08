const express = require("express");
const { check } = require("express-validator");

const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");
const formController = require("../controllers/forms-controllers");

const router = express.Router();
// router.get("/session/:sid/forms", formController.getFormsBySessionId);
//for client
router.get("/form/client/:formId", formController.getFormById);
router.post("/project/:pid/session/:sid/subSession/:ssid/form/:fid/token/:token", formController.postAnswer);

router.get("/email/test/", formController.sendMailtesting);

router.use(checkAuth);
router.get("/", formController.getForms);
router.get("/form/:formId", formController.getFormById);
router.post("/", formController.createQuestionForm);
router.delete("/form/:fid", formController.deleteFormById);
router.patch("/form/:formId", formController.updateForm);
router.get("/form/desactivate/:formId", formController.deactivateForm);

// TESTING TODO
router.get("/answers/session/:sid", formController.getAnswerBySessionId);
router.get("/answers/subsession/:ssid", formController.getAnswersBySubSessionId);

module.exports = router;
