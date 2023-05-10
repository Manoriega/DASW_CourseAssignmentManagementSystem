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
  published: {
    type: Boolean,
    default: true,
  },
});

groupSchema.statics.getGroups = async (filters = {}) => {
  let docs = await Groups.find(filters)
    .populate({
      path: "teacher",
      model: "users",
      select: "_id uid name lastname email usertype",
    })
    .populate({
      path: "students",
      model: "users",
      select: "_id uid name lastname email usertype",
    })
    .populate({
      path: "assignments",
      model: "assignments",
      select: "_id title description dueDate rubricId creationDate",
    });
  return docs;
};

groupSchema.statics.getGroupsFromArray = async (groups) => {
  let docs = await Groups.find({
    uid: { $in: groups },
  })
    .populate({
      path: "teacher",
      model: "users",
      select: "_id uid name lastname email usertype",
    })
    .populate({
      path: "students",
      model: "users",
      select: "_id uid name lastname email usertype",
    })
    .populate({
      path: "assignments",
      model: "assignments",
      select: "_id title description dueDate rubricId creationDate",
    });
  return docs;
};

groupSchema.statics.getGroupById = async (uid) => {
  let group = await Groups.findOne({ uid })
    .populate({
      path: "teacher",
      model: "users",
      select: "_id uid name lastname email usertype",
    })
    .populate({
      path: "students",
      model: "users",
      select: "_id uid name lastname email usertype",
    })
    .populate({
      path: "assignments",
      model: "assignments",
      select: "_id title description dueDate rubricId creationDate",
    });
  return group;
};

groupSchema.statics.createGroup = async (group) => {
  let newGroup = await Groups(group);
  return await newGroup.save();
};

groupSchema.statics.updateGroup = async (uid, groupData) => {
  let updatedGroup = await Groups.findOneAndUpdate(
    { uid },
    { $set: groupData },
    { new: true }
  );
  return updatedGroup;
};

groupSchema.statics.deleteGroup = async (uid) => {
  let deletedGroup = await Groups.findOneAndDelete({ uid });
  return deletedGroup;
};

groupSchema.statics.closeGroup = async (uid) => {
  let updatedGroup = await Groups.findOneAndUpdate(
    { uid },
    { published: false }
  );
  return updatedGroup;
};

groupSchema.statics.addStudent = async (uid, studentId) => {
  let updatedGroup = await Groups.findOneAndUpdate(
    { uid },
    { $push: { students: studentId } },
    { new: true }
  );
  return updatedGroup;
};

groupSchema.statics.removeStudent = async (uid, studentId) => {
  let updatedGroup = await Groups.findOneAndUpdate(
    { uid },
    { $pull: { students: studentId } },
    { new: true }
  );
  return updatedGroup;
};

groupSchema.statics.deleteStudent = async (studentId) => {
  let updatedGroup = await Groups.findOneAndUpdate(
    { students: { $in: [studentId] } },
    { $pull: { students: studentId } },
    { new: true }
  );
  return updatedGroup;
};

groupSchema.statics.addAssignment = async (uid, assignmentId) => {
  let updatedGroup = await Groups.findOneAndUpdate(
    { uid },
    { $push: { assignments: assignmentId } },
    { new: true }
  );
  return updatedGroup;
};

groupSchema.statics.removeAssignment = async (uid, assignmentId) => {
  let updatedGroup = await Groups.findOneAndUpdate(
    { uid },
    { $pull: { assignments: assignmentId } },
    { new: true }
  );
  return updatedGroup;
};

groupSchema.statics.getStudents = async (uid) => {
  let group = await Groups.findOne({ uid });
  return group.students;
};

groupSchema.statics.getAssignments = async (uid) => {
  let group = await Groups.findOne({ uid });
  return group.assignments;
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
