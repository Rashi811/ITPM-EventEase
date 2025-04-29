//insert the model
const Task = require("../Model/Task");

//display data
/*const getAllTasks = async(req, res, next) => {
  
    let Tasks;
  
    try{
      Tasks = await Task.find();
    }catch (err){
      console.log(err)
    }
    //if task not found
    if(!Tasks){
      return res.status(404).json({message:"Tasks not found"})
    }
  
    //dsipaly all tasks
    return res.status(200).json({Tasks});
  };*/

  exports.getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json({
        success: true,
        count: tasks.length,
        tasks: tasks
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  };

  //data insert
  /*
const addTasks = async(req, res, next) => {
    const {taskName, taskID, taskDate, description, process, person, status} = req.body;
  
    let task;
  
    try {
      task = new Task({taskName, taskID, taskDate, description, process, person, status});
      await task.save();
    }catch(err){
      console.log(err);
    }
  
    // don't insert tasks
    if(!task){
      return res.status(404).json({message: "Unable to add task"});
    }else{
      return res.status(200).json({task})
    }
  } */
    exports.addTasks = async (req, res) => {
      try {
        const newTask = new Task({
          taskName: req.body.taskName,
          taskID: req.body.taskID,
          taskDate: req.body.taskDate,
          description: req.body.description,
          process: req.body.process,
          person: req.body.person,
          status: req.body.status
        });
    
        const savedTask = await newTask.save();
        res.status(201).json({
          message: "Task created successfully",
          task: savedTask
        });
      } catch (err) {
        res.status(400).json({
          message: "Error creating task",
          error: err.message
        });
      }
    };

    /*
  //get Tasks by id
const getById = async(req, res, next) => {
    const id = req.params.id;
  
    let task;
  
    try{
      task = await Task.findById(id);
    } catch(err){
      console.log(err)
    }
  
    // not available tasks
    if(!task){
      return res.status(404).json({message: "Task not Found"});
    }else{
      return res.status(200).json({task})
    }
  }

  //Update task details
const updateTask = async(req, res, next) => {
    const id = req.params.id;
    const {taskName, taskID, taskDate, description, process, person, status} = req.body;
  
    let task;
  
    try{
      task = await Task.findByIdAndUpdate(id,
        {taskName:taskName, taskID:taskID, taskDate:taskDate, description:description, process:process, person:person, status:status });
        task = await task.save();
    }catch(err){
      console.log(err);
    }
  
    // not available task
    if(!task){
      return res.status(404).json({message: "Unable to update task details"});
    }else{
      return res.status(200).json({task})
    }
  
  } */


  // In your taskController.js
exports.getById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (err) {
    res.status(400).json({
      message: "Error updating task",
      error: err.message
    });
  }
};
  

  //Delete task Detail
  const deleteTask = async(req, res, next) => {
    const id = req.params.id;
  
    let task;
  
    try{
      task = await Task.findByIdAndDelete(id)
    }catch(err){
      console.log(err);
    }
  
    // not available task
    if(!task){
      return res.status(404).json({message: "Unable to Delete task details"});
    }else{
      return res.status(200).json({task})
    }
  }

//export the getAllTasks functions
//exports.getAllTasks = getAllTasks;
//export the addTask functions
//exports.addTasks = addTasks;
//export the get task by id functions
//exports.getById = getById;
//export update functions
//exports.updateTask = updateTask;
//export delete functions
exports.deleteTask = deleteTask;    