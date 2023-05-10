const { mongoose } = require("./connectdb");

const assignmentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  rubricId: {
    type: String,
    required: true,
  },
});

assignmentSchema.statics.getAssignments = async (
  filters = {},
  projection = {}
) => {
  let docs = await Assignments.find(filters, projection).populate({
    path: "rubricId",
    model: "Rubrica",
    select: "preguntas",
  });
  //console.log(docs);
  return docs;
};

assignmentSchema.statics.createAssignment = async (assignment) => {
  let newAssignment = await Assignments(assignment);
  //console.log(newAssignment);
  return await newAssignment.save();
};

assignmentSchema.statics.getAssignmentById = async (id, projection = {}) => {
  let assignment = await Assignments.findById(id, projection).populate({
    path: "rubricId",
    model: "Rubrica",
    select: "preguntas",
  });
  return assignment;
};

assignmentSchema.statics.updateAssignment = async (id, assignmentData) => {
  let updatedAssignment = await Assignments.findByIdAndUpdate(
    id,
    { $set: assignmentData },
    { new: true }
  );
  //console.log(updatedAssignment);
  return updatedAssignment;
};

assignmentSchema.statics.deleteAssignment = async (id) => {
  let deletedAssignment = await Assignments.findByIdAndDelete(id);
  //console.log(deletedAssignment);
  return deletedAssignment;
};

let Assignments = mongoose.model("assignments", assignmentSchema);

//Assignments.getAssignments();

/* Assignments.createAssignment({
  title: "Primera entrega de requerimientos",
  description:
    "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ",
  dueDate: new Date(2023, 5, 15, 23, 59, 00),
  rubricId: 1,
}); */

//Assignments.getAssignmentById("645715d69e685d2aed5064a9");

/* Assignments.updateAssignment("645715d69e685d2aed5064a9", {
  title: "Primera entrega de requerimientos",
}); */

//Assignments.deleteAssignment("645715d69e685d2aed5064a9");

module.exports = { Assignments };
