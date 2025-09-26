const Task = require('../model/taskSchema');

// Create task
const createTask = async (req, res) => {
    const { title, description, status } = req.body;
    const author = req.user.id;
    try {
        const newTask = new Task({ title, description, status, author });
        await newTask.save();
        res.redirect("/tasks");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Update task
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
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Delete task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).send("Task not found");

        if (req.user.role !== "admin" && task.author.toString() !== req.user.id)
            return res.status(403).send("Unauthorized");

        await task.deleteOne();
        res.redirect("/tasks");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

module.exports = { createTask, updateTask, deleteTask };
