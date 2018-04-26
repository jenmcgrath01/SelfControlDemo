'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
name: {
    type: String,
    required: 'Kindly enter the name of the user'
  },
first_name: {
    type: String
  },
first_name: {
    type: String
  },
createdDate: {
    type: Date,
    default: Date.now
  },
over21: {
    type: Boolean,
    default: false
  },
backgroundCheckDate: {
    type: Date
  },
training: {
      type: String,
      enum: ['none', 'level1', 'level2'],
      default: 'none'
},
id_source: {
      type: String,
      enum: ['database','SelfKey','Sovrin'],
      default: 'database'
},
status: {
      type: String,
      enum: ['suspended', 'active'],
      default: 'active'
}

});

module.exports = mongoose.model('Users', UserSchema);
