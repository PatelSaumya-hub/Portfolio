import express from 'express';
import { getAuditLogs } from '../models/AuditLog.js';
import * as XLSX from 'xlsx';

const router = express.Router();

// GET /api/logs - Fetch all system audit logs
router.get('/', async (req, res, next) => {
  try {
    const { action, search } = req.query;
    let logs = await getAuditLogs();

    if (action && action !== 'all') {
      logs = logs.filter(l => l.action.toLowerCase() === action.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        (l.username && l.username.toLowerCase().includes(q)) ||
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.details && l.details.toLowerCase().includes(q)) ||
        (l.userId && l.userId.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/logs/export-excel - Generate and download Excel spreadsheet (.xlsx) of activity logs
router.get('/export-excel', async (req, res, next) => {
  try {
    const logs = await getAuditLogs();

    // Map logs to clean Excel row objects
    const excelRows = logs.map(l => ({
      'Log Entry ID': String(l._id),
      'User ID': l.userId || 'N/A',
      'Username': l.username || 'Anonymous',
      'Action Performed': l.action,
      'Details': l.details || '',
      'Target ID': l.targetId || 'N/A',
      'IP Address': l.ipAddress || '127.0.0.1',
      'Timestamp': new Date(l.timestamp).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      })
    }));

    // Create XLSX workbook & worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    
    // Set column widths for readability
    worksheet['!cols'] = [
      { wch: 24 }, // Log ID
      { wch: 15 }, // User ID
      { wch: 20 }, // Username
      { wch: 22 }, // Action
      { wch: 45 }, // Details
      { wch: 24 }, // Target ID
      { wch: 14 }, // IP Address
      { wch: 24 }  // Timestamp
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Activity Audit Logs');

    // Buffer output
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="activity_audit_logs.xlsx"');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

export default router;
