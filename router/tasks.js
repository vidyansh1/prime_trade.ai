const router = require('express').Router();
const taskController = require('../controllers/taskcontroller');
const { auth, isAdmin } = require('../middlewares/authmiddleware');

// View tasks page
router.get("/", auth, taskController.renderTasksPage);

// CRUD operations
router.post('/createTasks', auth, taskController.createTask);
router.put('/updateTasks/:id', auth, isAdmin, taskController.updateTask);
router.delete('/deleteTasks/:id', auth, isAdmin, taskController.deleteTask);


module.exports = router;
