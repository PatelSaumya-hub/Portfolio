import Task from './Task.js';
import mongoose from 'mongoose';

// In-Memory fallback store matching Mongoose Schema validation & operations
class InMemoryTaskStore {
  constructor() {
    this.tasks = [];
    this.idCounter = 1;
  }

  // Helper for structured Mongoose-like validation
  validateTaskData(data) {
    const errors = [];
    
    let title = data.title;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      errors.push({ field: 'title', message: 'Task title is required' });
    } else {
      // Pre-save hook simulation: auto-trim whitespace from title
      title = title.trim();
    }

    const priority = data.priority ? String(data.priority).toLowerCase() : 'medium';
    if (!['low', 'medium', 'high'].includes(priority)) {
      errors.push({
        field: 'priority',
        message: `${data.priority} is not a valid priority. Allowed values are low, medium, high.`
      });
    }

    if (errors.length > 0) {
      const err = new Error('Validation Error');
      err.name = 'ValidationError';
      err.errors = {};
      errors.forEach(e => {
        err.errors[e.field] = { message: e.message };
      });
      throw err;
    }

    return {
      title,
      description: data.description || '',
      instructions: data.instructions || '',
      priority,
      completed: Boolean(data.completed),
      subtasks: Array.isArray(data.subtasks)
        ? data.subtasks.map((st, idx) => ({
            _id: st._id || `sub_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
            title: (st.title || '').trim(),
            instructions: st.instructions || '',
            completed: Boolean(st.completed),
            createdAt: st.createdAt || new Date()
          }))
        : [],
      createdAt: data.createdAt || new Date()
    };
  }

  async find(filter = {}) {
    let result = [...this.tasks];

    if (filter.priority) {
      result = result.filter(t => t.priority === filter.priority);
    }
    if (filter.completed !== undefined) {
      result = result.filter(t => t.completed === filter.completed);
    }
    if (filter.$or) {
      const searchTerms = filter.$or;
      result = result.filter(t => {
        return searchTerms.some(term => {
          const key = Object.keys(term)[0];
          const regex = term[key].$regex;
          const val = t[key] || '';
          return new RegExp(regex, 'i').test(val);
        });
      });
    }

    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findById(id) {
    const task = this.tasks.find(t => String(t._id) === String(id));
    if (!task) {
      return null;
    }
    return task;
  }

  async create(data) {
    if (Array.isArray(data)) {
      const created = [];
      for (const item of data) {
        const validated = this.validateTaskData(item);
        validated._id = `66f${Date.now().toString(16)}${(this.idCounter++).toString(16).padStart(6, '0')}`;
        this.tasks.unshift(validated);
        created.push(validated);
      }
      return created;
    }

    const validated = this.validateTaskData(data);
    validated._id = `66f${Date.now().toString(16)}${(this.idCounter++).toString(16).padStart(6, '0')}`;
    this.tasks.unshift(validated);
    return validated;
  }

  async findByIdAndUpdate(id, updates) {
    const taskIndex = this.tasks.findIndex(t => String(t._id) === String(id));
    if (taskIndex === -1) return null;

    const current = this.tasks[taskIndex];
    const merged = { ...current, ...updates };
    const validated = this.validateTaskData(merged);
    validated._id = current._id;
    this.tasks[taskIndex] = validated;
    return validated;
  }

  async findByIdAndDelete(id) {
    const taskIndex = this.tasks.findIndex(t => String(t._id) === String(id));
    if (taskIndex === -1) return null;

    const [deleted] = this.tasks.splice(taskIndex, 1);
    return deleted;
  }

  async countDocuments() {
    return this.tasks.length;
  }
}

export const inMemoryStore = new InMemoryTaskStore();

// Unified Model Dispatcher: Uses Mongoose if connected, else InMemoryStore
export const getTaskModel = () => {
  if (mongoose.connection.readyState === 1) {
    return Task;
  }
  return inMemoryStore;
};
