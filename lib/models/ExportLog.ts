import mongoose from 'mongoose';

const ExportLogSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  exportType: {
    type: String,
    enum: ['SKILL_MATRIX', 'EMPLOYEE_REPORT', 'PERFORMANCE_REPORT', 'WORK_HISTORY'],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  recordCount: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes
ExportLogSchema.index({ is_deleted: 1 });
ExportLogSchema.index({ managerId: 1, createdAt: -1, is_deleted: 1 });
ExportLogSchema.index({ departmentId: 1, createdAt: -1, is_deleted: 1 });
ExportLogSchema.index({ status: 1, is_deleted: 1 });

export default mongoose.models.ExportLog || mongoose.model('ExportLog', ExportLogSchema);
