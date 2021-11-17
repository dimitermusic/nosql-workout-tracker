const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create model to use for adding data to the Mongo database
const WorkoutSchema = new Schema({
  day: {
    type: Number,
  },
  exercises: [
    {
      type: {
        type: String,
        trim: true,
      },
      name: {
        type: String,
        trim: true,
      },

      duration: {
        type: Number,
      },
      distance: {
        type: Number,
      },
      weight: {
        type: Number,
      },
      reps: {
        type: Number,
      },
      sets: {
        type: Number,
      },
    },
  ],
  totalDuration: {
    type: Number,
    default: 0
  }
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;