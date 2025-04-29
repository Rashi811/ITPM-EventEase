import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./TaskDashboard.css"

const TaskDashboard = () => {
    const [filteredTask, setFilteredTask] = useState([]);
    const [task, setTask] = useState([]);

    useEffect(() => {
        const getData = () => {
            axios
                .get("http://localhost:5000/task")
                .then(response => {
                    setTask(response.data.Task);
                    setFilteredTask(response.data.Task);
                })
                .catch(error => console.log(error));
        };
        
        getData();
    }, []);
                
    // Counting functions
    const countAllTasks = () => filteredTask.length;
    const countToDoTasks = () => filteredTask.filter(task => task.status.toLowerCase() === 'todo').length;
    const countCompleteTasks = () => filteredTask.filter(task => task.status.toLowerCase() === 'complete').length;
    const countOnGoingTasks = () => filteredTask.filter(task => task.status.toLowerCase() === 'ongoing').length;
    const countIncompleteTasks = () => filteredTask.filter(task => 
        ['inprogress', 'pending', 'rejected'].includes(task.status.toLowerCase())
    ).length;

    return (
        <>
            <div id='body-div'>
                <div id='component-div'>
                    <div id='task-dashbord'>
                        <div id='TaskDashBoard'>
                            <div id='TaskLeftDiv'>
                                <div>
                                    <p className='TaskLeftDashboardTitle'>Task Dashboard</p> 
                                    <a href='/create-task' id='TaskButton-a'><button id='TaskButton'>Create Task</button></a>
                                    <a href='/task-list' id='TaskButton-a'><button id='TaskButton'>View All Tasks</button></a>
                                    <div id='image-div'></div>
                                </div>
                            </div>
                            <div id='TaskRightDiv'>
                                <ul>
                                    <a href="/task-list"><li>All Tasks </li></a>
                                    <a href="/task-list"><li>To Do Tasks </li></a>
                                    <a href="/task-list"><li>Complete Tasks </li></a>
                                    <a href="/task-list"><li>On Going Tasks </li></a>
                                    <a href="/task-list"><li>Incomplete Tasks </li></a>
                                </ul>
                                <ul>
                                    <a href="/task-list"><li>{countAllTasks()}</li></a>
                                    <a href="/task-list"><li>{countToDoTasks()}</li></a>
                                    <a href="/task-list"><li>{countCompleteTasks()}</li></a>
                                    <a href="/task-list"><li>{countOnGoingTasks()}</li></a>
                                    <a href="/task-list"><li>{countIncompleteTasks()}</li></a>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TaskDashboard;