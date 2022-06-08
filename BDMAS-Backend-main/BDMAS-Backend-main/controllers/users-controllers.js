const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const HttpError = require("../models/http-error");
const User = require("../models/user.js");
const transport = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);
//DONE
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!users) {
    return next(new HttpError("no users", 404));
  }
  res.json({
    users: users
      .filter((item) => item.activated == true)
      .map((user) => user.toObject({ getters: true })),
  });
};
//DONE
const getUserById = async (req, res, next) => {
  const id = req.params.uid;
  let user;
  try {
    user = await User.findById(id);
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
  res.json({
    user: {
      userName: user.name,
      userImage: user.image,
      userEmail: user.email,
      userProjects: user.projects,
    },
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    projects: [],
    role: "admin",
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  try {
    console.log(createdUser.email);
    transport.sendMail({
      to: createdUser.email,
      from: "bdmat.reply@gmail.com",
      subject: "sign up succeeded!",
      html: "<h1> you seccessfully signed up!</h1>",
    });
  } catch (err) {
    return next(
      new HttpError(
        "sending  signup mail failed, please try again with another mail.",
        404
      )
    );
  }
  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
    role: createdUser.role,
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials(email), could not log you in.",
      401
    );
    return next(error);
  }
  // console.log("user login : " + existingUser);
  console.log("user image : " + existingUser.image);

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    image: existingUser.image,
    role: existingUser.role,
  });
};

const postRest = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }, "-password");
  } catch (err) {
    const error = new HttpError(
      "fetching user with provided email failed, please try again",
      404
    );
    return next(error);
  }
  if (!existingUser) {
    return next(
      new HttpError(
        "Can not find a user with provided email, please try another one",
        404
      )
    );
  }
  console.log("imageeeeeeeeeeeeeeeeeeeeee" + existingUser.image);
  let resetToken;
  try {
    resetToken = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  existingUser.resetToken = resetToken;
  existingUser.resetTokenExpiration = Date.now() + 3600000;
  try {
    console.log(existingUser.email);
    transport.sendMail({
      to: existingUser.email,
      from: "bdmat.reply@gmail.com",
      subject: "sign up succeeded!",
      html: `
      <h1> you successfully signed up!</h1>
      <p> Click this <a href="http://localhost:3000/user/resetpassword/${resetToken}"> Link </a>  to set a new password</p>
    
      `,
    });
  } catch (err) {
    return next(
      new HttpError(
        "sending  signup mail failed, please try again with another mail.",
        404
      )
    );
  }
  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    message: "create a secret token for user seccussfully, check your email",
    user: existingUser.toObject({ getters: true }),
  });
};

const resetPassword = async (req, res, next) => {
  const passwordToken = req.params.secretToken;
  const { password } = req.body;

  console.log(passwordToken);
  let existingUser;
  try {
    existingUser = await User.findOne({
      resetToken: passwordToken,
    });
    console.log(existingUser);
  } catch (err) {
    const error = new HttpError(
      "Fetshing User by secretToken failed, please try again later.",
      404
    );
    return next(error);
  }
  if (!existingUser) {
    return next(
      new HttpError("Could not find the user by secret token, please ", 404)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }
  existingUser.password = hashedPassword;
  existingUser.resetToken = null;
  existingUser.resetTokenExpiration = null;
  console.log(existingUser);

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    message: "password updated successfully, check your",
  });
};
//TESTING
const createUserFromAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, role } = req.body;
  console.log(email, role);
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  let resetToken;
  try {
    resetToken = jwt.sign(
      {
        email: email,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "creating token for user failed, please try again later.",
      500
    );
    return next(error);
  }
  //TO CHANGE DELETE NAME
  const createdUser = new User({
    name: "Test",
    resetToken: resetToken,
    email,
    projects: [],
    role,
    activated: false,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Create user failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        email: createdUser.email,
        role: createdUser.role,
        activated: false,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  try {
    console.log(createdUser.email);
    transport.sendMail({
      to: createdUser.email,
      from: "bdmat.reply@gmail.com",
      subject: "Create user succeeded!",
      html: `<h1> you have a new account!</h1>
      <p> Click this <a href="http://localhost:3000/user/activate/${resetToken}"> Link </a>  to set a new password</p>
      `,
    });
    console.log("the email sended !!");
  } catch (err) {
    return next(
      new HttpError(
        "sending  mail for creating account failed, please try again with another mail.",
        404
      )
    );
  }
  res.status(201).json({ message: "Create user succeeded!" });
};
const activateAccount = async (req, res, next) => {
  const Token = req.params.secretToken;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ resetToken: Token });
  } catch (err) {
    const error = new HttpError(
      "Activate account failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Could not find the user by email, please try another email.",
        404
      )
    );
  }
  console.log(existingUser);
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  existingUser.activated = true;
  existingUser.password = hashedPassword;
  existingUser.resetToken = "";
  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Activating user account failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ message: "User account succeeded!" });
};
const deactivateAccount = async (req, res, next) => {
  const id = req.params.uid;
  let existingUser;
  try {
    existingUser = await User.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Activate account failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Could not find the user by email, please try another email.",
        404
      )
    );
  }

  existingUser.activated = false;

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Deactivating user account failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ message: "Desactivate user account succeeded!" });
};
exports.deactivateAccount = deactivateAccount;
exports.activateAccount = activateAccount;
exports.createUserFromAdmin = createUserFromAdmin;
exports.resetPassword = resetPassword;
exports.postRest = postRest;
exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
