const fs = require("fs");

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const projectsRoutes = require("./routes/projects-routes");
const usersRoutes = require("./routes/users-routes");
const formsRoutes = require("./routes/questionsForms-routes");
const HttpError = require("./models/http-error");

const app = express();
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/projects", projectsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/forms", formsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log("file deletion from app : " + err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
// mongodb+srv://oussema:123456OOaa@bdmas.vq6km.mongodb.net/mainApplication?retryWrites=true&w=majority
//mongodb://localhost:27017/mainApplication?retryWrites=true&w=majority , { useNewUrlParser: true, useUnifiedTopology: true }
// mongodb+srv://oussema:123456OOaa@bdmas.vq6km.mongodb.net/mainApplication?retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://oussema:123456OOaa@bdmas.vq6km.mongodb.net/mainApplication?retryWrites=true&w=majority`,
    
  )
  .then(() => {
    app.listen(5000);
    console.log("connected to database!");
  })
  .catch((err) => {
    console.log("error from the app(failed to connected to database) : " + err);
  });
