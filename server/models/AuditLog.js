import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'system_user'
  },
  username: {
    type: String,
    default: 'Anonymous'
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  targetId: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// In-memory logs array fallback
const inMemoryLogs = [
  {
    _id: `log_init_1`,
    userId: 'usr_admin',
    username: 'Saumya Patel',
    action: 'LOGIN',
    details: 'User logged in successfully via 2-Step Authentication',
    targetId: 'session_8923',
    ipAddress: '127.0.0.1',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    _id: `log_init_2`,
    userId: 'usr_admin',
    username: 'Saumya Patel',
    action: 'TASK_CREATE',
    details: 'Created task "Practical 5: Express & Mongoose Integration"',
    targetId: '66f1a0133c5991000001',
    ipAddress: '127.0.0.1',
    timestamp: new Date(Date.now() - 1800000)
  }
];

export const logActivity = async ({ userId = 'usr_guest', username = 'Guest User', action, details, targetId = '', ipAddress = '127.0.0.1' }) => {
  const logEntry = {
    userId: userId || 'usr_guest',
    username: username || 'Guest User',
    action,
    details: details || '',
    targetId: targetId || '',
    ipAddress: ipAddress || '127.0.0.1',
    timestamp: new Date()
  };

  try {
    if (mongoose.connection.readyState === 1) {
      await AuditLog.create(logEntry);
    } else {
      inMemoryLogs.unshift({
        _id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        ...logEntry
      });
    }
  } catch (err) {
    console.error('Failed to save audit log:', err.message);
    // Push fallback
    inMemoryLogs.unshift({
      _id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      ...logEntry
    });
  }
};

export const getAuditLogs = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return await AuditLog.find().sort({ timestamp: -1 });
    } else {
      return [...inMemoryLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  } catch (err) {
    return inMemoryLogs;
  }
};

export default AuditLog;
