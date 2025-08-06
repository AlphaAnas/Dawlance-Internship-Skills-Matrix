import mongoose from 'mongoose';

const SkillMatrixSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    ref: 'Employee',
    required: true
  },
  
  description: {
    type: String,
    default: ''
  },
  matrixData: {
    type: Object, // JSON structure containing the skill matrix data
    required: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager'
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes
SkillMatrixSchema.index({ is_deleted: 1 });
SkillMatrixSchema.index({ departmentId: 1, isActive: 1, is_deleted: 1 });
SkillMatrixSchema.index({ createdBy: 1, is_deleted: 1 });

export default mongoose.models.SkillMatrix || mongoose.model('SkillMatrix', SkillMatrixSchema);
