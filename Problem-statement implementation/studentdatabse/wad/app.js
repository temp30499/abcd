const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Student = require("./models");


const dbConfig =  "mongodb://localhost:27017";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect(dbConfig, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
    app.listen(4000, () => {
      console.log("Server is listening on port 4000");
    });
  })
  .catch((err) => {
    console.log("Could not connect to database", err);
    process.exit();
  });



app.get("/", (req, res) => {
  res.render("index");
});

app.post("/addmarks", (req, res) => {
  var myData = new Student(req.body);
  myData
    .save()
    .then((item) => {
      console.log("item saved to database");
      res.redirect("/getMarks");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("unable to save to database");
    });
});


app.get("/getMarks", (req, res) => {
  console.log(req.query);
  Student.find(req.query)
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});


app.get("/dsbdaGreaterThan20", (req, res) => {
  Student.find({ dsbda_marks: { $gt: 20 } })
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});


app.get("/wadccGreaterThan40", (req, res) => {
  Student.find({ wad_marks: { $gt: 40 }, cc_marks: { $gt: 40 } })
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});


app.post("/deleteStudent/:id", (req, res) => {
  Student.findByIdAndDelete(req.params.id).then((student) => {
    console.log("Deleted Successfully");
    res.redirect("/getMarks");
  });
});
