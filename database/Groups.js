const { mongoose } = require("./connectdb");

const groupSchema = mongoose.Schema({
  uid: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    unique: true,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
  assignments: {
    type: [String],
    default: [],
  },
  students: {
    type: [String],
    default: [],
  },
  teacher: {
    type: String,
    required: true,
  },
});

groupSchema.statics.getGroups = async (filtros = {}) => {
  try {
    let docs = await Groups.find(filtros);
    console.log(docs);
    return docs;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.getGroupById = async (uid) => {
  try {
    let group = await Groups.findOne({ uid });
    console.log(group);
    return group;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.createGroup = async (group) => {
  try {
    let newGroup = await Groups(group);
    let n = await newGroup.save();
    console.log(n);
    return n;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.updateGroup = async (uid, groupData) => {
  try {
    let updatedGroup = await Groups.findOneAndUpdate(
      { uid },
      { $set: groupData },
      { new: true }
    );
    console.log(updatedGroup);
    return updatedGroup;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.deleteGroup = async (uid) => {
  try {
    let deletedGroup = await Groups.findOneAndDelete({ uid });
    console.log(deletedGroup);
    return deletedGroup;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.addStudent = async (uid, studentId) => {
  try {
    let updatedGroup = await Groups.findOneAndUpdate(
      { uid },
      { $push: { students: studentId } },
      { new: true }
    );
    console.log(updatedGroup);
    return updatedGroup;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.removeStudent = async (uid, studentId) => {
  try {
    let updatedGroup = await Groups.findOneAndUpdate(
      { uid },
      { $pull: { students: studentId } },
      { new: true }
    );
    console.log(updatedGroup);
    return updatedGroup;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.addAssignment = async (uid, assignmentId) => {
  try {
    let updatedGroup = await Groups.findOneAndUpdate(
      { uid },
      { $push: { assignments: assignmentId } },
      { new: true }
    );
    console.log(updatedGroup);
    return updatedGroup;
  } catch (e) {
    console.log(e);
  }
};
groupSchema.statics.removeAssignment = async (uid, assignmentId) => {
  try {
    let updatedGroup = await Groups.findOneAndUpdate(
      { uid },
      { $pull: { assignments: assignmentId } },
      { new: true }
    );
    console.log(updatedGroup);
    return updatedGroup;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.getStudents = async (uid) => {
  try {
    let group = await Groups.findOne({ uid });
    return group.students;
  } catch (e) {
    console.log(e);
  }
};

groupSchema.statics.getAssignments = async (uid) => {
  try {
    let group = await Groups.findOne({ uid });
    return group.assignments;
  } catch (e) {
    console.log(e);
  }
};

let Groups = mongoose.model("groups", groupSchema);

//Groups.getGroups();

//Groups.getGroupById("123456");

/*Groups.createGroup({
  uid: "123456",
  title: "Desarrollo de Aplicaciones y Servicios Web",
  code: "P2023_ESI3124F",
  information:
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis, ut impedit rem quisquam accusantium nam repellendus expedita nulla vitae ullam dolor praesentium, excepturi totam. Et laudantium laboriosam mollitia aut accusantium? Aliquid officia quam cupiditate. Natus nemo sunt voluptatibus quas doloremque facere hic eius quisquam voluptas quae porro quia nulla fugiat harum, sapiente laudantium quidem quibusdam! Doloremque provident eos enim modi. Earum explicabo laboriosam placeat maxime repudiandae iste voluptatibus repellendus labore sequi neque veniam facere, debitis omnis ducimus amet, aut nesciunt accusamus deserunt autem. Hic voluptatibus assumenda ipsa quasi similique, inventore voluptate labore delectus a odio sunt eius consequatur dolorem veritatis temporibus nihil et quaerat vel autem distinctio laborum! Impedit voluptates consectetur, eveniet labore esse voluptatibus pariatur veniam vitae minus eligendi itaque reiciendis, in inventore sequi deleniti temporibus qui nobis, a fugiat dolorem natus excepturi! Cumque officia, veritatis quos odit vel distinctio enim perspiciatis similique, reiciendis harum id provident, ducimus asperiores totam soluta eius expedita accusamus dicta pariatur nihil illo odio beatae rem. Sunt cum eligendi recusandae aspernatur reiciendis voluptas at illum minima sequi exercitationem ipsa quisquam, voluptates provident voluptatibus ullam itaque et! Repellendus odio, magnam inventore maxime, officiis architecto laudantium voluptatem aperiam illum neque sequi! Laborum inventore distinctio exercitationem modi. Voluptas aspernatur deserunt aliquam ratione delectus nemo, nostrum perspiciatis, magnam doloremque hic ipsam repellendus officiis vero reiciendis eligendi molestiae suscipit accusantium voluptatibus atque optio, blanditiis debitis corporis quae beatae? Alias consequuntur, repudiandae vel minima dignissimos accusamus tempore corrupti temporibus consectetur, omnis libero recusandae asperiores! Quam vero quibusdam repudiandae quasi quia?",
  teacher: "1",
});*/

//Groups.updateGroup("123456", { title: "DASW" });

//Groups.deleteGroup("123456");

//Groups.addStudent("123456", "studentBlahBlah 2");

//Groups.removeStudent("123456", "studentBlahBlah 2");

//Groups.addAssignment("123456", "254236");

//Groups.removeAssignment("123456", "254236");

module.exports = { Groups };
