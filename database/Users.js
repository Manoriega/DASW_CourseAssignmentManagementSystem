const { mongoose } = require("./connectdb");

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

userSchema.statics.getUsers = async (filtros = {}) => {
  try {
    let docs = await Users.find(filtros);
    console.log(docs);
    return docs;
  } catch (e) {
    console.log(e);
  }
};

userSchema.statics.getUserById = async (uid) => {
  try {
    let user = await Users.findOne({ uid });
    console.log(user);
    return user;
  } catch (e) {
    console.log(e);
  }
};

userSchema.statics.createUser = async (user) => {
  try {
    let newUser = await Users(user);
    let n = await newUser.save();
    console.log(n);
    return n;
  } catch (error) {
    console.log(e);
  }
};

userSchema.statics.updateUser = async (uid, userData) => {
  try {
    let updatedUser = await Users.findOneAndUpdate(
      { uid },
      { $set: userData },
      { new: true }
    );
    console.log(updatedUser);
    return updatedUser;
  } catch (e) {
    console.log(e);
  }
};

userSchema.statics.deleteUser = async (uid) => {
  try {
    let deletedUser = await Users.findOneAndDelete({ uid });
    console.log(deletedUser);
    return deletedUser;
  } catch (e) {
    console.log(e);
  }
};

userSchema.statics.addGroup = async (uid, groupId) => {
  try {
    let updatedUser = await Users.findOneAndUpdate(
      { uid },
      { $push: { groups: groupId } },
      { new: true }
    );
    console.log(updatedUser);
    return updatedUser;
  } catch (e) {
    console.log(e);
  }
};

userSchema.statics.removeGroup = async (uid, groupId) => {
  try {
    let updatedUser = await Users.findOneAndUpdate(
      { uid },
      { $pull: { groups: groupId } },
      { new: true }
    );
    console.log(updatedUser);
    return updatedUser;
  } catch (e) {
    console.log(e);
  }
};

userSchema.statics.getGroups = async (uid) => {
  try {
    let user = await Users.findOne({ uid });
    console.log(user.groups);
    return user.groups;
  } catch (e) {
    console.log(e);
  }
};

let Users = mongoose.model("users", userSchema);

//Users.getUsers();

//Users.getUserById("123456");

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

Users.getGroups("123456");

module.exports = { Users };
