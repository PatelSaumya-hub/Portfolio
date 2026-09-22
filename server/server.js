import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import logRoutes from './routes/logRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { getTaskModel } from './models/TaskStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'MongoDB (Connected)' : 'In-Memory Task Database (Active)',
    timestamp: new Date()
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Function to seed database with initial tasks if empty
const seedDatabaseIfEmpty = async () => {
  try {
    const TaskModel = getTaskModel();
    const count = await TaskModel.countDocuments();
    if (count === 0) {
      console.log('Seeding initial sample tasks into database...');
      await TaskModel.create([
        {
          title: ' Practical 5: Express & Mongoose Integration ', // whitespace for title trimming hook!
          description: 'Connect Express server to MongoDB database using Mongoose ODM with schema validation.',
          instructions: '1. Configure .env file with MONGO_URI.\n2. Create Task schema with required fields, pre-save title trim hook, and priority enum.\n3. Implement structured error handling middleware for Mongoose validation errors.',
          priority: 'high',
          completed: false,
          subtasks: [
            {
              title: 'Set up MongoDB Connection & dotenv',
              instructions: 'Install mongoose and dotenv packages, read MONGO_URI from environment variables.',
              completed: true
            },
            {
              title: 'Define Task Schema & Pre-save Hook',
              instructions: 'Create schema in models/Task.js with required title, priority enum [low, medium, high], and title trimming hook.',
              completed: true
            },
            {
              title: 'Implement Structured Error Handler',
              instructions: 'Format Mongoose ValidationError and CastError into clean JSON error objects instead of raw dumps.',
              completed: false
            },
            {
              title: 'Build CRUD API Endpoints',
              instructions: 'Create GET, POST, PUT, DELETE endpoints for tasks and subtask status updates.',
              completed: false
            },
            {
              title: 'Test API with Postman / Thunder Client',
              instructions: 'Verify valid and invalid payloads against live MongoDB instance.',
              completed: false
            }
          ]
        },
        {
          title: 'Design Task Manager Frontend & Subtask Pager',
          description: 'Build an interactive React UI supporting task detail pages, step-by-step subtask pagination, delete confirmation, and toast alerts.',
          instructions: 'Implement navigation routes (/tasks and /tasks/:id) with state management, delete modal prompts, and task completion toasts.',
          priority: 'high',
          completed: false,
          subtasks: [
            {
              title: 'Create Delete Confirmation Modal',
              instructions: 'Display "Are you sure you want to delete this?" alert modal before performing delete actions.',
              completed: true
            },
            {
              title: 'Build Toast Notification System',
              instructions: 'Show floating alerts whenever tasks or subtasks are created, completed, or deleted.',
              completed: true
            },
            {
              title: 'Build Subtask Step Pagination View',
              instructions: 'Showcase task subtasks on a dedicated page with step-by-step 1-by-1 pagination and next task jump button.',
              completed: false
            }
          ]
        },
        {
          title: 'Deploy & Optimize API Routes',
          description: 'Conduct final review of error handling, environment configs, and code documentation.',
          instructions: 'Ensure .env is gitignored and .env.example is provided.',
          priority: 'medium',
          completed: false,
          subtasks: [
            {
              title: 'Verify .gitignore settings',
              instructions: 'Ensure .env file is safely excluded from git commits.',
              completed: true
            },
            {
              title: 'Create .env.example',
              instructions: 'Provide example environment configuration file.',
              completed: true
            }
          ]
        }
      ]);
      console.log('Sample tasks successfully seeded!');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

// Start Express Server
const startServer = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/task_db';

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('MongoDB connected successfully!');
  } catch (err) {
    await mongoose.disconnect().catch(() => {});
    console.log(`MongoDB connection not active (${err.message}). Using built-in database store fallback.`);
  }

  await seedDatabaseIfEmpty();

  const server = app.listen(PORT, () => {
    console.log(`Express Task Server running on http://localhost:${PORT}`);
  });

  // Keep event loop active
  setInterval(() => {}, 30000);
};

startServer();
