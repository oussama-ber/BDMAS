const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
//models
const Answer = require("../models/Answer");

const getAnswersWithSubSessionId = async (req, res, next) => {
  const subSessionId = req.params.ssid;
  console.log('subSessionId'+subSessionId)
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
  console.log("answers : " + answers);
  res.status(200).json({
    message: "fetching answers successful!",
    answers: answers,
  });
};

exports.getAnswersWithSubSessionId = getAnswersWithSubSessionId;
