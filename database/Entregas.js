const { mongoose } = require("./connectdb");

const entregaSchema = mongoose.Schema({
  assignmentId: {
    type: String,
    required: true,
  },
  studentDeliver: {
    type: String,
    required: true,
  },
  reviewer: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  teacherScore: {
    type: Number,
    default: null,
  },
  studentScore: {
    type: Number,
    default: null,
  },
  finalScore: {
    type: Number,
    default: null,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  reviewDate: {
    type: Date,
    default: null,
  },
});

entregaSchema.statics.getEntregas = async (filters = {}, projection = {}) => {
  let docs = await Entregas.find(filters, projection);
  //console.log(docs);
  return docs;
};

entregaSchema.statics.createEntrega = async (entrega) => {
  let newEntrega = await Entregas(entrega);
  //console.log(newEntrega);
  return await newEntrega.save();
};

entregaSchema.statics.getEntregaById = async (id, projection = {}) => {
  let entrega = await Entregas.findById(id, projection);
  //console.log(entrega);
  return entrega;
};

entregaSchema.statics.updateEntrega = async (id, entregaData) => {
  let updatedEntrega = await Entregas.findByIdAndUpdate(
    id,
    { $set: entregaData },
    { new: true }
  );
  //console.log(updatedEntrega);
  return updatedEntrega;
};

entregaSchema.statics.deleteEntrega = async (id) => {
  let deletedAssignment = await Entregas.findByIdAndDelete(id);
  //console.log(deletedAssignment);
  return deletedAssignment;
};

let Entregas = mongoose.model("entregas", entregaSchema);

Entregas.getEntregas();

/* Entregas.createEntrega({
  assignmentId: "1",
  studentDeliver: "1",
  reviewer: "2",
  fileName: "filename.pdf",
}); */

//Entregas.getEntregaById("6457227a7b61c991cd7911c9");

//Entregas.updateEntrega("6457227a7b61c991cd7911c9", { studentScore: 8 });

//Entregas.updateEntrega("6457227a7b61c991cd7911c9", { teacherScore: 7 });

//Entregas.updateEntrega("6457227a7b61c991cd7911c9", { finalScore: 7.5 });

//Entregas.deleteEntrega("6457227a7b61c991cd7911c9");

module.exports = { Entregas };
