//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  facebook_id: {
    type: String
  },
  google_id: {
    type: String
  }
},{
  toObject: {
    transform: function (doc, ret) {
      delete ret.password;
    }
  },
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
    }
  }
});

var Users = mongoose.model("Users", UsersSchema);

module.exports = Users;
