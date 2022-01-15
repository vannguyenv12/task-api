const express = require('express');

const auth = require('./../utils/auth');

const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('./../controllers/taskController');

const router = express.Router();

router.use(auth);

router.post('/', createTask);

router.get('/', getAllTasks);

router.get('/:id', getTask);

router.patch('/:id', updateTask);

router.delete('/:id', deleteTask);

module.exports = router;
