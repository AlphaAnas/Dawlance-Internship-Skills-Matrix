import mongoose from 'mongoose';

const EmployeeSkillSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  level: {
    type: String,
    enum: ['None', 'Low', 'Medium', 'High', 'Expert'],
    required: true
  },
  acquiredDate: {
    type: Date,
    default: Date.now
  },
  lastAssessedDate: {
    type: Date,
    default: Date.now
  },
  certificationDate: {
    type: Date
  },
  notes: {
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

// Compound index to ensure unique employee-skill combinations
EmployeeSkillSchema.index({ employeeId: 1, skillId: 1, is_deleted: 1 }, { unique: true });
EmployeeSkillSchema.index({ is_deleted: 1 });
EmployeeSkillSchema.index({ level: 1, is_deleted: 1 });

export default mongoose.models.EmployeeSkill || mongoose.model('EmployeeSkill', EmployeeSkillSchema);
