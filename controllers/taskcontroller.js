const Task = require('./model/taskSchema');

// create task
const createTask = async (req, res) => {
    const { title, description, status } = req.body;
    const author = req.user.id;
    try {
        const newTask = new Task({ title, description, status, author });
        await newTask.save();
        res.redirect("/tasks");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// get tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ author: req.user.id });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// update task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).send("Task not found");
        if (req.user.role !== "admin" && task.author.toString() !== req.user.id)
            return res.status(403).send("Unauthorized");

        task.title = title;
        task.description = description;
        task.status = status;
        await task.save();
        res.redirect("/tasks");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// delete task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).send("Task not found");
        if (req.user.role !== "admin" && task.author.toString() !== req.user.id)
            return res.status(403).send("Unauthorized");

        await task.deleteOne();
        res.redirect("/tasks");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
