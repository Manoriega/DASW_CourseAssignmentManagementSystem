const { mongoose } = require("./connectdb");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  uid: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  groups: {
    type: [String],
    default: [],
  },
  usertype: {
    type: Number,
    required: true,
  },
});

userSchema.statics.getUsers = async (filters = {}) => {
  let docs = await Users.find(filters, {
    _id: 1,
    uid: 1,
    name: 1,
    lastname: 1,
    email: 1,
    groups: 1,
    usertype: 1,
  });
  return docs;
};

userSchema.statics.getUserByUid = async (uid) => {
  let user = await Users.findOne(
    { uid },
    {
      _id: 0,
      uid: 1,
      name: 1,
      lastname: 1,
      email: 1,
      groups: 1,
      usertype: 1,
    }
  );
  return user;
};

userSchema.statics.getUserById = async (id) => {
  let user = await Users.findById(id, {
    _id: 0,
    uid: 1,
    name: 1,
    lastname: 1,
    email: 1,
    groups: 1,
    usertype: 1,
  });
  return user;
};

userSchema.statics.getUserByEmail = async (email) => {
  let user = await Users.findOne(
    { email },
    { _id: 1, uid: 1, email: 1, password: 1, usertype: 1 }
  );
  return user;
};

userSchema.statics.createUser = async (user) => {
  let newUser = await Users(user);
  return await newUser.save();
};

userSchema.statics.updateUser = async (uid, userData) => {
  let updatedUser = await Users.findOneAndUpdate(
    { uid },
    { $set: userData },
    { new: true }
  );
  return updatedUser;
};

userSchema.statics.deleteUser = async (uid) => {
  let deletedUser = await Users.findOneAndDelete({ uid });
  return deletedUser;
};

userSchema.statics.studentsToAdd = async (groupId) => {
  let usersToAdd = await Users.find({
    groups: { $nin: [groupId] },
    usertype: 1,
  });
  return usersToAdd;
};

userSchema.statics.addGroup = async (id, groupId) => {
  let updatedUser = await Users.findByIdAndUpdate(
    id,
    { $push: { groups: groupId } },
    { new: true }
  );
  return updatedUser;
};

userSchema.statics.removeGroup = async (id, groupId) => {
  let updatedUser = await Users.findByIdAndUpdate(
    id,
    { $pull: { groups: groupId } },
    { new: true }
  );
  return updatedUser;
};

userSchema.statics.getGroups = async (uid) => {
  let user = await Users.findOne({ uid });
  return user.groups;
};

let Users = mongoose.model("users", userSchema);

//Users.getUsers();

//Users.getUserByUid("123456");

/* Users.createUser({
  uid: "123456",
  name: "Mauricio",
  lastname: "Noriega Monarrez",
  email: "mauricionoriega@iteso.mx",
  password: "123456",
  usertype: 1,
}); */

//Users.updateUser("123456", { name: "Mauricio" });

//Users.deleteUser("123456");

//Users.addGroup("123456", "oaijwf");

//Users.removeGroup("123456", "sdqefe");

//Users.getGroups("123456");

module.exports = { Users };
