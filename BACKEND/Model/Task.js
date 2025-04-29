const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  //Create data for form
  taskName:{
    type:String,//Data Type
    required:true,//validate
  },
  taskID:{
    type:String,//Data Type
    required:true,//validate
  },
  taskDate:{
    type:String,//Data Type
    required:true,//validate
  },
  description:{
    type:String,//Data Type
    required:true,//validate
  },
  process:{
    type:String,//Data Type
    required:true,//validate
  },
  person:{
    type:String,//Data Type
    required:true,//validate
  },
  status:{
    type:String,//Data Type "Pending, In Progress, Completed"
    required:true,//validate
  },


},{ collection: 'task' });

const Task = mongoose.model('task', taskSchema);

module.exports = Task;