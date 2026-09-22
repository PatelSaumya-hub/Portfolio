import express from 'express';
import { getTaskModel } from '../models/TaskStore.js';
import { logActivity } from '../models/AuditLog.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper to extract active user context from headers
const getUserContext = (req) => {
  return {
    userId: req.headers['x-user-id'] || 'usr_demo',
    username: req.headers['x-user-name'] || 'Saumya Patel'
  };
};

// GET /api/tasks - Retrieve all tasks (with optional search, priority, completed filters)
router.get('/', async (req, res, next) => {
  try {
    const { priority, completed, search } = req.query;
    const filter = {};

    if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      filter.priority = priority.toLowerCase();
    }

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructions: { $regex: search, $options: 'i' } }
      ];
    }

    const TaskModel = getTaskModel();
    const tasks = await TaskModel.find(filter);
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id - Retrieve a single task by ID (returns 404 if not found)
router.get('/:id', async (req, res, next) => {
  try {
    const TaskModel = getTaskModel();
    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Resource Not Found',
        message: `Task with ID '${req.params.id}' was not found.`
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks - Create a new task (enforces Mongoose schema validation)
router.post('/', async (req, res, next) => {
  try {
    const { title, description, instructions, priority, subtasks } = req.body;
    const { userId, username } = getUserContext(req);
    const TaskModel = getTaskModel();

    let savedTask;
    if (mongoose.connection.readyState === 1) {
      const newTask = new TaskModel({
        title,
        description,
        instructions,
        priority,
        subtasks: Array.isArray(subtasks) ? subtasks : []
      });
      savedTask = await newTask.save();
    } else {
      savedTask = await TaskModel.create({
        title,
        description,
        instructions,
        priority,
        subtasks: Array.isArray(subtasks) ? subtasks : []
      });
    }

    // Log Activity
    await logActivity({
      userId,
      username,
      action: 'TASK_CREATE',
      details: `Created task "${savedTask.title}" [Priority: ${savedTask.priority.toUpperCase()}]`,
      targetId: String(savedTask._id)
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', async (req, res, next) => {
  try {
    const TaskModel = getTaskModel();
    const { userId, username } = getUserContext(req);
    const { title, description, instructions, completed, priority, subtasks } = req.body;

    let updatedTask;
    if (mongoose.connection.readyState === 1) {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Task with ID '${req.params.id}' was not found.`
        });
      }

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (instructions !== undefined) task.instructions = instructions;
      if (completed !== undefined) task.completed = completed;
      if (priority !== undefined) task.priority = priority;
      if (subtasks !== undefined) task.subtasks = subtasks;

      updatedTask = await task.save();
    } else {
      updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, req.body);
      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Task with ID '${req.params.id}' was not found.`
        });
      }
    }

    // Log Activity
    await logActivity({
      userId,
      username,
      action: 'TASK_UPDATE',
      details: `Updated task "${updatedTask.title}" (Completed: ${updatedTask.completed})`,
      targetId: String(updatedTask._id)
    });

    return res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const TaskModel = getTaskModel();
    const { userId, username } = getUserContext(req);
    const deletedTask = await TaskModel.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Resource Not Found',
        message: `Task with ID '${req.params.id}' was not found.`
      });
    }

    // Log Activity
    await logActivity({
      userId,
      username,
      action: 'TASK_DELETE',
      details: `Deleted task ID ${req.params.id} ("${deletedTask.title}")`,
      targetId: String(req.params.id)
    });

    res.json({
      success: true,
      message: `Task '${deletedTask.title}' was deleted successfully`,
      data: deletedTask
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks/:id/subtasks - Add a subtask to a task
router.post('/:id/subtasks', async (req, res, next) => {
  try {
    const TaskModel = getTaskModel();
    const { userId, username } = getUserContext(req);
    const { title, instructions } = req.body;

    let updatedTask;
    if (mongoose.connection.readyState === 1) {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Task with ID '${req.params.id}' was not found.`
        });
      }

      task.subtasks.push({ title, instructions, completed: false });
      updatedTask = await task.save();
    } else {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Task with ID '${req.params.id}' was not found.`
        });
      }

      const newSubtask = {
        _id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: (title || '').trim(),
        instructions: instructions || '',
        completed: false,
        createdAt: new Date()
      };

      task.subtasks.push(newSubtask);
      updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, task);
    }

    await logActivity({
      userId,
      username,
      action: 'SUBTASK_ADD',
      details: `Added subtask "${title}" to task "${updatedTask.title}"`,
      targetId: String(updatedTask._id)
    });

    return res.status(201).json({
      success: true,
      message: 'Subtask added successfully',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/subtasks/:subtaskId - Update subtask completion status
router.patch('/:id/subtasks/:subtaskId', async (req, res, next) => {
  try {
    const TaskModel = getTaskModel();
    const { userId, username } = getUserContext(req);

    let updatedTask;
    let subtaskTitle = '';
    let isCompletedNow = false;

    if (mongoose.connection.readyState === 1) {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Task with ID '${req.params.id}' was not found.`
        });
      }

      const subtask = task.subtasks.id(req.params.subtaskId);
      if (!subtask) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Subtask with ID '${req.params.subtaskId}' was not found.`
        });
      }

      if (req.body.completed !== undefined) subtask.completed = req.body.completed;
      if (req.body.title !== undefined) subtask.title = req.body.title;
      if (req.body.instructions !== undefined) subtask.instructions = req.body.instructions;

      subtaskTitle = subtask.title;
      isCompletedNow = subtask.completed;

      if (task.subtasks.length > 0) {
        task.completed = task.subtasks.every(st => st.completed);
      }

      updatedTask = await task.save();
    } else {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Task with ID '${req.params.id}' was not found.`
        });
      }

      const subtask = task.subtasks.find(st => String(st._id) === String(req.params.subtaskId));
      if (!subtask) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Subtask with ID '${req.params.subtaskId}' was not found.`
        });
      }

      if (req.body.completed !== undefined) subtask.completed = req.body.completed;
      if (req.body.title !== undefined) subtask.title = req.body.title;
      if (req.body.instructions !== undefined) subtask.instructions = req.body.instructions;

      subtaskTitle = subtask.title;
      isCompletedNow = subtask.completed;

      if (task.subtasks.length > 0) {
        task.completed = task.subtasks.every(st => st.completed);
      }

      updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, task);
    }

    await logActivity({
      userId,
      username,
      action: 'SUBTASK_TOGGLE',
      details: `Subtask step "${subtaskTitle}" in task "${updatedTask.title}" marked as ${isCompletedNow ? 'completed' : 'pending'}`,
      targetId: String(req.params.subtaskId)
    });

    return res.json({
      success: true,
      message: 'Subtask updated successfully',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id/subtasks/:subtaskId - Delete a specific subtask
router.delete('/:id/subtasks/:subtaskId', async (req, res, next) => {
  try {
    const TaskModel = getTaskModel();
    const { userId, username } = getUserContext(req);

    let updatedTask;
    let subtaskTitle = '';

    if (mongoose.connection.readyState === 1) {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Task with ID '${req.params.id}' was not found.`
        });
      }

      const subtask = task.subtasks.id(req.params.subtaskId);
      if (!subtask) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Subtask with ID '${req.params.subtaskId}' was not found.`
        });
      }

      subtaskTitle = subtask.title;
      subtask.deleteOne();
      updatedTask = await task.save();
    } else {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Task with ID '${req.params.id}' was not found.`
        });
      }

      const subIndex = task.subtasks.findIndex(st => String(st._id) === String(req.params.subtaskId));
      if (subIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Resource Not Found',
          message: `Subtask with ID '${req.params.subtaskId}' was not found.`
        });
      }

      subtaskTitle = task.subtasks[subIndex].title;
      task.subtasks.splice(subIndex, 1);
      updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, task);
    }

    await logActivity({
      userId,
      username,
      action: 'SUBTASK_DELETE',
      details: `Deleted subtask step ID ${req.params.subtaskId} ("${subtaskTitle}") from task "${updatedTask.title}"`,
      targetId: String(req.params.subtaskId)
    });

    return res.json({
      success: true,
      message: 'Subtask deleted successfully',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
});

export default router;
