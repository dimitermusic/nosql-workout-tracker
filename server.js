const express = require("express");
const mongojs = require('mongojs');
const mongoose = require("mongoose");
const db = require("./models");
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", { useNewUrlParser: true });

app.use(routes);

// CREATE: adds new document to Mongo database
app.post("/api/workouts", (req, res) => {
    const workout = req.body;
    console.log(workout);
    if (workout) {
        workout.day = new Date(new Date().setDate(new Date().getDate()));
        workout.exercises = [];
    }
    db.Workout.create(workout)
        .then((err,data) => {
            if (err) {
                res.send(err);
            } else {
                res.json(data);
            }
        });
});

// READ: gets all workouts from Mongo database
app.get("/api/workouts", (req, res) => {
    db.Workout.find({}, (err, data) =>{
        if (err) {
            res.send(error);
        } else {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    const exercisesArr = data[i].exercises;
                    let totalDuration = 0;
                    for (let i = 0; i < exercisesArr.length; i++) {
                        totalDuration += exercisesArr[i].duration;
                    }
                    data[i].totalDuration = totalDuration;
                }
                res.send(data);
            }
        }
    });
});
// gets the past seven workouts in descending order by id
app.get("/api/workouts/range", (req, res) => {
    db.Workout.find().sort({_id: -1}).limit(7).exec((err,data) => {
        if(err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

// UPDATE: adds an exercise to the existing workout
app.put("/api/workouts/:id", (req, res) => {
    db.Workout.updateOne({_id: mongojs.ObjectId(req.params.id)},{$push:{exercises:req.body}}, (err, data) =>{
        if (err) {
            res.send(error);
        } else {
            res.send(data);
        }
    }).then(() => {
        db.Workout.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, data) =>{
            let totalDuration = 0;
            for (let i = 0; i < data.exercises.length; i++) {
                totalDuration += data.exercises[i].duration;
            }
            const number = totalDuration;
            db.Workout.updateOne({_id: mongojs.ObjectId(req.params.id)},{$set:{totalDuration:number}}, (err,data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        });
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});