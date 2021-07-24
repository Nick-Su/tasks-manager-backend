const mongoose = require('mongoose');
const createServer = require('./server');
const Task = require('../models/Task');
const supertest = require('supertest');
const app = createServer();

beforeEach((done) => {
  mongoose.connect(
    'mongodb://localhost:27017/tasksDb_test',
    { useNewUrlParser: true,  useUnifiedTopology: true },
    () => done()
  )
})

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  })
})


// Test getAllPosts
test('GET /tasks', async () => {
  const task = await Task.create({
    description: 'Test task 1',
    isCompleted: false
  });

  await supertest(app)
          .get('/api/tasks')
          .expect(200)
          .then((response) => {
            // Check the response type & length
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);

            // Check the response data
            expect(response.body[0]._id).toBe(task.id);
            expect(response.body[0].description).toBe(task.description);
            expect(response.body[0].isCompleted).toBe(false);
          })
})

// Test get task by Id
test('GET /api/tasks/:id', async () => {
  const task = await Task.create({
    description: 'My test task',
    isCompleted: false
  })

  await supertest(app)
          .get('/api/tasks/' + task.id)
          .expect(200)
          .then((response) => {
            expect(response.body._id).toBe(task.id);
            expect(response.body.description).toBe(task.description);
            expect(response.body.isCompleted).toBe(false);
          })
})

// Test create task
test('POST /api/tasks', async () => {
  const data = {
    description: 'Task 1',
    isCompleted: false
  }

  await supertest(app)
          .post('/api/tasks')
          .send(data)
          .expect(200)
          .then(async (response) => {
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.description).toBe(data.description);
            expect(response.body.isCompleted).toBe(false);

            // Check the data in the test DB
            const task = await Task.findOne({ _id: response.body._id });
            expect(task).toBeTruthy();
            expect(task.description).toBe(data.description);
            expect(task.isCompleted).toBe(false);
          })
})

// Test update the task
test('PATCH /api/tasks/:id', async () => {
  const task = await Task.create({
    description: 'Task 1',
    isCompleted: false
  });

  const data = {
    description: 'Updated Task 1'
  };

  await supertest(app)
          .patch('/api/tasks/' + task.id)
          .send(data)
          .expect(200)
          .then(async (response) => {
            // Check the server response
            expect(response.body._id).toBe(task.id);
            expect(response.body.description).toBe(data.description);
            expect(response.body.isCompleted).toBe(false);

            // Check the data in the DB
            const updatedTask = await Task.findOne({ _id: response.body._id })
            expect(updatedTask).toBeTruthy();
            expect(updatedTask.description).toBe(data.description);
            expect(updatedTask.isCompleted).toBe(false);
          })
})

// Test delete the task
test('DELETE /api/tasks/:id', async () => {
  const task = await Task.create({
    description: 'Task 1'
  });

  await supertest(app)
          .delete('/api/tasks/' + task.id)
          .expect(204)
          .then(async () => {
            expect(await Task.findOne({ _id: task.id })).toBeFalsy();
          })
})

// Test toggle task complete
test('PATCH /api/tasks/:id', async () => {
  const task = await Task.create({
    description: 'Task 1',
    isCompleted: false
  });

  const data = {
    isCompleted: !task.isCompleted
  };

  await supertest(app)
          .patch('/api/tasks/' + task.id)
          .send(data)
          .expect(200)
          .then(async (response) => {
            // Check the server response
            expect(response.body._id).toBe(task.id);
            expect(response.body.description).toBe(task.description);
            expect(response.body.isCompleted).toBe(data.isCompleted)

            // Check the data in the DB
            const newTask = await Task.findOne({ _id: response.body._id })
            expect(newTask).toBeTruthy();
            expect(newTask.description).toBe(task.description);
            expect(newTask.isCompleted).toBe(data.isCompleted)
          })
})