const Task = require('../model/taskschema');

const renderTasksPage = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find().populate('author', 'name email'); // admin → sab tasks
    } else {
      tasks = await Task.find({ author: req.user.id }); // user → sirf apne tasks
    }
    res.render("tasks", { tasks, user: req.user });
  } catch (err) {
    console.error(err);
    res.render("tasks", { tasks: [], user: req.user });
  }
};

const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  const author = req.user.id;

  try {
    await Task.create({ title, description, status, author });
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const filter = req.user.role === "admin" ? { _id: id } : { _id: id, author: req.user.id };
    const task = await Task.findOne(filter);
    if (!task) return res.status(404).send("Task not found");

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

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const filter = req.user.role === "admin" ? { _id: id } : { _id: id, author: req.user.id };
    const task = await Task.findOne(filter);
    if (!task) return res.status(404).send("Task not found");

    await task.deleteOne();
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = { renderTasksPage, createTask, updateTask, deleteTask };
