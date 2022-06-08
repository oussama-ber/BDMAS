const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").not().isEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").isLength({ min: 6 })],
  usersController.login
);

router.post("/reset", usersController.postRest);
router.post("/reset/:secretToken", usersController.resetPassword);

router.post("/user/activate/:secretToken", usersController.activateAccount);
//IMPORTANT
router.use(checkAuth);

router.get("/user/:uid", usersController.getUserById);
router.get("/", usersController.getUsers);
router.post(
  "/user/createuser",
  [check("email").not().isEmpty(), check("role").not().isEmpty()],
  usersController.createUserFromAdmin
);
router.get("/user/deactivate/:uid", usersController.deactivateAccount);

module.exports = router;
