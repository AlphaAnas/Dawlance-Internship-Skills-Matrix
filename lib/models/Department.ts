import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
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

// Add index for soft delete queries
DepartmentSchema.index({ is_deleted: 1 });

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
