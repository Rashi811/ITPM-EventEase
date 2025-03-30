const express = require("express");
const router = express.Router();
//Insert Model
const Task = require("../Model/Task");
//Insert Task Controller
const TaskController = require("../Controller/taskController");

router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.addTasks);
router.get("/:id", TaskController.getById);
router.put('/:id', TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);



//export router
module.exports = router;