const router = require('express').Router();
const taskController = require('../controllers/taskcontroller');
const { auth, isAdmin } = require('../middlewares/authmiddleware');

// Protect all task routes
router.use(auth);

// Tasks page render
router.get("/", async (req, res) => {
    const Task = require('../model/taskSchema');
    try {
        const tasks = await Task.find();
        res.render("tasks", { user: req.user, tasks });
    } catch (err) {
        console.error(err);
        res.render("tasks", { user: req.user, tasks: [] });
    }
});

// Create task → only admin
router.post('/createTasks',  taskController.createTask);

// Update / Delete → admin or author
router.post('/updateTasks/:id', taskController.updateTask);
router.post('/deleteTasks/:id', taskController.deleteTask);

module.exports = router;
