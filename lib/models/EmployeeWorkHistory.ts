import mongoose from 'mongoose';

const EmployeeWorkHistorySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine'
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  workDate: {
    type: Date,
    required: true
  },
  hoursWorked: {
    type: Number,
    default: 8
  },
  productivity: {
    type: Number, // percentage or units produced
    default: 0
  },
  qualityScore: {
    type: Number, // quality rating
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  shift: {
    type: String,
    enum: ['DAY', 'NIGHT', 'EVENING'],
    default: 'DAY'
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes
EmployeeWorkHistorySchema.index({ is_deleted: 1 });
EmployeeWorkHistorySchema.index({ employeeId: 1, workDate: -1, is_deleted: 1 });
EmployeeWorkHistorySchema.index({ departmentId: 1, workDate: -1, is_deleted: 1 });
EmployeeWorkHistorySchema.index({ machineId: 1, workDate: -1, is_deleted: 1 });

export default mongoose.models.EmployeeWorkHistory || mongoose.model('EmployeeWorkHistory', EmployeeWorkHistorySchema);
