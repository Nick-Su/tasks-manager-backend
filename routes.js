const express = require("express");
const Task = require("./models/Task");
const router = express.Router();

// get all tasks
router.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
})

// add a new task
router.post('/tasks', async (req, res) => {
  const task = new Task({
    description: req.body.description,
    isCompleted: false,
  });

  await task.save();
  res.send(task);
})

// get task by id
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id })
    res.send(task)
  } catch {
    res.status(404);
    res.send({ error: 'Task does not exist!' });
  }
})

// update the task
router.patch('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id });

    if (req.body.description) {
      task.description = req.body.description;
    }

    if(req.body.isCompleted) {
      task.isCompleted = req.body.isCompleted;
    }

    await task.save();
    res.send(task)
  } catch {
    res.send(404);
    res.send({ error: 'Task does not exist!'})
  }
})

// delete the task
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id })
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: 'Task does not exist!' });
  }
})

module.exports = router;